// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  AccountGetResponse,
  MedicationGetResponse,
  OrderGetResponse,
  OrderCreateResponse,
  PracticeGetResponse,
} from "./sdk";
export type Account = AccountGetResponse;
export type Medication = MedicationGetResponse;
export type Order = OrderGetResponse;
export type CreatedOrder = OrderCreateResponse;
export type Practice = PracticeGetResponse;
export type Patient = Order["patient"];
export type Prescription = Order["prescriptions"][number];
