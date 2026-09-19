import { createHash, timingSafeEqual, createHmac } from "node:crypto";

export function accessPassword() {
  const value = process.env.AFFINITY_EXAMPLE_PASSWORD;
  if (!value || value.length < 32)
    throw new Error("Set AFFINITY_EXAMPLE_PASSWORD to at least 32 characters.");
  return value;
}

export function authorized(header: string | null, password: string) {
  if (!header?.startsWith("Basic ")) return false;
  const supplied = Buffer.from(header.slice(6), "base64").toString();
  return timingSafeEqual(
    createHash("sha256").update(supplied).digest(),
    createHash("sha256").update(`demo:${password}`).digest(),
  );
}

// Signed review receipts preserve exact inputs across reloads and Worker instances.
// They contain synthetic Test data only, never an API key or the access password.
export function seal<T>(kind: string, value: T, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({ kind, value, expires: Date.now() + 86_400_000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function unseal<T>(token: string, kind: string, secret: string): T {
  if (token.length > 200_000) throw new Error("Review receipt is too large.");
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) throw new Error("Invalid review receipt.");
  const expected = createHmac("sha256", secret).update(payload).digest();
  const supplied = Buffer.from(signature, "base64url");
  if (supplied.length !== expected.length || !timingSafeEqual(expected, supplied))
    throw new Error("Invalid review receipt.");
  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
  if (decoded.kind !== kind || decoded.expires < Date.now())
    throw new Error("Review expired. Reload the order and review it again.");
  return decoded.value as T;
}
