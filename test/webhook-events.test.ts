import { describe, expect, test } from "bun:test";
import {
  AffinityWebhookVerificationError,
  type AffinityWebhookEvent,
  parseAffinityWebhookEvent,
  verifyAffinityWebhook,
} from "../src";

const timestamp = 1_785_323_400;
const now = new Date(timestamp * 1_000);
const secret = "whsec_test_example_signing_secret";
const event = {
  api_version: "2026-07-29",
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
  test("verifies the exact raw body and returns a narrowed event union", async () => {
    const body = JSON.stringify(event);
    const signature = await sign(body, secret, timestamp);
    const verified = await verifyAffinityWebhook({ body, now, secret, signature });

    expect(verified.type).toBe("order.submitted");
    if (verified.type === "order.submitted") {
      expect(verified.data.object.status).toBe("submitted");
      expect(verified.data.previous_attributes?.status).toBe("draft");
    }
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

  test("rejects event types whose object does not match", () => {
    expect(() =>
      parseAffinityWebhookEvent({
        ...event,
        data: {
          object: {
            id: "whe_01k123456789abcdefghjkmnpq",
            object: "webhook_endpoint",
          },
        },
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
