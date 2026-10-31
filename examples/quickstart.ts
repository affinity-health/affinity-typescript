import { AffinityClient } from "@affinity-health/sdk";

const token = process.env.AFFINITY_API_KEY;
if (!token) throw new Error("Set AFFINITY_API_KEY to a Test key on the server");
const affinity = new AffinityClient({ token });
const account = await affinity.account.get();
if (account.mode !== "test") throw new Error("This quickstart only runs with a Test key");

// One page of the catalog. Iterate the page to read every medication.
const medications = await affinity.medications.list({ limit: 10 });
for (const medication of medications.data)
  console.log(`${medication.name} ${medication.strength ?? ""} (${medication.pharmacy.name})`);
if (account.type === "platform") {
  let practices = 0;
  for await (const _ of await affinity.practices.list()) practices++;
  console.log(`${practices} practices`);
}
// Reads only. See emr-order.ts for sending a clinician-reviewed Test order.
