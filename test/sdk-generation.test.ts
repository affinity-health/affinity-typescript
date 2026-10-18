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
      webhooks:
        result.exitCode === 0
          ? await Bun.file(resolve(directory, "src/webhook-events.ts")).text()
          : null,
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

test("facade generation rejects unmapped active operations before replacing source", async () => {
  const result = await generate((spec) => {
    spec.paths["/new"] = { get: { operationId: "missingRead" } };
  });
  expect(result.exitCode).not.toBe(0);
  expect(result.stderr).toContain("Map the public operation missingRead before generating");
  expect(result.keptSource).toBe(true);
});

test("webhook generation follows the webhook schema independently of order response states", async () => {
  const result = await generate((spec) => {
    const event =
      spec.webhooks.orderEvent.post.requestBody.content["application/json"].schema.anyOf[0];
    event.properties.type.enum.push("order.future");
    event.properties.data.properties.order.properties.status.enum.push("future_status");
    event.properties.data.properties.order.properties.vendorReference = { type: "string" };
  });
  expect(result.exitCode).toBe(0);
  expect(result.webhooks).toContain('"order.future"');
  expect(result.webhooks).toContain('"future_status"');
  expect(result.webhooks).toContain('"vendorReference"?: string');
  expect(result.sdk).not.toContain('"future_status"');
});
