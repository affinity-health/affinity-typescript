// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListPatientsRequest, PatientsApi } from "../apis/PatientsApi";
import type { CreatePatientRequest } from "../models/CreatePatientRequest";
import type { UpdatePatientRequest } from "../models/UpdatePatientRequest";
import type { MutationOptions } from "./request-options";

export type PatientListParams = Omit<ListPatientsRequest, "affinityVersion" | "practiceId">;

export class PatientsResource {
  constructor(
    private readonly api: PatientsApi,
    private readonly apiVersion: string,
  ) {}
  list(practiceId: string, params: PatientListParams = {}) {
    return this.api.listPatients({ ...params, affinityVersion: this.apiVersion, practiceId });
  }
  retrieve(practiceId: string, patientId: string) {
    return this.api.getPatient({ affinityVersion: this.apiVersion, patientId, practiceId });
  }
  create(practiceId: string, params: CreatePatientRequest, options: MutationOptions) {
    return this.api.createPatient({
      affinityVersion: this.apiVersion,
      createPatientRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  update(
    practiceId: string,
    patientId: string,
    params: UpdatePatientRequest,
    options: MutationOptions,
  ) {
    return this.api.updatePatient({
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      patientId,
      practiceId,
      updatePatientRequest: params,
    });
  }
}
