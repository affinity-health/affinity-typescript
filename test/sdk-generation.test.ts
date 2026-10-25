import { expect, test } from "bun:test";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { sdkContract } from "../scripts/sdk-contract";

test("SDK selection omits deprecated operations without mutating the pinned contract", () => {
  const spec = {
    paths: {
      "/mixed": {
        parameters: [{ name: "id", in: "path" }],
        get: { operationId: "read", deprecated: false },
        post: { operationId: "retiredWrite", deprecated: true },
      },
      "/retired": { post: { operationId: "retired", deprecated: true } },
      "/v1/hosted-sessions": { post: { operationId: "hostedSession" } },
      "/v1/component-sessions": { post: { operationId: "componentSession" } },
    },
  };
  const original = structuredClone(spec);
  expect(sdkContract(spec).paths).toEqual({
    "/mixed": {
      parameters: spec.paths["/mixed"].parameters,
      get: spec.paths["/mixed"].get,
    },
  });
  expect(spec).toEqual(original);
});

const root = resolve(import.meta.dir, "..");

async function generate(change: (spec: any, metadata: any) => void) {
  const directory = await mkdtemp(resolve(tmpdir(), "affinity-sdk-generation-"));
  try {
    for (const path of ["scripts", "templates", "spec", "generation.json", "package.json"])
      await cp(resolve(root, path), resolve(directory, path), { recursive: true });
    const spec = await Bun.file(resolve(directory, "spec/affinity.openapi.json")).json();
    const metadata = await Bun.file(resolve(directory, "generation.json")).json();
    change(spec, metadata);
    await Bun.write(resolve(directory, "spec/affinity.openapi.json"), JSON.stringify(spec));
    await Bun.write(resolve(directory, "generation.json"), JSON.stringify(metadata));
    await Bun.write(resolve(directory, "src/keep-on-failure.txt"), "existing source");
    const result = Bun.spawnSync([process.execPath, "scripts/generate-facade.ts"], {
      cwd: directory,
    });
    return {
      exitCode: result.exitCode,
      stderr: result.stderr.toString(),
      keptSource: await Bun.file(resolve(directory, "src/keep-on-failure.txt")).exists(),
      sdk: result.exitCode === 0 ? await Bun.file(resolve(directory, "src/sdk.ts")).text() : null,
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("facade generation accepts deprecated contract-only operations and preserves pinned output", async () => {
  const baseline = await generate(() => {});
  const deprecated = await generate((spec) => {
    spec.paths["/retired"] = { post: { operationId: "retiredWrite", deprecated: true } };
  });
  expect(baseline.exitCode).toBe(0);
  expect(deprecated.exitCode).toBe(0);
  expect(deprecated.sdk).toBe(baseline.sdk);
});

test("invalid active operations fail before replacing source", async () => {
  const result = await generate((spec) => {
    spec.paths["/new"] = { get: { operationId: "missingRead" } };
  });
  expect(result.exitCode).not.toBe(0);
  expect(result.keptSource).toBe(true);
});

test("generation rebuilds output metadata rather than trusting retired mappings", async () => {
  const baseline = await generate(() => {});
  const stale = await generate((_spec, metadata) => {
    delete metadata.sdkMethods["account.account"];
    metadata.sdkMethods.staleMethod = "stale.method";
  });
  expect(stale.exitCode).toBe(0);
  expect(stale.sdk).toBe(baseline.sdk);
});

test("contract field changes drive generated request types", async () => {
  const result = await generate((spec) => {
    spec.paths["/v1/practices"].post.requestBody.content[
      "application/json"
    ].schema.properties.name.enum = ["contract-name"];
  });
  expect(result.exitCode).toBe(0);
  expect(result.sdk).toContain('"name": "contract-name"');
});

test("contract idempotency headers determine facade request options", async () => {
  const baseline = await generate(() => {});
  expect(baseline.exitCode).toBe(0);
  expect(baseline.sdk).toContain(
    "remove(webhookEndpointId: string,options: UnkeyedRequestOptions = {})",
  );
  expect(baseline.sdk).toContain("get(options: UnkeyedRequestOptions = {})");
  expect(baseline.sdk).toContain(
    "resendFailed(webhookEndpointId: string,options: SDKRequestOptions = {})",
  );
  const changed = await generate((spec) => {
    const endpoint = spec.paths["/v1/webhook-endpoints/{webhookEndpointId}"];
    endpoint.delete.parameters.push({
      in: "header",
      name: "Idempotency-Key",
      schema: { type: "string" },
    });
    endpoint.patch.parameters = endpoint.patch.parameters.filter(
      (p: any) => p.name.toLowerCase() !== "idempotency-key",
    );
  });
  expect(changed.exitCode).toBe(0);
  expect(changed.sdk).toContain(
    "remove(webhookEndpointId: string,options: SDKRequestOptions = {})",
  );
  expect(changed.sdk).toContain("params: WebhookUpdateParams,options: UnkeyedRequestOptions = {})");
});
