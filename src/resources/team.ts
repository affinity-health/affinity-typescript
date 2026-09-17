// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

import type {
  TeamApi,
  RegisterUserOperationRequest,
  InvitePracticeTeamPersonOperationRequest,
  ListPracticeTeamInvitationsRequest,
  GetPracticeTeamRequest,
  ListPracticeTeamMembersRequest,
  ListPracticeTeamPrescribersRequest,
  GetPracticeTeamMemberRequest,
  UpdatePracticeTeamMemberOperationRequest,
  GetPracticeTeamPrescriberRequest,
  UpdatePracticeTeamPrescriberOperationRequest,
  CreatePracticeTeamLicenseOperationRequest,
  UpdatePracticeTeamLicenseOperationRequest,
  GetPracticeTeamInvitationRequest,
  RevokePracticeTeamInvitationRequest,
  ResendPracticeTeamInvitationRequest,
} from "../apis/TeamApi";
import type { RegisterUserRequest } from "../models/RegisterUserRequest";
import type { InvitePracticeTeamPersonRequest } from "../models/InvitePracticeTeamPersonRequest";
import type { UpdatePracticeTeamMemberRequest } from "../models/UpdatePracticeTeamMemberRequest";
import type { UpdatePracticeTeamPrescriberRequest } from "../models/UpdatePracticeTeamPrescriberRequest";
import type { CreatePracticeTeamLicenseRequest } from "../models/CreatePracticeTeamLicenseRequest";
import type { UpdatePracticeTeamLicenseRequest } from "../models/UpdatePracticeTeamLicenseRequest";
import {
  commonHeaders,
  requestOverrides,
  type MutationOptions,
  type RequestOptions,
  requiredIdempotencyKey,
} from "./shared";

export type RegisterUserParams = Omit<
  RegisterUserRequest,
  "externalId" | "email" | "name" | "role" | "identityAttestation"
> & {
  externalId: NonNullable<RegisterUserRequest["externalId"]>;
  email: NonNullable<RegisterUserRequest["email"]>;
  name: NonNullable<RegisterUserRequest["name"]>;
  role: NonNullable<RegisterUserRequest["role"]>;
  identityAttestation: NonNullable<RegisterUserRequest["identityAttestation"]>;
};
export type InvitePracticeTeamPersonParams = Omit<
  InvitePracticeTeamPersonRequest,
  "externalId" | "email" | "name"
> & {
  externalId: NonNullable<InvitePracticeTeamPersonRequest["externalId"]>;
  email: NonNullable<InvitePracticeTeamPersonRequest["email"]>;
  name: NonNullable<InvitePracticeTeamPersonRequest["name"]>;
};
export type ListPracticeTeamInvitationsParams = Omit<
  ListPracticeTeamInvitationsRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type ListPracticeTeamMembersParams = Omit<
  ListPracticeTeamMembersRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type ListPracticeTeamPrescribersParams = Omit<
  ListPracticeTeamPrescribersRequest,
  | "practiceId"
  | "affinityVersion"
  | "idempotencyKey"
  | "affinityActorId"
  | "affinityActorType"
  | "xAffinityOrganizationId"
>;
export type UpdatePracticeTeamMemberParams = UpdatePracticeTeamMemberRequest;
export type UpdatePracticeTeamPrescriberParams = UpdatePracticeTeamPrescriberRequest;
export type CreatePracticeTeamLicenseParams = Omit<
  CreatePracticeTeamLicenseRequest,
  "state" | "licenseNumber"
> & {
  state: NonNullable<CreatePracticeTeamLicenseRequest["state"]>;
  licenseNumber: NonNullable<CreatePracticeTeamLicenseRequest["licenseNumber"]>;
};
export type UpdatePracticeTeamLicenseParams = UpdatePracticeTeamLicenseRequest;

