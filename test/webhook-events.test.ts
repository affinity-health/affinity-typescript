import apiFixtures from "./fixtures/api-order-events.json";
import { describe, expect, test } from "bun:test";
import {
  AffinityWebhookVerificationError,
  parseAffinityWebhookEvent,
  verifyAffinityWebhook,
} from "../src";

const timestamp = 1_785_323_400;
const now = new Date(timestamp * 1_000);
const secret = "whsec_test_example_signing_secret";
const event = apiFixtures[0]!;

describe("Affinity webhook events", () => {
  test("verifies MVP order and test-event payloads matching the API serializer", async () => {
    for (const event of apiFixtures) {
      const body = JSON.stringify(event);
      expect(
        await verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).toEqual(event);
    }
  });
  test("accepts additive fields, future event types and statuses", async () => {
    for (const changed of [
      { ...event, type: "order.future", data: { future: true } },
      { ...event, future: 1 },
      { ...event, data: { order: { ...event.data.order, status: "future_status" } } },
    ]) {
      const body = JSON.stringify(changed);
      expect(
        await verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).toEqual(changed);
    }
  });
  test("rejects malformed known order fields even with a valid signature", async () => {
    for (const fields of [
      { id: "bad" },
      { status: 42 },
      { shipments: null },
      { updatedAt: "bad" },
    ]) {
      const body = JSON.stringify({
        ...event,
        data: { order: { ...event.data.order, ...fields } },
      });
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).rejects.toMatchObject({ code: "invalid_event" });
    }
  });

  test("accepts upper-case hex and names a malformed signature", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    await expect(
      verifyAffinityWebhook({
        body,
        now,
        secret,
        signature: signature.toUpperCase().replace("T=", "t=").replace("V1=", "v1="),
      }),
    ).resolves.toEqual(event);
    await expect(
      verifyAffinityWebhook({ body, now, secret, signature: `t=${timestamp},v1=not-hex` }),
    ).rejects.toMatchObject({
      code: "invalid_signature",
      message: "Webhook signature is malformed",
    });
  });

  test("verifies the exact raw body and returns a narrowed event union", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    const verified = await verifyAffinityWebhook({ body, now, secret, signature });

    expect(verified.type).toBe("order.shipped");
    expect(verified.data.order?.status).toBe("shipped");
  });

  test("accepts any currently active signing secret during rotation", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);

    await expect(
      verifyAffinityWebhook({
        body,
        now,
        secret: ["whsec_test_previous_signing_secret", secret],
        signature,
      }),
    ).resolves.toEqual(event);
  });

  test("rejects an invalid verification clock before replay checking", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    for (const milliseconds of [NaN, Infinity, -Infinity]) {
      await expect(
        verifyAffinityWebhook({ body, now: new Date(milliseconds), secret, signature }),
      ).rejects.toMatchObject({ code: "invalid_timestamp" });
    }
  });

  test("accepts the replay boundary and rejects timestamps outside it", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    for (const offset of [-300, 0, 300]) {
      await expect(
        verifyAffinityWebhook({
          body,
          now: new Date((timestamp + offset) * 1000),
          secret,
          signature,
        }),
      ).resolves.toEqual(event);
    }
    for (const offset of [-301, 301]) {
      await expect(
        verifyAffinityWebhook({
          body,
          now: new Date((timestamp + offset) * 1000),
          secret,
          signature,
        }),
      ).rejects.toMatchObject({ code: "timestamp_outside_tolerance" });
    }
    await expect(
      verifyAffinityWebhook({ body, now, secret, signature, toleranceSeconds: 0 }),
    ).resolves.toEqual(event);
  });

  for (const kind of ["Uint8Array", "ArrayBuffer", "subarray", "Buffer"] as const) {
    test(`parses the verified snapshot when caller mutates ${kind} during crypto`, async () => {
      const original = JSON.stringify(event);
      const signed = await sign(original, secret, timestamp);
      const encoded = new TextEncoder().encode(original);
      const storage = kind === "Buffer" ? Buffer.from(encoded) : new Uint8Array(encoded.length + 8);
      const bytes = kind === "Buffer" ? storage : storage.subarray(4, 4 + encoded.length);
      bytes.set(encoded);
      const body =
        kind === "ArrayBuffer" ? encoded.buffer : kind === "Uint8Array" ? encoded : bytes;
      const mutable = body instanceof ArrayBuffer ? new Uint8Array(body) : body;
      const pending = verifyAffinityWebhook({ body, now, secret, signature: signed });
      mutable.set(
        new TextEncoder().encode(original.replace('"status":"shipped"', '"status":"failed" ')),
      );
      expect(await pending).toEqual(event);
    });
  }

  test("rejects a tampered body and an old timestamp", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);

    await expect(
      verifyAffinityWebhook({ body: `${body} `, now, secret, signature }),
    ).rejects.toMatchObject({
      code: "invalid_signature",
    });
    await expect(
      verifyAffinityWebhook({
        body,
        now: new Date((timestamp + 301) * 1_000),
        secret,
        signature,
      }),
    ).rejects.toMatchObject({
      code: "timestamp_outside_tolerance",
    });
  });

  test("rejects the retired webhook envelope", () => {
    expect(() =>
      parseAffinityWebhookEvent({
        id: event.id,
        type: "order.shipped",
        created: timestamp,
        data: { object: event.data.order },
      }),
    ).toThrow(AffinityWebhookVerificationError);
  });
});

async function sign(body: string, signingSecret: string, signedAt: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signingSecret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${signedAt}.${body}`),
  );
  return `t=${signedAt},v1=${Buffer.from(signature).toString("hex")}`;
}
