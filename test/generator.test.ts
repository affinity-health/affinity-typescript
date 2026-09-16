import { describe, expect, test } from "bun:test";
import { facadeOperationMap, validateFacadeOperationCoverage } from "../scripts/facade-map";
import spec from "../spec/affinity.openapi.json";

function contract() {
  return structuredClone(spec) as any;
}

describe("facade contract coverage", () => {
  test("accounts for all 69 current operations", () => {
    const coverage = validateFacadeOperationCoverage(spec);
    expect(coverage.contractOperations).toHaveLength(69);
    expect(coverage.mappedOperations).toHaveLength(69);
  });

  test("new operations require an explicit public mapping", () => {
    const changed = contract();
    changed.paths["/v1/future"] = { get: { operationId: "futureOperation" } };
    expect(() => validateFacadeOperationCoverage(changed)).toThrow(/futureOperation/);
    expect(
      validateFacadeOperationCoverage(changed, {
        ...facadeOperationMap,
        futureOperation: { resource: "account", method: "future" },
      }).mappedOperations,
    ).toContain("futureOperation");
  });

  test("removed operations leave an invalid stale mapping", () => {
    const changed = contract();
    delete changed.paths["/v1/auth/access"];
    expect(() => validateFacadeOperationCoverage(changed)).toThrow(/getApiAccess/);
  });

  test("two operations cannot share one public method", () => {
    expect(() =>
      validateFacadeOperationCoverage(spec, {
        ...facadeOperationMap,
        getApiAccess: facadeOperationMap.getAccount,
      }),
    ).toThrow(/duplicate public methods/i);
  });

  test("unknown required headers need explicit handling", () => {
    const changed = contract();
    changed.paths["/v1/auth/access"].get.parameters.push({
      in: "header",
      name: "Affinity-Future-Authority",
      required: true,
      schema: { type: "string" },
    });
    expect(() => validateFacadeOperationCoverage(changed)).toThrow(/Affinity-Future-Authority/);
  });

  test("inherited required headers cannot bypass coverage validation", () => {
    const changed = contract();
    changed.paths["/v1/auth/access"].parameters = [
      {
        in: "header",
        name: "Affinity-Inherited-Authority",
        required: true,
        schema: { type: "string" },
      },
    ];
    expect(() => validateFacadeOperationCoverage(changed)).toThrow(/Affinity-Inherited-Authority/);
  });

  test("operations cannot omit or duplicate their IDs", () => {
    const missing = contract();
    missing.paths["/v1/future"] = { get: {} };
    expect(() => validateFacadeOperationCoverage(missing)).toThrow(/operationId/i);
    const duplicate = contract();
    duplicate.paths["/v1/future"] = { get: { operationId: "getApiAccess" } };
    expect(() => validateFacadeOperationCoverage(duplicate)).toThrow(/duplicate.*getApiAccess/i);
  });
});