export class TeamResource {
  constructor(private readonly api: TeamApi) {}
  createUser(
    practiceId: string,
    params: RegisterUserParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["registerUser"]> {
    return this.api.registerUser(
      {
        practiceId: practiceId,
        registerUserRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  invite(
    practiceId: string,
    params: InvitePracticeTeamPersonParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["invitePracticeTeamPerson"]> {
    return this.api.invitePracticeTeamPerson(
      {
        practiceId: practiceId,
        invitePracticeTeamPersonRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  listInvitations(
    practiceId: string,
    params: ListPracticeTeamInvitationsParams = {},
    options?: RequestOptions,
  ): ReturnType<TeamApi["listPracticeTeamInvitations"]> {
    return this.api.listPracticeTeamInvitations(
      { ...params, practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  retrieve(practiceId: string, options?: RequestOptions): ReturnType<TeamApi["getPracticeTeam"]> {
    return this.api.getPracticeTeam(
      { practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  listMembers(
    practiceId: string,
    params: ListPracticeTeamMembersParams = {},
    options?: RequestOptions,
  ): ReturnType<TeamApi["listPracticeTeamMembers"]> {
    return this.api.listPracticeTeamMembers(
      { ...params, practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  listPrescribers(
    practiceId: string,
    params: ListPracticeTeamPrescribersParams = {},
    options?: RequestOptions,
  ): ReturnType<TeamApi["listPracticeTeamPrescribers"]> {
    return this.api.listPracticeTeamPrescribers(
      { ...params, practiceId: practiceId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  retrieveMember(
    practiceId: string,
    memberId: string,
    options?: RequestOptions,
  ): ReturnType<TeamApi["getPracticeTeamMember"]> {
    return this.api.getPracticeTeamMember(
      { practiceId: practiceId, memberId: memberId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  updateMember(
    practiceId: string,
    memberId: string,
    params: UpdatePracticeTeamMemberParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["updatePracticeTeamMember"]> {
    return this.api.updatePracticeTeamMember(
      {
        practiceId: practiceId,
        memberId: memberId,
        updatePracticeTeamMemberRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrievePrescriber(
    practiceId: string,
    prescriberId: string,
    options?: RequestOptions,
  ): ReturnType<TeamApi["getPracticeTeamPrescriber"]> {
    return this.api.getPracticeTeamPrescriber(
      { practiceId: practiceId, prescriberId: prescriberId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  updatePrescriber(
    practiceId: string,
    prescriberId: string,
    params: UpdatePracticeTeamPrescriberParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["updatePracticeTeamPrescriber"]> {
    return this.api.updatePracticeTeamPrescriber(
      {
        practiceId: practiceId,
        prescriberId: prescriberId,
        updatePracticeTeamPrescriberRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  createLicense(
    practiceId: string,
    prescriberId: string,
    params: CreatePracticeTeamLicenseParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["createPracticeTeamLicense"]> {
    return this.api.createPracticeTeamLicense(
      {
        practiceId: practiceId,
        prescriberId: prescriberId,
        createPracticeTeamLicenseRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  updateLicense(
    practiceId: string,
    prescriberId: string,
    licenseId: string,
    params: UpdatePracticeTeamLicenseParams,
    options: MutationOptions,
  ): ReturnType<TeamApi["updatePracticeTeamLicense"]> {
    return this.api.updatePracticeTeamLicense(
      {
        practiceId: practiceId,
        prescriberId: prescriberId,
        licenseId: licenseId,
        updatePracticeTeamLicenseRequest: params,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  retrieveInvitation(
    practiceId: string,
    invitationId: string,
    options?: RequestOptions,
  ): ReturnType<TeamApi["getPracticeTeamInvitation"]> {
    return this.api.getPracticeTeamInvitation(
      { practiceId: practiceId, invitationId: invitationId, ...commonHeaders(options) },
      requestOverrides(options),
    );
  }
  revokeInvitation(
    practiceId: string,
    invitationId: string,
    options: MutationOptions,
  ): ReturnType<TeamApi["revokePracticeTeamInvitation"]> {
    return this.api.revokePracticeTeamInvitation(
      {
        practiceId: practiceId,
        invitationId: invitationId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
  resendInvitation(
    practiceId: string,
    invitationId: string,
    options: MutationOptions,
  ): ReturnType<TeamApi["resendPracticeTeamInvitation"]> {
    return this.api.resendPracticeTeamInvitation(
      {
        practiceId: practiceId,
        invitationId: invitationId,
        ...commonHeaders(options),
        idempotencyKey: requiredIdempotencyKey(options),
      },
      requestOverrides(options),
    );
  }
}
