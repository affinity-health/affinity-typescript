import { expect, test } from "bun:test";
import { Affinity } from "../src";

test("nested resources preserve ID order, encoding, bodies, and mutation headers", async () => {
  const requests: Request[] = [];
  const sdk = new Affinity("sk_test_hierarchy", {
    fetch: async (input, init) => {
      requests.push(new Request(input, init));
      return Response.json({ data: [], hasMore: false });
    },
  });
  // Responses are immaterial here; stop after the outgoing request is captured.
  await sdk.practices.team.prescribers.licenses
    .update(
      "prac/a",
      "prescriber/b",
      "license/c",
      { state: "TX", licenseNumber: "SYNTHETIC" } as never,
      { idempotencyKey: "license-update" },
    )
    .catch(() => {});
  expect(new URL(requests[0]!.url).pathname).toBe(
    "/v1/practices/prac%2Fa/team/prescribers/prescriber%2Fb/licenses/license%2Fc",
  );
  expect(requests[0]!.method).toBe("PATCH");
  expect(requests[0]!.headers.get("Idempotency-Key")).toBe("license-update");
  expect(await requests[0]!.json()).toMatchObject({ state: "TX", licenseNumber: "SYNTHETIC" });

  const listEvents = sdk.orders.events.list;
  await listEvents("ord/a", { limit: 5 });
  expect(new URL(requests[1]!.url).pathname).toBe("/v1/orders/ord%2Fa/events");
  expect(new URL(requests[1]!.url).searchParams.get("limit")).toBe("5");
  expect("patients" in sdk).toBe(false);
  expect("list" in sdk.catalog).toBe(false);
  expect("sessions" in sdk).toBe(false);
});
