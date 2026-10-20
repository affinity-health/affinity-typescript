import { createHash, timingSafeEqual } from "node:crypto";

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
