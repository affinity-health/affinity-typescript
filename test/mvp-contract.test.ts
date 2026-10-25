import { expect, test } from "bun:test";
import { Affinity, type OrderCreateParams } from "../src";

test("MVP medication lookup sends one request with the current version", async () => {
  const calls: [string, RequestInit | undefined][] = [];
  const api = new Affinity("test", {
    fetch: (async (url, init) => {
      calls.push([String(url), init]);
      return Response.json({ data: [], hasMore: false, nextCursor: null });
    }) as typeof fetch,
  });
  await api.medications.list({ name: "test" });
  expect(calls).toHaveLength(1);
  expect(calls[0][0]).toBe("https://api.affinityrx.com/v1/medications?name=test");
  expect(new Headers(calls[0][1]?.headers).get("Affinity-Version")).toBe("2026-10-20");
  expect("catalog" in api).toBe(false);
  expect("patients" in api).toBe(false);
});

test("new list filters serialize repeated names and cancellation state", async () => {
  const urls: URL[] = [];
  const api = new Affinity("test", {
    fetch: (async (url) => {
      urls.push(new URL(String(url)));
      return Response.json({ data: [], hasMore: false, nextCursor: null });
    }) as typeof fetch,
  });
  await api.medications.list({ names: ["Test Lidocaine", "Test Cream"], limit: "20" });
  await api.orders.list({
    practiceId: "prac_test",
    cancelRequested: "false",
    recentlyShipped: "true",
  });
  expect(urls[0].searchParams.getAll("names")).toEqual(["Test Lidocaine", "Test Cream"]);
  expect(urls[0].searchParams.get("limit")).toBe("20");
  expect(urls[1].searchParams.get("cancelRequested")).toBe("false");
  expect(urls[1].searchParams.get("practiceId")).toBe("prac_test");
  expect(urls[1].searchParams.get("recentlyShipped")).toBe("true");
});

test("practice contact and optional order fields retain their flat public bodies and snapshots", async () => {
  const calls: { path: string; body: unknown }[] = [];
  const address = { line1: "200 Example Ave", city: "Austin", state: "TX", postalCode: "78701" };
  const practice = { name: "Synthetic Test Practice", phone: "+12025550199", address };
  const prescriber = {
    firstName: "Synthetic",
    lastName: "Prescriber",
    npi: "1234567893",
    phone: "+12025550198",
    address,
  };
  const input: OrderCreateParams = {
    patient: {
      firstName: "Synthetic",
      lastName: "Patient",
      dateOfBirth: "1990-01-01",
      gender: "unknown",
      email: "patient@example.test",
      phone: "+12025550199",
      address,
      allergies: [],
    },
    prescriber,
    prescriptions: [
      { medicationId: "med_test", quantity: 1, refills: 0, directions: "Synthetic Test only" },
    ],
    shippingOptionId: "shp_test",
    signatureAttestation: true,
  };
  const api = new Affinity("test", {
    fetch: (async (url, init) => {
      const path = new URL(String(url)).pathname;
      calls.push({ path, body: JSON.parse(String(init?.body)) });
      return Response.json(
        path === "/v1/practices"
          ? { id: "prac_test", ...practice }
          : { id: "ord_test", practice, prescriber },
      );
    }) as typeof fetch,
  });
  await api.practices.create(practice);
  const created = await api.orders.create(input, { idempotencyKey: "persisted-test-order" });
  expect(calls).toEqual([
    { path: "/v1/practices", body: practice },
    { path: "/v1/orders", body: input },
  ]);
  expect(calls[1].body).not.toHaveProperty("practiceId");
  expect(created.practice).toEqual(practice);
  expect(created.prescriber?.phone).toBe(prescriber.phone);
  expect(created.prescriber?.address).toEqual(address);
});

test("recovery and practice pricing filters reach the API", async () => {
  const urls: URL[] = [];
  const api = new Affinity("test", {
    fetch: (async (url) => {
      urls.push(new URL(String(url)));
      return Response.json({ data: [], hasMore: false, nextCursor: null });
    }) as typeof fetch,
  });
  await api.orders.list({
    externalOrderId: "emr-42",
    updatedAfter: "2026-10-22T00:00:00Z",
    practiceId: "prac_test",
  });
  await api.medications.list({ practiceId: "prac_test", category: "skin" });
  await api.medications.get("med_test", { practiceId: "prac_test", expand: ["variants"] });
  expect(Object.fromEntries(urls[0].searchParams)).toEqual({
    externalOrderId: "emr-42",
    updatedAfter: "2026-10-22T00:00:00Z",
    practiceId: "prac_test",
  });
  expect(Object.fromEntries(urls[1].searchParams)).toEqual({
    practiceId: "prac_test",
    category: "skin",
  });
  expect(Object.fromEntries(urls[2].searchParams)).toEqual({
    practiceId: "prac_test",
    expand: "variants",
  });
});

test("unknown read parameters fail locally even for JavaScript callers", async () => {
  let calls = 0;
  const api = new Affinity("test", {
    fetch: (async () => {
      calls++;
      return Response.json({});
    }) as typeof fetch,
  });
  // @ts-expect-error Misspelled query parameters must also be compile errors.
  await expect(api.orders.list({ externalOrderID: "emr-42" })).rejects.toThrow(
    "Unknown query parameter: externalOrderID",
  );
  // @ts-expect-error Reads without query parameters must reject unknown options too.
  await expect(api.orders.get("ord_test", { practiceId: "prac_test" })).rejects.toThrow(
    "Unknown request option: practiceId",
  );
  expect(calls).toBe(0);
});
