import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const consumer = await mkdtemp(join(tmpdir(), "affinity-sdk-consumer-"));
const source = String.raw`
import { Affinity, AffinityError, type Medication, type OrderCreateParams } from "@affinity-health/sdk";
const api = new Affinity("synthetic-test-key");
async function workflow() {
 const input: OrderCreateParams = {
  practiceId:"prac_synthetic",prescriber:{npi:"1234567893",firstName:"Sam",lastName:"Example"},signatureAttestation:true,shippingOptionId:"shp_synthetic",
  patient:{firstName:"Synthetic",lastName:"Patient",dateOfBirth:"1990-01-01",gender:"unknown",phone:"+12025550199",email:"patient@example.test",allergies:[],address:{line1:"100 Test St",line2:null,city:"Austin",state:"TX",postalCode:"78701"}},
  prescriptions:[{medicationId:"med_synthetic",quantity:1,refills:0,directions:"Use as reviewed"}]
 };

 const medication: Medication = await api.medications.get("med_synthetic");
 await api.orders.create(input, {idempotencyKey:"persisted-job"});
 for await (const row of api.orders.iterate({practiceId:input.practiceId,limit:20})) { const id:string=row.id; void id; }
 // @ts-expect-error persisted key required
 await api.orders.create(input);
 // @ts-expect-error retired drafts/signing methods
 await api.orders.submit("ord_synthetic");
 // @ts-expect-error retired resource
 await api.catalog.items.list();
 // @ts-expect-error no public patient resource
 await api.patients.list();
 // @ts-expect-error prescription attestation must be true
 const invalid: OrderCreateParams["signatureAttestation"] = false;
 void invalid; void medication;
}
void workflow; void AffinityError;
`;
const runtime = String.raw`
import { Affinity, verifyAffinityWebhook } from "@affinity-health/sdk";
const requests = [];
const medication = { id: "med_synthetic", shippingOptions:[{id:"shp_synthetic"}] };
const api = new Affinity("synthetic-test-key", { fetch: async (input, init) => {
 const url = new URL(String(input));
 requests.push({path:url.pathname,query:url.search,headers:new Headers(init?.headers),body:init?.body ? JSON.parse(init.body) : undefined});
 if (url.pathname === "/v1/medications") return Response.json({object:"list",url:url.pathname,data:[medication],hasMore:false,nextCursor:null});
 if (url.pathname === "/v1/medications/med_synthetic") return Response.json(medication);
 if (url.pathname === "/v1/orders") return Response.json({id:"ord_synthetic",status:"submitted"}, {status:201});
 throw new Error("Unexpected request " + url.pathname);
}});
const page = await api.medications.list({query:"synthetic medication",limit:1});
const selected = await api.medications.get(page.data[0].id);
const input = {
 practiceId:"prac_synthetic",externalOrderId:"synthetic-job",prescriber:{npi:"1234567893",firstName:"Sam",lastName:"Example"},signatureAttestation:true,
 shippingOptionId:selected.shippingOptions[0].id,
 patient:{firstName:"Synthetic",lastName:"Patient",dateOfBirth:"1990-01-01",gender:"unknown",phone:"+12025550199",email:"patient@example.test",allergies:[],address:{line1:"100 Test St",line2:null,city:"Austin",state:"TX",postalCode:"78701"}},
 prescriptions:[{medicationId:selected.id,quantity:1,refills:0,directions:"Use as reviewed"}]
};
const order = await api.orders.create(input, {idempotencyKey:"persisted-synthetic-job"});
if (requests.length !== 3 || order.status !== "submitted") throw new Error("Unexpected MVP requests");
if (requests.some(r => r.headers.get("Affinity-Version") !== "2026-10-20")) throw new Error("Wrong version");
if (requests[0].query !== "?limit=1&query=synthetic+medication") throw new Error("Wrong medication query");
if (JSON.stringify(requests[2].body) !== JSON.stringify(input) || requests[2].headers.get("Idempotency-Key") !== "persisted-synthetic-job") throw new Error("Wrong order body or key");
const event = {id:"evt_01j2y8m6jcc9tt24af5pw9x1bc",type:"webhook_endpoint.test",createdAt:"2026-10-17T01:00:00.000Z",data:{}};
const body = JSON.stringify(event), secret = "whsec_test_synthetic_signing_secret", timestamp = 1785323400;
const cryptoKey = await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
const signature = "t="+timestamp+",v1="+Buffer.from(await crypto.subtle.sign("HMAC",cryptoKey,new TextEncoder().encode(timestamp+"."+body))).toString("hex");
await verifyAffinityWebhook({body,secret,signature,now:new Date(timestamp*1000)});
await verifyAffinityWebhook({body,secret,signature,now:new Date(NaN)}).then(()=>{throw new Error("Invalid clock accepted");},error=>{if(error.code!=="invalid_timestamp") throw error;});
const bytes = new TextEncoder().encode(body);
const pending = verifyAffinityWebhook({body:bytes,secret,signature,now:new Date(timestamp*1000)});
bytes.fill(0);
if ((await pending).id !== event.id) throw new Error("Mutable bytes were reread");
console.log("Packed MVP consumer passed");
`;
try {
  // Exercise the npm tarball boundary without publishing or contacting the API.
  await Bun.$`npm pack --ignore-scripts --pack-destination ${consumer}`.cwd(root).quiet();
  const archive = (await readdir(consumer)).find((file) => file.endsWith(".tgz"));
  if (!archive) throw new Error("SDK archive was not created");
  await writeFile(
    join(consumer, "package.json"),
    JSON.stringify({ name: "affinity-sdk-consumer", private: true, type: "module" }),
  );
  await writeFile(join(consumer, "consumer.ts"), source);
  await Bun.$`bun add ${join(consumer, archive)}`.cwd(consumer).quiet();
  for (const [name, module, moduleResolution] of [
    ["nodenext", "NodeNext", "NodeNext"],
    ["bundler", "ESNext", "Bundler"],
  ] as const) {
    await writeFile(
      join(consumer, `tsconfig.${name}.json`),
      JSON.stringify({
        compilerOptions: {
          module,
          moduleResolution,
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          target: "ES2023",
        },
        include: ["consumer.ts"],
      }),
    );
    await Bun.$`${resolve(root, "node_modules/.bin/tsgo")} --noEmit --pretty false -p ${join(consumer, `tsconfig.${name}.json`)}`.cwd(
      consumer,
    );
  }
  await Bun.$`node --input-type=module -e ${runtime}`.cwd(consumer);
  await Bun.$`bun -e ${runtime}`.cwd(consumer);
} finally {
  await rm(consumer, { recursive: true, force: true });
}
