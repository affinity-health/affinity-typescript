// Calls every operation of the built SDK (dist/) against a real Affinity API in Test mode, and
// checks every response against spec/affinity.openapi.json. Run it after `bun run build` with
// Bun or Node 22.18+ (type stripping):
//
//   AFFINITY_API_KEY=sk_test_... [AFFINITY_BASE_URL=https://...] [AFFINITY_SMOKE_WEBHOOK_URL=https://...] \
//     bun scripts/smoke.ts            # or: node scripts/smoke.ts
//
// It refuses a Live key. Use a platform Test key: it creates a practice and a Test order (sent to
// the API's test pharmacy) and cancels the order. With AFFINITY_SMOKE_WEBHOOK_URL it also creates,
// updates and removes a webhook endpoint that receives this run's events. Feedback is sent only
// as an invalid request, so no one is notified. The Test practice it creates stays: the API has no
// way to remove a practice. Exit code 1 when any check fails.
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import * as ajvModule from "ajv/dist/2020.js";
import * as formatsModule from "ajv-formats";
import { Affinity, AffinityClient, AffinityError } from "../dist/index.js";

const key = process.env.AFFINITY_API_KEY ?? "";
if (!key.startsWith("sk_test_")) throw new Error("Set AFFINITY_API_KEY to a Test key (sk_test_…).");
const baseUrl = process.env.AFFINITY_BASE_URL;
const webhookUrl = process.env.AFFINITY_SMOKE_WEBHOOK_URL;

// ajv and ajv-formats are CommonJS; Bun and Node expose their export differently.
const Ajv2020 = ((ajvModule as { default?: unknown }).default ?? ajvModule) as unknown as new (
  options: object,
) => {
  addSchema(schema: object, key: string): void;
  getSchema(ref: string): Validate | undefined;
  compile(schema: object): Validate;
  errorsText(errors: unknown, options: object): string;
};
type Validate = ((value: unknown) => boolean) & { errors?: unknown };
const addFormats = ((formatsModule as { default?: unknown }).default ?? formatsModule) as (
  ajv: unknown,
) => void;
const contract = JSON.parse(
  readFileSync(new URL("../spec/affinity.openapi.json", import.meta.url), "utf8"),
);
const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
ajv.addSchema(contract, "contract");

const templates = Object.entries(contract.paths as Record<string, object>).flatMap(
  ([template, operations]) =>
    Object.keys(operations).map((method) => ({
      method: method.toUpperCase(),
      template,
      pattern: new RegExp(`^${template.replace(/\{[^}]+\}/g, "[^/]+")}$`),
    })),
);
const schemaProblems: string[] = [];
const calls: string[] = [];
/** The SDK's fetch: every response it receives is checked against the contract. */
const checkedFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);
  const url = new URL(input instanceof Request ? input.url : String(input));
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  const operation = templates.find((t) => t.method === method && t.pattern.test(url.pathname));
  calls.push(`${method} ${url.pathname} → ${response.status}`);
  const text = await response.clone().text();
  if (!operation) schemaProblems.push(`${method} ${url.pathname}: not in the contract`);
  else if (text) {
    const declared =
      contract.paths[operation.template][method.toLowerCase()].responses[String(response.status)];
    if (!declared)
      schemaProblems.push(
        `${method} ${operation.template}: status ${response.status} is not declared`,
      );
    else {
      const [type] = Object.keys(declared.content ?? {});
      const actual = response.headers.get("content-type")?.split(";")[0];
      if (type && actual !== type)
        schemaProblems.push(
          `${method} ${operation.template} ${response.status}: content-type ${actual}, contract ${type}`,
        );
      if (type) {
        const escape = (part: string) => part.replaceAll("~", "~0").replaceAll("/", "~1");
        const pointer = `contract#/paths/${escape(operation.template)}/${method.toLowerCase()}/responses/${response.status}/content/${escape(type)}/schema`;
        const validate = ajv.getSchema(pointer) ?? ajv.compile({ $ref: pointer });
        if (!validate(JSON.parse(text)))
          schemaProblems.push(
            `${method} ${operation.template} ${response.status}: ${ajv.errorsText(validate.errors, { separator: "; " }).slice(0, 600)}`,
          );
      }
    }
  }
  return response;
}) as typeof fetch;

