// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { ListPatientsRequest, PatientsApi } from "../apis/PatientsApi";
import type { CreatePatientRequest } from "../models/CreatePatientRequest";
import type { UpdatePatientRequest } from "../models/UpdatePatientRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export type PatientListParams = Omit<
  ListPatientsRequest,
  "affinityActorId" | "affinityActorType" | "affinityVersion" | "practiceId"
>;

export class PatientsResource {
  constructor(
    private readonly api: PatientsApi,
    private readonly apiVersion: string,
    private readonly affinityActor?: AffinityActor,
  ) {}
  list(practiceId: string, params: PatientListParams = {}) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.listPatients({
      ...params,
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      practiceId,
    });
  }
  retrieve(practiceId: string, patientId: string) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.getPatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      patientId,
      practiceId,
    });
  }
  create(practiceId: string, params: CreatePatientRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.createPatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
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
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.updatePatient({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      idempotencyKey: options.idempotencyKey,
      patientId,
      practiceId,
      updatePatientRequest: params,
    });
  }
}
