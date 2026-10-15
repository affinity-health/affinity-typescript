import { describe, expect, test } from "bun:test";
import fixtures from "./fixtures/api-order-events.json";
import { verifyAffinityWebhook } from "../src";

const fixture = fixtures[0]!;
const input = { ...fixture, now: new Date(fixture.timestamp * 1000) };

describe("webhook signature validation", () => {
  test("accepts uppercase and mixed-case hex without changing the raw payload", async () => {
    for (const transform of [
      (hex: string) => hex.toUpperCase(),
      (hex: string) =>
        [...hex].map((char, index) => (index % 2 ? char.toUpperCase() : char)).join(""),
    ]) {
      const signature = input.signature.replace(
        /v1=([a-f0-9]+)/u,
        (_match, hex: string) => `v1=${transform(hex)}`,
      );
      await expect(verifyAffinityWebhook({ ...input, signature })).resolves.toEqual(
        JSON.parse(input.body),
      );
      await expect(
        verifyAffinityWebhook({ ...input, signature, body: input.body + " " }),
      ).rejects.toMatchObject({ code: "invalid_signature" });
    }
  });

  test.each(["", "not-hex", "ab".repeat(31), "ab".repeat(33)])(
    "reports malformed v1 signatures instead of missing ones: %s",
    async (candidate) => {
      await expect(
        verifyAffinityWebhook({ ...input, signature: `t=${fixture.timestamp},v1=${candidate}` }),
      ).rejects.toMatchObject({
        code: "invalid_signature",
        message: "Webhook signature is malformed",
      });
    },
  );

  test("distinguishes a missing signature from a malformed signature", async () => {
    await expect(
      verifyAffinityWebhook({ ...input, signature: `t=${fixture.timestamp}` }),
    ).rejects.toMatchObject({ code: "invalid_signature", message: "Webhook signature is missing" });
  });

  test("accepts any valid signature during rotation without trusting malformed candidates", async () => {
    await expect(
      verifyAffinityWebhook({
        ...input,
        signature: `${input.signature},v1=not-hex,v1=${"0".repeat(64)}`,
      }),
    ).resolves.toEqual(JSON.parse(input.body));
    await expect(
      verifyAffinityWebhook({
        ...input,
        signature: `t=${fixture.timestamp},v1=not-hex,v1=${"0".repeat(64)}`,
      }),
    ).rejects.toMatchObject({ code: "invalid_signature" });
  });

  test("rejects an invalid verification clock rather than bypassing replay tolerance", async () => {
    await expect(verifyAffinityWebhook({ ...input, now: new Date(NaN) })).rejects.toMatchObject({
      code: "invalid_timestamp",
    });
  });
});
