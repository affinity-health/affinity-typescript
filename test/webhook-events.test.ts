import apiFixtures from "./fixtures/api-order-events.json";
import { describe, expect, test } from "bun:test";
import {
  AffinityWebhookVerificationError,
  affinityWebhookEventTypes,
  type AffinityWebhookEvent,
  parseAffinityWebhookEvent,
  verifyAffinityWebhook,
} from "../src";

const timestamp = 1_785_323_400;
const now = new Date(timestamp * 1_000);
const secret = "whsec_test_example_signing_secret";
const event = {
  api_version: "2026-08-11",
  created: timestamp,
  data: {
    object: {
      id: "ord_01k123456789abcdefghjkmnpq",
      object: "order",
      practice_id: "prac_01k123456789abcdefghjkmnpq",
      status: "submitted",
      updated_at: "2026-07-29T12:30:00.000Z",
    },
    previous_attributes: {
      status: "draft",
    },
  },
  id: "evt_01k123456789abcdefghjkmnpq",
  livemode: false,
  object: "event",
  organization_id: "acct_01k123456789abcdefghjkmnpq",
  request_id: "req_01k123456789abcdefghjkmnpq",
  type: "order.submitted",
} as const satisfies AffinityWebhookEvent;

describe("Affinity webhook events", () => {
  test("verifies every MVP event produced by the API codecs and delivery signer", async () => {
    for (const fixture of apiFixtures) {
      const verified = await verifyAffinityWebhook({
        ...fixture,
        now: new Date(fixture.timestamp * 1000),
      });
      expect(verified).toEqual(JSON.parse(fixture.body));
    }
  });

  test("rejects an invalid verification clock", async () => {
    const fixture = apiFixtures[0]!;
    await expect(verifyAffinityWebhook({ ...fixture, now: new Date(NaN) })).rejects.toMatchObject({
      code: "invalid_timestamp",
    });
  });

  test.each(["Uint8Array", "ArrayBuffer", "subarray", "Buffer"])(
    "parses the signed snapshot when the caller mutates its %s body",
    async (kind) => {
      const bodyText = JSON.stringify(event);
      const fixture = {
        body: bodyText,
        timestamp,
        secret,
        signature: await sign(bodyText, secret, timestamp),
      };
      const original = new TextEncoder().encode(fixture.body);
      const storage = new Uint8Array(original.length + 8);
      storage.set(original, 4);
      const view = kind === "subarray" ? storage.subarray(4, -4) : original;
      const body =
        kind === "ArrayBuffer" ? view.buffer : kind === "Buffer" ? Buffer.from(view) : view;
      const pending = verifyAffinityWebhook({
        ...fixture,
        body,
        now: new Date(fixture.timestamp * 1000),
      });
      const mutated = fixture.body.replace('"livemode":false', '"livemode":true ');
      expect(mutated).not.toBe(fixture.body);
      expect(mutated.length).toBe(fixture.body.length);
      const bytes = body instanceof ArrayBuffer ? new Uint8Array(body) : body;
      bytes.set(new TextEncoder().encode(mutated));
      expect(JSON.parse(new TextDecoder().decode(bytes)).livemode).toBe(true);
      expect(await pending).toEqual(JSON.parse(fixture.body));
    },
  );

  test("preserves MVP payloads with future versions, event types, statuses and fields", async () => {
    const payload = JSON.parse(apiFixtures[0]!.body);
    for (const changed of [
      { ...payload, api_version: "2099-01-01", futureField: true },
      { ...payload, type: "order.future_event", data: { futureObject: {} } },
      {
        ...payload,
        data: { order: { ...payload.data.order, status: "future_status", futureField: {} } },
      },
    ]) {
      const body = JSON.stringify(changed);
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
    }
  });

  test("authenticates JSON before decoding and rejects invalid JSON", async () => {
    const body = "{invalid JSON";
    await expect(
      verifyAffinityWebhook({ body, now, secret, signature: await sign(body, secret, timestamp) }),
    ).rejects.toMatchObject({ code: "invalid_body" });
    await expect(
      verifyAffinityWebhook({
        body: body + " ",
        now,
        secret,
        signature: await sign(body, secret, timestamp),
      }),
    ).rejects.toMatchObject({ code: "invalid_signature" });
  });

  test("accepts opaque IDs, unknown event types and additive fields", async () => {
    for (const changed of [
      { id: "evt_new_id_format", type: "order.future_event", extra: true, data: { future: 42 } },
      {
        id: "opaque",
        type: "order.updated",
        data: { order: { id: "opaque_order", status: "new_status", extra: {} } },
      },
    ]) {
      const body = JSON.stringify(changed);
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(changed);
    }
  });

  test("verifies authenticity independently of MVP payload shape", async () => {
    const payload = JSON.parse(apiFixtures[0]!.body);
    for (const fields of [
      { id: "bad" },
      { status: 42 },
      { shipments: {} },
      { shipments: [{ carrier: null, trackingNumber: 42, trackingUrl: null }] },
      { updatedAt: null },
      { cancelRequestedAt: "bad" },
    ]) {
      const body = JSON.stringify({
        ...payload,
        data: { order: { ...payload.data.order, ...fields } },
      });
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
    }
    for (const data of [{}, { order: null }]) {
      const body = JSON.stringify({ ...payload, data });
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
    }
  });

  test("verifies uppercase API signatures and raw bytes while rejecting tampering and stale deliveries", async () => {
    for (const fixture of apiFixtures) {
      const now = new Date(fixture.timestamp * 1000);
      const options = { ...fixture, now };
      const expected = JSON.parse(fixture.body);
      await expect(
        verifyAffinityWebhook({
          ...options,
          signature: fixture.signature.replace(
            /v1=(.*)/u,
            (_, hex: string) => `v1=${hex.toUpperCase()}`,
          ),
        }),
      ).resolves.toEqual(expected);
      const bytes = new TextEncoder().encode(fixture.body);
      await expect(verifyAffinityWebhook({ ...options, body: bytes })).resolves.toEqual(expected);
      await expect(verifyAffinityWebhook({ ...options, body: bytes.buffer })).resolves.toEqual(
        expected,
      );
      await expect(
        verifyAffinityWebhook({ ...options, body: fixture.body + " " }),
      ).rejects.toMatchObject({ code: "invalid_signature" });
      await expect(
        verifyAffinityWebhook({ ...options, now: new Date((fixture.timestamp + 301) * 1000) }),
      ).rejects.toMatchObject({ code: "timestamp_outside_tolerance" });
      await expect(
        verifyAffinityWebhook({ ...options, now: new Date((fixture.timestamp - 301) * 1000) }),
      ).rejects.toMatchObject({ code: "timestamp_outside_tolerance" });
    }
  });

  test("accepts signed order snapshots and additive fields for every order event", async () => {
    for (const type of affinityWebhookEventTypes.filter(
      (type) => type !== "webhook_endpoint.test",
    )) {
      const snapshot = {
        ...event,
        type,
        data: {
          object: {
            ...event.data.object,
            metadata: { source: "synthetic", sequence: 1, reviewed: true, optional: null },
            estimated_delivery_at: "2026-07-30T12:30:00.000Z",
            prescriptions: [
              { id: "rx_01k123456789abcdefghjkmnpq", external_prescription_id: "synthetic-rx" },
            ],
            fulfillments: [],
            review: null,
            review_status: null,
            tracking_status: "in_transit",
            tracking_url: "https://example.test/tracking",
            future_operational_field: { value: true },
          },
          previous_attributes: { metadata: {}, estimated_delivery_at: null },
        },
        future_envelope_field: "synthetic",
      };
      const body = JSON.stringify(snapshot);
      expect(
        await verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).toEqual(JSON.parse(body));
      await expect(
        verifyAffinityWebhook({
          body: body + " ",
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).rejects.toMatchObject({ code: "invalid_signature" });
    }
  });

  test("retains legacy thin order and endpoint-test payloads", async () => {
    for (const payload of [
      { ...event, data: { object: { id: event.data.object.id, object: "order" } } },
      {
        ...event,
        type: "webhook_endpoint.test",
        data: { object: { id: "whe_01k123456789abcdefghjkmnpq", object: "webhook_endpoint" } },
      },
    ]) {
      const body = JSON.stringify(payload);
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
    }
  });

  test("verifies an immutable historical accepted snapshot without rewriting its status", async () => {
    const historical = {
      ...event,
      type: "order.accepted",
      data: { object: { ...event.data.object, status: "accepted" } },
    };
    const body = JSON.stringify(historical);
    expect(
      await verifyAffinityWebhook({
        body,
        now,
        secret,
        signature: await sign(body, secret, timestamp),
      }),
    ).toEqual(JSON.parse(body));
  });

  test("verifies signed payloads independently of legacy shape", async () => {
    for (const fields of [
      { id: "bad" },
      { status: 42 },
      { metadata: [] },
      { estimated_delivery_at: "bad" },
    ]) {
      const body = JSON.stringify({
        ...event,
        data: { object: { ...event.data.object, ...fields } },
      });
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
    }
  });

  test("accepts newer API versions, event types and order statuses", async () => {
    for (const changed of [
      { ...event, api_version: "2099-01-01" },
      {
        ...event,
        type: "order.future_event",
        data: { object: { id: "anything", object: "order" } },
      },
      { ...event, data: { object: { ...event.data.object, status: "future_status" } } },
    ]) {
      const body = JSON.stringify(changed);
      await expect(
        verifyAffinityWebhook({
          body,
          now,
          secret,
          signature: await sign(body, secret, timestamp),
        }),
      ).resolves.toEqual(JSON.parse(body));
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

  test("verifies the exact raw body without rewriting the payload", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    const verified = await verifyAffinityWebhook({ body, now, secret, signature });

    expect(verified.type).toBe("order.submitted");
    expect(verified).toEqual(event);
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

  test("unsigned envelope parsing checks only its envelope", () => {
    expect(parseAffinityWebhookEvent({ id: "opaque", type: "future", data: {} })).toEqual({
      id: "opaque",
      type: "future",
      data: {},
    });
    expect(() => parseAffinityWebhookEvent(null)).toThrow(AffinityWebhookVerificationError);
    expect(() => parseAffinityWebhookEvent({ id: 42, type: "future", data: {} })).toThrow(
      AffinityWebhookVerificationError,
    );
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
