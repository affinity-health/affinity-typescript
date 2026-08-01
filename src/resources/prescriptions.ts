// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { PrescriptionsApi } from "../apis/PrescriptionsApi";
import type { CreatePrescriptionRequest } from "../models/CreatePrescriptionRequest";
import { type AffinityActor, requireAffinityActor } from "./actor";
import type { MutationOptions } from "./request-options";

export class PrescriptionsResource {
  constructor(
    private readonly api: PrescriptionsApi,
    private readonly apiVersion: string,
    private readonly affinityActor?: AffinityActor,
  ) {}
  create(params: CreatePrescriptionRequest, options: MutationOptions) {
    const actor = requireAffinityActor(this.affinityActor);
    return this.api.createPrescription({
      affinityActorId: actor.id,
      affinityActorType: actor.type,
      affinityVersion: this.apiVersion,
      createPrescriptionRequest: params,
      idempotencyKey: options.idempotencyKey,
    });
  }
}
