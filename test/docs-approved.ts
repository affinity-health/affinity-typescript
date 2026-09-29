import {Affinity,AffinityError} from "../src";
async function example0(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const patients = await api.patients.list({ limit: 20 });
const patient = await api.patients.get(patientId);
const items = await api.catalog.items.list({ limit: 20 });

}
async function example1(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const patients = await api.patients.list({ limit: 20 }, { practiceId });
const patient = await api.patients.get(patientId, { practiceId });

await api.patients.update(
  patientId,
  { email: "alex@example.com" },
  { practiceId },
);

}
async function example2(){const api=new Affinity("test");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const practice = api.forPractice(practiceId);

const patients = await practice.patients.list({ limit: 20 });
const items = await practice.catalog.items.list({ limit: 20 });

}
async function example3(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const patient = await practice.patients.create({
  name: { first: "Alex", last: "Example" },
  dateOfBirth: "1990-01-01",
});

const saved = await practice.patients.get(patient.id);
await practice.patients.update(patient.id, { email: "alex@example.com" });
await practice.patients.update(patient.id, { status: "archived" });

}
async function example4(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
await practice.patients.delete(patientId);

}
async function example5(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const order = await api.orders.create(
  { patientId, prescriptions: draft.prescriptions },
  { practiceId, idempotencyKey: job.createOrderKey },
);

}
async function example6(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
await practice.orders.sign(
  orderId,
  {
    prescriber: { id: review.prescriberId },
    expectedRevision: review.orderRevision,
    signatureAttestation: review.signatureAttestation,
  },
  { idempotencyKey: job.signOrderKey },
);

const submission = await practice.orders.submit(orderId, {
  idempotencyKey: job.submitOrderKey,
});

}
async function example7(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const page = await practice.patients.list({ limit: 20 });
if (page.hasMore && page.data.length > 0) {
  const next = await practice.patients.list({
    limit: 20,
    startingAfter: page.data.at(-1)!.id,
  });
}

for await (const patient of practice.patients.iterate({ limit: 100 })) {
  await syncPatient(patient);
}

}
async function example8(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
try {
  await practice.patients.get(patientId);
} catch (error) {
  if (!(error instanceof AffinityError)) throw error;
  console.error({
    status: error.status,
    code: error.code,
    requestId: error.requestId,
    retryable: error.retryable,
    retryAfter: error.retryAfter,
  });
}

}
async function example9(){const api=new Affinity("test");const practice=api.forPractice("prac_a");const practiceId="prac_a",patientId="pat_a",orderId="ord_a";const patient={id:patientId};const draft={prescriptions:[]};const job={createOrderKey:"create",signOrderKey:"sign",submitOrderKey:"submit"};const review={prescriberId:"prov_a",orderRevision:"rev_a",signatureAttestation:true as const};const syncPatient=async (_patient: unknown)=>{};
const practices = await api.practices.list({ limit: 20 });
const selected = await api.practices.get(practiceId);
const endpoints = await api.webhooks.endpoints.list({ limit: 20 });

}
