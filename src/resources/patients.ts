// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListPatientsRequest, PatientsApi } from "../apis/PatientsApi";
import type { CreatePatientRequest } from "../models/CreatePatientRequest";
import type { UpdatePatientRequest } from "../models/UpdatePatientRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type PatientListParams = Omit<ListPatientsRequest, "practiceId">;

export class PatientsResource {
  constructor(
    private readonly api: PatientsApi,
    private readonly affinityActor?: AffinityActor,
  ) {}
  list(practiceId: string, params: PatientListParams = {}) {
    requireAffinityActor(this.affinityActor);
    return this.api.listPatients({
      ...params,
      practiceId,
    });
  }
  retrieve(practiceId: string, patientId: string) {
    requireAffinityActor(this.affinityActor);
    return this.api.getPatient({
      patientId,
      practiceId,
    });
  }
  create(practiceId: string, params: CreatePatientRequest, options: MutationOptions) {
    requireAffinityActor(this.affinityActor);
    return this.api.createPatient({
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
    requireAffinityActor(this.affinityActor);
    return this.api.updatePatient({
      idempotencyKey: options.idempotencyKey,
      patientId,
      practiceId,
      updatePatientRequest: params,
    });
  }
}
