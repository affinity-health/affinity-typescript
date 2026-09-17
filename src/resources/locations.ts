// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  LocationsApi,
  ListPracticeLocationsRequest,
  CreatePracticeLocationOperationRequest,
  GetPracticeLocationRequest,
  UpdatePracticeLocationOperationRequest,
  ArchivePracticeLocationRequest,
} from "../apis/LocationsApi";
import type { Practice, Patient, Order, CreatedOrder, PracticeLocation } from "../domain";
import { paginate, type ApiListPromise } from "./pagination";
import type { CreatePracticeLocationRequest } from "../models/CreatePracticeLocationRequest";
import type { UpdatePracticeLocationRequest } from "../models/UpdatePracticeLocationRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type ListPracticeLocationsParams = Omit<
  ListPracticeLocationsRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type CreatePracticeLocationParams = Omit<CreatePracticeLocationRequest, "name"> & {
  name: NonNullable<CreatePracticeLocationRequest["name"]>;
};
export type UpdatePracticeLocationParams = UpdatePracticeLocationRequest;

export class LocationsResource {
  constructor(private readonly api: LocationsApi) {}
  list(
    practiceId: string,
    params: ListPracticeLocationsParams = {},
    options?: RequestOptions,
  ): ApiListPromise<Awaited<ReturnType<LocationsApi["listPracticeLocations"]>>> {
    return paginate(
      (cursor) =>
        this.api.listPracticeLocations(
          { ...params, practiceId: practiceId, ...commonHeaders(options), ...cursor },
          requestOverrides(options),
        ),
      params,
    );
  }
  create(
    practiceId: string,
    params: CreatePracticeLocationParams,
    options?: MutationOptions,
  ): Promise<PracticeLocation> {
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
  retrieve(
    practiceId: string,
    locationId: string,
    options?: RequestOptions,
  ): Promise<PracticeLocation> {
    return this.api.getPracticeLocation(
      { practiceId: practiceId, locationId: locationId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  update(
    practiceId: string,
    locationId: string,
    params: UpdatePracticeLocationParams,
    options?: MutationOptions,
  ): Promise<PracticeLocation> {
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
  archive(
    practiceId: string,
    locationId: string,
    options?: MutationOptions,
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
}
