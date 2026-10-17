import { Affinity } from "@affinity-health/sdk";

const key = process.env.AFFINITY_API_KEY;
if (!key) throw new Error("Set AFFINITY_API_KEY to a Test key on your server");
const api = new Affinity(key);
const account = await api.account.get();
if (account.mode !== "test") throw new Error("This example only accepts a Test key");
const medications = await api.medications.list({ limit: 10, query: "semaglutide" });
console.log(`Found ${medications.data.length} matching medications`);
// Order submission is explicit. See emr-order.ts for a clinician-reviewed request.
