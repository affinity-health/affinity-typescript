import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const loadPractices = createServerFn({ method: "POST" })
  .validator(z.object({ startingAfter: z.string().max(2048).optional() }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.practices(data.startingAfter));
  });

export const loadMedications = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().max(120), startingAfter: z.string().optional() }))
  .handler(async ({ data }) => {
    const w = await import("./workflow.server");
    return w.safely(() => w.medications(data.query, data.startingAfter));
  });
