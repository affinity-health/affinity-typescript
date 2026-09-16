// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  LocationsApi,
  ArchivePracticeLocationRequest,
  CreatePracticeLocationOperationRequest,
  ListPracticeLocationsRequest,
  GetPracticeLocationRequest,
  UpdatePracticeLocationOperationRequest,
} from "../apis/LocationsApi";
import type { CreatePracticeLocationRequest } from "../models/CreatePracticeLocationRequest";
import type { UpdatePracticeLocationRequest } from "../models/UpdatePracticeLocationRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type CreatePracticeLocationParams = Omit<
  CreatePracticeLocationRequest,
  "name" | "timezone"
> & {
  name: NonNullable<CreatePracticeLocationRequest["name"]>;
  timezone: NonNullable<CreatePracticeLocationRequest["timezone"]>;
};
export type ListPracticeLocationsParams = Omit<
  ListPracticeLocationsRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type UpdatePracticeLocationParams = UpdatePracticeLocationRequest;

export class LocationsResource {
  constructor(private readonly api: LocationsApi) {}
  archive(
    practiceId: string,
    locationId: string,
    options: MutationOptions,
  ): ReturnType<LocationsApi["archivePracticeLocation"]> {
    return this.api.archivePracticeLocation(
      {
        practiceId: practiceId,
        locationId: locationId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  create(
    practiceId: string,
    params: CreatePracticeLocationParams,
    options: MutationOptions,
  ): ReturnType<LocationsApi["createPracticeLocation"]> {
    return this.api.createPracticeLocation(
      {
        practiceId: practiceId,
        createPracticeLocationRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  list(
    practiceId: string,
    params: ListPracticeLocationsParams = {},
    options?: RequestOptions,
  ): ReturnType<LocationsApi["listPracticeLocations"]> {
    return this.api.listPracticeLocations(
      { ...params, practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  retrieve(
    practiceId: string,
    locationId: string,
    options?: RequestOptions,
  ): ReturnType<LocationsApi["getPracticeLocation"]> {
    return this.api.getPracticeLocation(
      { practiceId: practiceId, locationId: locationId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  update(
    practiceId: string,
    locationId: string,
    params: UpdatePracticeLocationParams,
    options: MutationOptions,
  ): ReturnType<LocationsApi["updatePracticeLocation"]> {
    return this.api.updatePracticeLocation(
      {
        practiceId: practiceId,
        locationId: locationId,
        updatePracticeLocationRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
