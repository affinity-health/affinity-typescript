import { Affinity } from "@affinity-health/sdk";

const apiKey = process.env.AFFINITY_API_KEY;
if (!apiKey) throw new Error("Set AFFINITY_API_KEY to a Test key on the server");
const affinity = new Affinity(apiKey);
const account = await affinity.account.get();
if (account.mode !== "test") throw new Error("This quickstart only runs with a Test key");

const medications = await affinity.medications.list({ limit: "10", query: "semaglutide" });
console.log(`Found ${medications.data.length} matching Test medications`);
if (account.type === "platform") {
  const practices = await affinity.practices.list({ limit: "10" });
  console.log(`Found ${practices.data.length} practices`);
}
// Reads only. See emr-order.ts for sending a clinician-reviewed synthetic Test order.