const results: { name: string; ok: boolean; note?: string }[] = [];
const describe = (error: unknown) =>
  error instanceof AffinityError
    ? `${error.constructor.name} ${error.statusCode} ${(error.body as { code?: string } | undefined)?.code ?? ""}`
    : String(error).slice(0, 300);
async function check<T>(name: string, work: () => PromiseLike<T>, note?: (value: T) => string) {
  try {
    const value = await work();
    results.push({ name, ok: true, ...(note ? { note: note(value) } : {}) });
    return value;
  } catch (error) {
    results.push({ name, ok: false, note: describe(error) });
    return undefined;
  }
}
/** A call that must reject with `ErrorClass`; `inspect` returns a problem, or undefined. */
async function refused(
  name: string,
  ErrorClass: abstract new (...args: never[]) => AffinityError,
  work: () => PromiseLike<unknown>,
  inspect?: (error: AffinityError) => string | undefined,
) {
  const error = await Promise.resolve(work()).then(
    () => undefined,
    (e: unknown) => e,
  );
  const problem =
    error === undefined
      ? "succeeded"
      : !(error instanceof ErrorClass)
        ? `got ${describe(error)}`
        : inspect?.(error);
  results.push({ name, ok: !problem, note: problem ?? describe(error) });
}

const client = new AffinityClient({
  token: key,
  fetch: checkedFetch,
  maxRetries: 0,
  ...(baseUrl ? { baseUrl } : {}),
});
const label = `SDK smoke ${new Date().toISOString()}`;
const orderIds: string[] = [];
/** Records an order a check meant to be refused, so the cleanup cancels it if the API accepted it. */
const created = async (call: PromiseLike<Affinity.Order>) => {
  const order = await call;
  orderIds.push(order.id);
  return order;
};
const endpointIds: string[] = [];

