// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { Affinity } from "./sdk";
export type Practice = Awaited<ReturnType<Affinity["practices"]["get"]>>;
export type Patient = Awaited<ReturnType<Affinity["patients"]["get"]>>;
export type Order = Awaited<ReturnType<Affinity["orders"]["get"]>>;
export type CreatedOrder = Awaited<ReturnType<Affinity["orders"]["create"]>>;
export type CatalogItem = Awaited<ReturnType<Affinity["catalog"]["items"]["list"]>>["data"][number];
export type PracticeLocation = Awaited<ReturnType<Affinity["locations"]["get"]>>;
