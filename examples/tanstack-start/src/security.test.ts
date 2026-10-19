import { describe, expect, test } from "bun:test";
import { authorized } from "./security.server";

const secret = "synthetic-unit-test-password-not-for-deployment";
describe("example access", () => {
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
});