try {
  const account = await check(
    "account.get",
    () => client.account.get(),
    (a) => `${a.type} ${a.mode}`,
  );
  if (account?.mode !== "test") throw new Error("This smoke test runs only with a Test key.");
  if (account.type !== "platform")
    throw new Error("Use a platform Test key: it creates a practice.");
  await refused("a bad key raises UnauthorizedError", Affinity.UnauthorizedError, () =>
    new AffinityClient({
      token: "sk_test_not_a_key",
      fetch: checkedFetch,
      ...(baseUrl ? { baseUrl } : {}),
    }).account.get(),
  );
  await refused(
    "feedback.create without a message raises BadRequestError",
    Affinity.BadRequestError,
    () => client.feedback.create({ idempotencyKey: randomUUID(), message: "" }),
  );

  const practice = await check(
    "practices.create",
    () =>
      client.practices.create({
        idempotencyKey: randomUUID(),
        name: label,
        phone: "+15125550100",
        address: { line1: "100 Congress Ave", city: "Austin", state: "TX", postalCode: "78701" },
      }),
    (p) => p.id,
  );
  if (!practice) throw new Error("No practice; stopping.");
  await check(
    "practices.get",
    () => client.practices.get({ practiceId: practice.id }),
    (p) => p.name,
  );
  await check(
    "practices.update",
    () =>
      client.practices.update({
        practiceId: practice.id,
        idempotencyKey: randomUUID(),
        name: `${label} renamed`,
      }),
    (p) => p.name,
  );
  await check(
    "practices.list (every page, 1 per page)",
    async () => {
      const ids: string[] = [];
      for await (const p of await client.practices.list({ limit: 1 })) ids.push(p.id);
      if (!ids.includes(practice.id)) throw new Error("the new practice is not listed");
      return ids.length;
    },
    (n) => `${n} practices`,
  );

  await check(
    "medications.list (one page)",
    () => client.medications.list({ limit: 5 }),
    (p) => `${p.data.length}, more: ${p.hasNextPage()}`,
  );
  const medications = await check(
    "medications.list (every page, 25 per page)",
    async () => {
      const all: Affinity.Medication[] = [];
      for await (const m of await client.medications.list({ limit: 25 })) all.push(m);
      if (new Set(all.map((m) => m.id)).size !== all.length)
        throw new Error("a medication repeats across pages");
      return all;
    },
    (all) => `${all.length} medications`,
  );
  const medication =
    medications?.find(
      (m) => !m.coldChainRequired && m.shippingOptions.length > 0 && m.requirements.length === 0,
    ) ?? medications?.find((m) => m.shippingOptions.length > 0);
  if (!medication) throw new Error("No orderable medication in Test mode; stopping.");
  await check(
    "medications.get",
    () => client.medications.get({ medicationId: medication.id }),
    (m) => `${m.name} (${m.pharmacy.name})`,
  );
  await check(
    "medications.get expand=variants",
    () => client.medications.get({ medicationId: medication.id, expand: "variants" }),
    (m) => `${(m as { variants?: unknown[] }).variants?.length ?? 0} variants`,
  );
  await check(
    "medications.list for a practice",
    () => client.medications.list({ limit: 5, practiceId: practice.id }),
    (p) => `${p.data.length}`,
  );

  const orderInput = (quantity: number): Affinity.OrderInput => ({
    idempotencyKey: randomUUID(),
    externalOrderId: `sdk-smoke-${randomUUID().slice(0, 8)}`,
    patient: {
      externalId: `sdk-smoke-${randomUUID()}`,
      firstName: "Test",
      lastName: "Smoke",
      dateOfBirth: "1988-04-02",
      sex: "female",
      email: `sdk-smoke-${randomUUID().slice(0, 8)}@example.test`,
      phone: "+15125550101",
      allergies: [],
      address: { line1: "200 Congress Ave", city: "Austin", state: "TX", postalCode: "78701" },
    },
    practiceId: practice.id,
    prescriber: { npi: "1234567893", firstName: "Sam", lastName: "Lee" },
    prescriptions: [
      {
        medicationId: medication.id,
        quantity,
        refills: 0,
        directions: "SDK smoke test. TEST ONLY. DO NOT FILL.",
        ...(medication.requirements.includes("compoundingReason") &&
        medication.compoundingReasons[0]
          ? { compoundingReason: medication.compoundingReasons[0] }
          : {}),
      },
    ],
    shipping: { optionId: medication.shippingOptions[0]!.id },
    signatureAttestation: true,
  });
  const quantity = medication.quantities[0] ?? 1;
  const input = orderInput(quantity);
  const order = await check(
    "orders.create",
    () => client.orders.create(input),
    (o) => `${o.id} ${o.status}`,
  );
  if (order) orderIds.push(order.id);
  await check("orders.create again with the same key returns the same order", async () => {
    const again = await client.orders.create(input);
    if (again.id !== order?.id) throw new Error(`created a second order ${again.id}`);
    return again;
  });
  await refused(
    "an unaccepted quantity raises UnprocessableEntityError with the field",
    Affinity.UnprocessableEntityError,
    () => created(client.orders.create(orderInput(Math.max(0, ...medication.quantities) + 1))),
    (e) => {
      const issues = (e.body as Affinity.Problem).issues ?? [];
      return issues.some((issue) => issue.field === "prescriptions[0].quantity")
        ? undefined
        : `issues ${JSON.stringify(issues)}`;
    },
  );
  await refused("a missing Idempotency-Key raises BadRequestError", Affinity.BadRequestError, () =>
    created(
      client.orders.create({
        ...orderInput(quantity),
        idempotencyKey: undefined as unknown as string,
      }),
    ),
  );
  if (order) {
    await check(
      "orders.get",
      () => client.orders.get({ orderId: order.id }),
      (o) => `${o.status}, ${o.prescriptions.length} prescription`,
    );
    await check("orders.list by externalOrderId", async () => {
      const page = await client.orders.list({ externalOrderId: input.externalOrderId! });
      if (page.data.map((o) => o.id).join() !== order.id)
        throw new Error(`found ${page.data.length}`);
      return page;
    });
    await check(
      "orders.list updatedAfter (milliseconds)",
      () =>
        client.orders.list({
          updatedAfter: new Date(Date.now() - 3_600_000).toISOString(),
          limit: 5,
        }),
      (p) => `${p.data.length}`,
    );
    await check(
      "orders.list updatedAfter (nanoseconds)",
      () => client.orders.list({ updatedAfter: "2026-01-01T00:00:00.123456789Z", limit: 5 }),
      (p) => `${p.data.length}`,
    );
    await check("orders.list (every page, 1 per page)", async () => {
      let n = 0;
      for await (const _ of await client.orders.list({ limit: 1, practiceId: practice.id })) n++;
      if (n !== 1) throw new Error(`${n} orders for a practice with 1`);
      return n;
    });
    await check(
      "orders.cancel",
      () => client.orders.cancel({ orderId: order.id, idempotencyKey: randomUUID() }),
      (o) => `${o.status}${o.cancelRequestedAt ? ", waiting for the pharmacy" : ""}`,
    );
  }
  await refused(
    "orders.get for an unknown order raises NotFoundError",
    Affinity.NotFoundError,
    () => client.orders.get({ orderId: "ord_01j2y8m6jcc9tt24af5pw9x1bc" }),
  );

  if (webhookUrl) {
    const endpoint = await check(
      "webhooks.create",
      () =>
        client.webhooks.create({
          idempotencyKey: randomUUID(),
          url: new URL(`/${randomUUID()}`, webhookUrl).href,
        }),
      (e) => e.id,
    );
    if (endpoint) {
      endpointIds.push(endpoint.id);
      await check(
        "webhooks.list (every page)",
        async () => {
          const ids: string[] = [];
          for await (const e of await client.webhooks.list()) ids.push(e.id);
          if (!ids.includes(endpoint.id)) throw new Error("the new endpoint is not listed");
          return ids.length;
        },
        (n) => `${n}`,
      );
      await check(
        "webhooks.update",
        () =>
          client.webhooks.update({
            webhookEndpointId: endpoint.id,
            idempotencyKey: randomUUID(),
            url: new URL(`/${randomUUID()}`, webhookUrl).href,
          }),
        (e) => e.id,
      );
      await check(
        "webhooks.resendFailed",
        () =>
          client.webhooks.resendFailed({
            webhookEndpointId: endpoint.id,
            idempotencyKey: randomUUID(),
          }),
        (r) => JSON.stringify(r),
      );
      await check("webhooks.remove", async () => {
        await client.webhooks.remove({ webhookEndpointId: endpoint.id });
        endpointIds.pop();
        return "removed";
      });
    }
  }
  await check("withRawResponse gives the request ID", async () => {
    const { rawResponse } = await client.account.get().withRawResponse();
    const requestId = rawResponse.headers.get("x-request-id");
    if (!requestId) throw new Error("no X-Request-Id header");
    return requestId;
  });
} catch (error) {
  results.push({ name: "stopped", ok: false, note: describe(error) });
} finally {
  for (const orderId of orderIds)
    await client.orders.cancel({ orderId, idempotencyKey: randomUUID() }).catch(() => undefined);
  for (const webhookEndpointId of endpointIds)
    await client.webhooks.remove({ webhookEndpointId }).catch(() => undefined);
}

for (const result of results)
  console.log(
    `${result.ok ? "PASS" : "FAIL"} ${result.name}${result.note ? ` — ${result.note}` : ""}`,
  );
for (const problem of schemaProblems) console.log(`SCHEMA ${problem}`);
const failed = results.filter((r) => !r.ok).length;
console.log(
  `${results.length - failed} of ${results.length} checks passed; ${calls.length} responses checked against the contract, ${schemaProblems.length} mismatches.`,
);
if (failed > 0 || schemaProblems.length > 0) process.exitCode = 1;
