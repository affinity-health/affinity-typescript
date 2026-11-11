import { describe, expect, test } from "bun:test";
import { Affinity, type RequiredKeyOptions } from "../src";

const practiceId = "prac_sdk-1-17";
const orderId = "ord_sdk-1-17";
const prescription = {
  medicationId: "med_sdk-1-17",
  daysSupply: 30,
  dispensing: {},
  directions: "Synthetic test fixture",
  quantity: 1,
  quantityUnit: "mL",
  refills: 0,
};
const mutations: Array<[string, (api: Affinity, options: RequiredKeyOptions) => Promise<unknown>]> =
  [
    [
      "create",
      (api, options) =>
        api.orders.create({ patientId: "pat_sdk-1-17", prescriptions: [prescription] }, options),
    ],
    ["cancel", (api, options) => api.orders.cancel(orderId, { reason: "sdk-1-17 audit" }, options)],
    [
      "sign",
      (api, options) =>
        api.orders.sign(
          orderId,
          { signatureAttestation: true, expectedRevision: "rev_sdk-1-17" },
          options,
        ),
    ],
    [
      "signAndSubmit",
      (api, options) =>
        api.orders.signAndSubmit(
          orderId,
          { signatureAttestation: true, expectedRevision: "rev_sdk-1-17" },
          options,
        ),
    ],
    ["submit", (api, options) => api.orders.submit(orderId, options)],
    ["reject", (api, options) => api.orders.reject(orderId, { reason: "sdk-1-17 audit" }, options)],
    [
      "batches.create",
      (api, options) =>
        api.orders.batches.create(
          { orders: [{ patientId: "pat_sdk-1-17", prescriptions: [prescription] }] },
          options,
        ),
    ],
    [
      "exceptions.act",
      (api, options) =>
        api.orders.exceptions.act(orderId, "exc_sdk-1-17", { action: "acknowledge" }, options),
    ],
    [
      "prescriptions.add",
      (api, options) => api.orders.prescriptions.add(orderId, { prescription }, options),
    ],
    [
      "prescriptions.update",
      (api, options) =>
        api.orders.prescriptions.update(orderId, "rx_sdk-1-17", { prescription }, options),
    ],
    [
      "testSimulation.update",
      (api, options) =>
        api.orders.testSimulation.update(
          orderId,
          { mode: "manual", scenario: "successful" },
          options,
        ),
    ],
  ];

function fixture() {
  const writes: Array<{ path: string; key: string | null; body: string | undefined }> = [];
  let fail = false;
  let requests = 0;
  const api = new Affinity("sdk-1-17-test-key", {
    baseUrl: "https://sdk-1-17.example.test",
    maxNetworkRetries: 1,
    fetch: async (input, init) => {
      requests++;
      const path = new URL(String(input)).pathname;
      if (path === "/v1/auth/access")
        return Response.json({
          serviceAccount: { subjectType: "platform", subjectId: "acct_sdk-1-17" },
        });
      if (init?.method === "GET") return Response.json({ id: orderId, practiceId });
      writes.push({
        path,
        key: new Headers(init?.headers).get("Idempotency-Key"),
        body: typeof init?.body === "string" ? init.body : undefined,
      });
      if (fail) {
        fail = false;
        throw new TypeError("sdk-1-17 connection reset");
      }
      return Response.json({ id: orderId });
    },
  });
  return {
    api: api.forPractice(practiceId),
    writes,
    requests: () => requests,
    fail: () => {
      fail = true;
    },
  };
}

describe.each(mutations)("caller-owned order idempotency: %s", (_name, invoke) => {
  test("requires a nonempty caller key before discovery or mutation", async () => {
    for (const options of [undefined, {}, { idempotencyKey: "" }, { idempotencyKey: "   " }]) {
      const { api, requests } = fixture();
      await expect(invoke(api, options as RequiredKeyOptions)).rejects.toThrow(/idempotencyKey/);
      expect(requests()).toBe(0);
    }
  });

  test("preserves the exact key and payload across network and caller retries", async () => {
    const { api, writes, fail } = fixture();
    const options = Object.freeze({ idempotencyKey: "sdk-1-17:persisted-job:attempt-one" });
    fail();
    await invoke(api, options);
    await invoke(api, options);
    expect(writes).toHaveLength(3);
    for (const write of writes) {
      expect(write.key).toBe(options.idempotencyKey);
      expect(write.path).toBe(writes[0]!.path);
      expect(write.body).toBe(writes[0]!.body);
    }
    expect(options).toEqual({ idempotencyKey: "sdk-1-17:persisted-job:attempt-one" });
  });
});

test("concurrent callers and a replacement client preserve the persisted job key", async () => {
  const options = { idempotencyKey: "sdk-1-17:persisted-concurrent-job" };
  const first = fixture(),
    replacement = fixture();
  await Promise.all([
    first.api.orders.submit(orderId, options),
    first.api.orders.submit(orderId, options),
    replacement.api.orders.submit(orderId, options),
  ]);
  expect([...first.writes, ...replacement.writes].map((write) => write.key)).toEqual([
    options.idempotencyKey,
    options.idempotencyKey,
    options.idempotencyKey,
  ]);
});
