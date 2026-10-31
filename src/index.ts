// The client, types and errors come from src/generated (Fern, from spec/affinity.openapi.json).
// Written by hand: client.ts (the client's defaults) and webhook-events.ts (webhook verification).
export * from "./generated/index.js";
export { AffinityClient } from "./client.js";
export * from "./webhook-events.js";
