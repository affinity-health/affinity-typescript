// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type { BillingApi } from "../apis/BillingApi";
import type { CompletePracticePaymentSetupRequest } from "../models/CompletePracticePaymentSetupRequest";
import type { CreatePracticePaymentSetupRequest } from "../models/CreatePracticePaymentSetupRequest";
import type { MutationOptions } from "./request-options";

export class BillingResource {
  constructor(private readonly api: BillingApi) {}
  retrievePaymentProfile(practiceId: string) {
    return this.api.getPracticePaymentProfile({ practiceId });
  }
  createPaymentSetup(
    practiceId: string,
    params: CreatePracticePaymentSetupRequest,
    options: MutationOptions,
  ) {
    return this.api.createPracticePaymentSetup({
      createPracticePaymentSetupRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
  completePaymentSetup(
    practiceId: string,
    params: CompletePracticePaymentSetupRequest,
    options: MutationOptions,
  ) {
    return this.api.completePracticePaymentSetup({
      completePracticePaymentSetupRequest: params,
      idempotencyKey: options.idempotencyKey,
      practiceId,
    });
  }
}
