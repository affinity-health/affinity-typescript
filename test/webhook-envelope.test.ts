import { describe, expect, test } from "bun:test";
import fixtures from "./fixtures/api-order-events.json";
import { verifyAffinityWebhook, verifyAffinityWebhookEnvelope } from "../src";

const fixture = fixtures[0]!;
const now = new Date(fixture.timestamp * 1000);
const original = JSON.parse(fixture.body);

async function signed(value: unknown) {
  const body = JSON.stringify(value);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(fixture.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${fixture.timestamp}.${body}`),
  );
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
  return { body, signature: `t=${fixture.timestamp},v1=${hex}`, secret: fixture.secret, now };
}

describe("opt-in forward-compatible webhook envelopes", () => {
  test.each(["version", "type", "status"])(
    "accepts a future %s without widening strict events",
    async (kind) => {
      const event = structuredClone(original);
      if (kind === "version") event.api_version = "2099-01-01";
      if (kind === "type") event.type = "future.resource.changed";
      if (kind === "status") event.data.object.status = "future_status";
      const input = await signed(event);
      await expect(verifyAffinityWebhookEnvelope(input)).resolves.toEqual(event);
      await expect(verifyAffinityWebhook(input)).rejects.toMatchObject({ code: "invalid_event" });
    },
  );

  test("preserves unknown payloads and additive envelope fields", async () => {
    const event = {
      ...original,
      type: "future.resource.changed",
      api_version: "2099-01-01",
      future: { flag: true },
      data: { object: { future: [1, null, { nested: true }] }, extra: 42 },
    };
    await expect(verifyAffinityWebhookEnvelope(await signed(event))).resolves.toEqual(event);
  });

  test("keeps exact-byte authentication and replay checks", async () => {
    const input = await signed({ ...original, api_version: "2099-01-01" });
    await expect(
      verifyAffinityWebhookEnvelope({ ...input, body: input.body + " " }),
    ).rejects.toMatchObject({ code: "invalid_signature" });
    await expect(
      verifyAffinityWebhookEnvelope({
        ...input,
        signature: `t=${fixture.timestamp},v1=${"0".repeat(64)}`,
      }),
    ).rejects.toMatchObject({ code: "invalid_signature" });
    await expect(
      verifyAffinityWebhookEnvelope({ ...input, now: new Date(now.getTime() + 301_000) }),
    ).rejects.toMatchObject({ code: "timestamp_outside_tolerance" });
    await expect(
      verifyAffinityWebhookEnvelope({ ...input, now: new Date(NaN) }),
    ).rejects.toMatchObject({ code: "invalid_timestamp" });
  });

  test.each([
    { api_version: "" },
    { type: 1 },
    { created: -1 },
    { livemode: "false" },
    { id: "ord_invalid" },
    { object: "order" },
    { organization_id: "foreign" },
    { request_id: "req_invalid" },
    { data: null },
    { data: { object: [] } },
  ])("rejects malformed stable fields: %j", async (change) => {
    await expect(
      verifyAffinityWebhookEnvelope(await signed({ ...original, ...change })),
    ).rejects.toMatchObject({ code: "invalid_event" });
  });

  test("rejects missing stable fields and authenticated primitive JSON", async () => {
    const event = structuredClone(original);
    delete event.type;
    await expect(verifyAffinityWebhookEnvelope(await signed(event))).rejects.toMatchObject({
      code: "invalid_event",
    });
    // A string JSON value is authenticated but is not an event envelope.
    await expect(verifyAffinityWebhookEnvelope(await signed("not an event"))).rejects.toMatchObject(
      { code: "invalid_event" },
    );
  });

  test("snapshots mutable bytes before the first await", async () => {
    const bytes = new TextEncoder().encode(fixture.body);
    const verification = verifyAffinityWebhookEnvelope({ ...fixture, now, body: bytes });
    bytes.set(
      new TextEncoder().encode(fixture.body.replace('"livemode":false', '"livemode":true ')),
    );
    expect(await verification).toEqual(original);
  });
});
