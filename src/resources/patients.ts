// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  PatientsApi,
  ListPatientAddressesRequest,
  CreatePatientAddressOperationRequest,
  UpdatePatientAddressOperationRequest,
  ArchivePatientAddressRequest,
  SetDefaultPatientAddressRequest,
  ListPatientsRequest,
  CreatePatientOperationRequest,
  GetPatientRequest,
  DeletePatientRequest,
  UpdatePatientOperationRequest,
  GetPatientAllergiesRequest,
  ReplacePatientAllergiesOperationRequest,
} from "../apis/PatientsApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreatePatientAddressRequest } from "../models/CreatePatientAddressRequest";
import type { UpdatePatientAddressRequest } from "../models/UpdatePatientAddressRequest";
import type { CreatePatientRequest } from "../models/CreatePatientRequest";
import type { UpdatePatientRequest } from "../models/UpdatePatientRequest";
import type { ReplacePatientAllergiesRequest } from "../models/ReplacePatientAllergiesRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type ListPatientAddressesParams = Omit<
  ListPatientAddressesRequest,
  | "practiceId"
  | "patientId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type CreatePatientAddressParams = Omit<CreatePatientAddressRequest, "address"> & {
  address: NonNullable<CreatePatientAddressRequest["address"]>;
};
export type UpdatePatientAddressParams = UpdatePatientAddressRequest;
export type ListPatientsParams = Omit<
  ListPatientsRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type CreatePatientParams = Omit<CreatePatientRequest, "dateOfBirth" | "name"> & {
  dateOfBirth: NonNullable<CreatePatientRequest["dateOfBirth"]>;
  name: NonNullable<CreatePatientRequest["name"]>;
};
export type UpdatePatientParams = UpdatePatientRequest;
export type ReplacePatientAllergiesParams = Omit<
  ReplacePatientAllergiesRequest,
  "allergies" | "reviewStatus"
> & {
  allergies: NonNullable<ReplacePatientAllergiesRequest["allergies"]>;
  reviewStatus: NonNullable<ReplacePatientAllergiesRequest["reviewStatus"]>;
};

export class PatientsResource {
  constructor(private readonly api: PatientsApi) {}
  listAddresses(
    practiceId: string,
    patientId: string,
    params: ListPatientAddressesParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<PatientsApi["listPatientAddresses"]>>> {
    return paginate(
      (cursor) =>
        this.api.listPatientAddresses(
          {
            ...params,
            practiceId: practiceId,
            patientId: patientId,
            ...commonHeaders(options),
            ...cursor,
          },
          requestOverrides(options),
        ),
      params,
    );
  }
  createAddress(
    practiceId: string,
    patientId: string,
    params: CreatePatientAddressParams,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["createPatientAddress"]> {
    return this.api.createPatientAddress(
      {
        practiceId: practiceId,
        patientId: patientId,
        createPatientAddressRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  updateAddress(
    practiceId: string,
    patientId: string,
    addressId: string,
    params: UpdatePatientAddressParams,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["updatePatientAddress"]> {
    return this.api.updatePatientAddress(
      {
        practiceId: practiceId,
        patientId: patientId,
        addressId: addressId,
        updatePatientAddressRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  archiveAddress(
    practiceId: string,
    patientId: string,
    addressId: string,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["archivePatientAddress"]> {
    return this.api.archivePatientAddress(
      {
        practiceId: practiceId,
        patientId: patientId,
        addressId: addressId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  setDefaultAddress(
    practiceId: string,
    patientId: string,
    addressId: string,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["setDefaultPatientAddress"]> {
    return this.api.setDefaultPatientAddress(
      {
        practiceId: practiceId,
        patientId: patientId,
        addressId: addressId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  list(
    practiceId: string,
    params: ListPatientsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<PatientsApi["listPatients"]>>> {
    return paginate(
      (cursor) =>
        this.api.listPatients(
          { ...params, practiceId: practiceId, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  create(
    practiceId: string,
    params: CreatePatientParams,
    options?: MutationOptions,
  ): Promise<Patient> {
    return this.api.createPatient(
      {
        practiceId: practiceId,
        createPatientRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieve(practiceId: string, patientId: string, options?: RequestOptions): Promise<Patient> {
    return this.api.getPatient(
      { practiceId: practiceId, patientId: patientId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  delete(
    practiceId: string,
    patientId: string,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["deletePatient"]> {
    return this.api.deletePatient(
      {
        practiceId: practiceId,
        patientId: patientId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  update(
    practiceId: string,
    patientId: string,
    params: UpdatePatientParams,
    options?: MutationOptions,
  ): Promise<Patient> {
    return this.api.updatePatient(
      {
        practiceId: practiceId,
        patientId: patientId,
        updatePatientRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieveAllergies(
    practiceId: string,
    patientId: string,
    options?: RequestOptions,
  ): ReturnType<PatientsApi["getPatientAllergies"]> {
    return this.api.getPatientAllergies(
      { practiceId: practiceId, patientId: patientId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  replaceAllergies(
    practiceId: string,
    patientId: string,
    params: ReplacePatientAllergiesParams,
    options?: MutationOptions,
  ): ReturnType<PatientsApi["replacePatientAllergies"]> {
    return this.api.replacePatientAllergies(
      {
        practiceId: practiceId,
        patientId: patientId,
        replacePatientAllergiesRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
