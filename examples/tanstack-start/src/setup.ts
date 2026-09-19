import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PreviewOrderParams } from "@affinity-health/sdk";

const token = z.string().min(1).max(200_000);
const practiceId = z.string().regex(/^prac_[a-zA-Z0-9]+$/);

export const loadPractices = createServerFn({ method: "POST" })
  .validator(
    z.object({
      startingAfter: z.string().max(100).optional(),
      mode: z.enum(["test", "live"]).default("test"),
    }),
  )
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.practices(data.startingAfter, data.mode));
  });

export const preparePatient = createServerFn({ method: "POST" })
  .validator(z.object({ runId: z.uuid(), practiceId }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.prepare(data.runId, data.practiceId));
  });

export const loadCatalog = createServerFn({ method: "POST" })
  .validator(
    z.object({
      practiceId,
      query: z.string().max(200),
      startingAfter: z.string().max(100).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.catalog(data.practiceId, data.query, data.startingAfter));
  });

export const previewOrder = createServerFn({ method: "POST" })
  .validator(z.object({ patientToken: token, itemsJson: z.string().max(100_000) }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(async () => {
      // The API validates nested clinical overrides against the published contract.
      // Only item arrays and shipping selection cross this boundary, never patient/practice.
      const parsed = z
        .object({
          prescriptions: z
            .array(z.object({ medicationId: z.string().min(1) }).passthrough())
            .min(1)
            .max(20),
          otcItems: z
            .array(
              z
                .object({ catalogItemId: z.string().min(1), quantity: z.number().int().positive() })
                .passthrough(),
            )
            .max(20)
            .optional(),
          shipping: z.object({ selection: z.enum(["lowest_cost", "fastest", "manual"]) }),
        })
        .parse(JSON.parse(data.itemsJson));
      return w.preview(
        data.patientToken,
        parsed as Pick<PreviewOrderParams, "prescriptions" | "otcItems" | "shipping">,
      );
    });
  });

export const saveDraft = createServerFn({ method: "POST" })
  .validator(z.object({ token }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.createDraft(data.token));
  });

export const reviewAllergies = createServerFn({ method: "POST" })
  .validator(z.object({ token, confirmed: z.literal(true) }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.recordAllergies(data.token));
  });

export const signOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({ token, npi: z.enum(["1234567893", "1111111112"]), attested: z.literal(true) }),
  )
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.sign(data.token, data.npi));
  });

export const refreshOrder = createServerFn({ method: "POST" })
  .validator(z.object({ token }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.refresh(data.token));
  });
