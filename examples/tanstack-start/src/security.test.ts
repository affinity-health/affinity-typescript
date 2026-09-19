import { describe, expect, test } from "bun:test";
import { authorized, seal, unseal } from "./security.server";

const secret = "synthetic-unit-test-password-not-for-deployment";
describe("example access and review receipts", () => {
  test("requires the correct username and password", () => {
    expect(authorized(null, secret)).toBe(false);
    expect(authorized(`Basic ${Buffer.from(`demo:wrong`).toString("base64")}`, secret)).toBe(false);
    expect(authorized(`Basic ${Buffer.from(`other:${secret}`).toString("base64")}`, secret)).toBe(
      false,
    );
    expect(authorized(`Basic ${Buffer.from(`demo:${secret}`).toString("base64")}`, secret)).toBe(
      true,
    );
  });
  test("preserves exact reviewed versions and retry key", () => {
    const reviewed = {
      orderId: "ord_test",
      versions: [{ prescriptionId: "rx_test", version: 7 }],
      key: "retry-key",
    };
    expect(unseal<typeof reviewed>(seal("review", reviewed, secret), "review", secret)).toEqual(
      reviewed,
    );
  });
  test("rejects altered payloads, signatures, and receipt purposes", () => {
    const receipt = seal("review", { version: 1 }, secret);
    const [, signature] = receipt.split(".");
    expect(() =>
      unseal(
        `${Buffer.from(JSON.stringify({ kind: "review", value: { version: 2 }, expires: Date.now() + 10000 })).toString("base64url")}.${signature}`,
        "review",
        secret,
      ),
    ).toThrow();
    expect(() => unseal(receipt, "preview", secret)).toThrow();
    expect(() => unseal(receipt, "review", "another-secret")).toThrow();
    expect(() => unseal(`${receipt}.extra`, "review", secret)).toThrow();
  });
  test("rejects expired reviews", () => {
    const original = Date.now;
    try {
      const receipt = seal("review", {}, secret);
      Date.now = () => original() + 86_400_001;
      expect(() => unseal(receipt, "review", secret)).toThrow("expired");
    } finally {
      Date.now = original;
    }
  });
});
