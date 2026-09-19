# TeamApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                               | HTTP request                                                                              | Description          |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------- |
| [**createPracticeTeamLicense**](TeamApi.md#createpracticeteamlicenseoperation)       | **POST** /v1/practices/{practiceId}/team/prescribers/{prescriberId}/licenses              | Add license          |
| [**getPracticeTeam**](TeamApi.md#getpracticeteam)                                    | **GET** /v1/practices/{practiceId}/team                                                   | Get team             |
| [**getPracticeTeamInvitation**](TeamApi.md#getpracticeteaminvitation)                | **GET** /v1/practices/{practiceId}/team/invitations/{invitationId}                        | Get invitation       |
| [**getPracticeTeamMember**](TeamApi.md#getpracticeteammember)                        | **GET** /v1/practices/{practiceId}/team/members/{memberId}                                | Get member           |
| [**getPracticeTeamPrescriber**](TeamApi.md#getpracticeteamprescriber)                | **GET** /v1/practices/{practiceId}/team/prescribers/{prescriberId}                        | Get prescriber       |
| [**invitePracticeTeamPerson**](TeamApi.md#invitepracticeteampersonoperation)         | **POST** /v1/practices/{practiceId}/team/invitations                                      | Invite team member   |
| [**listPracticeTeamInvitations**](TeamApi.md#listpracticeteaminvitations)            | **GET** /v1/practices/{practiceId}/team/invitations                                       | List invitations     |
| [**listPracticeTeamMembers**](TeamApi.md#listpracticeteammembers)                    | **GET** /v1/practices/{practiceId}/team/members                                           | List team members    |
| [**listPracticeTeamPrescribers**](TeamApi.md#listpracticeteamprescribers)            | **GET** /v1/practices/{practiceId}/team/prescribers                                       | List prescribers     |
| [**registerUser**](TeamApi.md#registeruseroperation)                                 | **POST** /v1/practices/{practiceId}/users                                                 | Register user        |
| [**resendPracticeTeamInvitation**](TeamApi.md#resendpracticeteaminvitation)          | **POST** /v1/practices/{practiceId}/team/invitations/{invitationId}/resend                | Resend invitation    |
| [**revokePracticeTeamInvitation**](TeamApi.md#revokepracticeteaminvitation)          | **DELETE** /v1/practices/{practiceId}/team/invitations/{invitationId}                     | Revoke invitation    |
| [**updatePracticeTeamLicense**](TeamApi.md#updatepracticeteamlicenseoperation)       | **PATCH** /v1/practices/{practiceId}/team/prescribers/{prescriberId}/licenses/{licenseId} | Update license       |
| [**updatePracticeTeamMember**](TeamApi.md#updatepracticeteammemberoperation)         | **PATCH** /v1/practices/{practiceId}/team/members/{memberId}                              | Update member access |
| [**updatePracticeTeamPrescriber**](TeamApi.md#updatepracticeteamprescriberoperation) | **PATCH** /v1/practices/{practiceId}/team/prescribers/{prescriberId}                      | Update prescriber    |

## createPracticeTeamLicense

> CreatePracticeTeamLicenseResponse createPracticeTeamLicense(practiceId, prescriberId, idempotencyKey, createPracticeTeamLicenseRequest, affinityVersion)

Add license

Requires team:write and an active accepted prescriber account connection in this practice. Adds a license. Expiration is optional, but must be in the future when supplied. An exact repeat returns the existing license; update an existing license with PATCH and its license ID. Licenses are shared across practices and Test/Live. Other licenses stay unchanged.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { CreatePracticeTeamLicenseOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    prescriberId: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeTeamLicenseRequest
    createPracticeTeamLicenseRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePracticeTeamLicenseOperationRequest;

  try {
    const data = await api.createPracticeTeamLicense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                 | Type                                                                    | Description | Notes                                |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                       | `string`                                                                |             | [Defaults to `undefined`]            |
| **prescriberId**                     | `string`                                                                |             | [Defaults to `undefined`]            |
| **idempotencyKey**                   | `string`                                                                |             | [Defaults to `undefined`]            |
| **createPracticeTeamLicenseRequest** | [CreatePracticeTeamLicenseRequest](CreatePracticeTeamLicenseRequest.md) |             |                                      |
| **affinityVersion**                  | `string`                                                                |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticeTeamLicenseResponse**](CreatePracticeTeamLicenseResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPracticeTeam

> GetPracticeTeamResponse getPracticeTeam(practiceId, affinityVersion)

Get team

Requires team:read. Returns counts of members, invitations, and prescribers. Use the paginated members, prescribers, and invitations collections for individual records. Team access and clinician credentials are shared between Test and Live.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { GetPracticeTeamRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeTeamRequest;

  try {
    const data = await api.getPracticeTeam(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticeTeamResponse**](GetPracticeTeamResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPracticeTeamInvitation

> GetPracticeTeamInvitationResponse getPracticeTeamInvitation(practiceId, invitationId, affinityVersion)

Get invitation

Requires team:read. Returns invitation status and current onboarding state for your integration. An accepted invitation can still have disabled membership or pending clinical review. Invitation tokens are never returned.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { GetPracticeTeamInvitationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    invitationId: invite_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeTeamInvitationRequest;

  try {
    const data = await api.getPracticeTeamInvitation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **invitationId**    | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticeTeamInvitationResponse**](GetPracticeTeamInvitationResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPracticeTeamMember

> GetPracticeTeamMemberResponse getPracticeTeamMember(practiceId, memberId, affinityVersion)

Get member

Requires team:read. Returns current account membership, roles, location access, and prescriber connection. The member ID identifies practice access; it is not the integration user ID used by orders or sessions.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { GetPracticeTeamMemberRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    memberId: mbr_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeTeamMemberRequest;

  try {
    const data = await api.getPracticeTeamMember(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **memberId**        | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticeTeamMemberResponse**](GetPracticeTeamMemberResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPracticeTeamPrescriber

> GetPracticeTeamPrescriberResponse getPracticeTeamPrescriber(practiceId, prescriberId, affinityVersion)

Get prescriber

Requires team:read. Returns the clinical profile and submitted licenses, including license IDs. This is setup information, not a signing authorization.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { GetPracticeTeamPrescriberRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    prescriberId: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeTeamPrescriberRequest;

  try {
    const data = await api.getPracticeTeamPrescriber(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **prescriberId**    | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticeTeamPrescriberResponse**](GetPracticeTeamPrescriberResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## invitePracticeTeamPerson

> InvitePracticeTeamPersonResponse invitePracticeTeamPerson(practiceId, idempotencyKey, invitePracticeTeamPersonRequest, affinityVersion)

Invite team member

Requires team:write on the practice key or its platform key. Use roles to combine administrator, prescriber, clinical_staff, billing, or developer presets. Ownership uses the protected owner designation. The singular role field remains available for single-role assignments. Creates a real organization invitation and optional prescriber setup. The recipient must accept with their Affinity account. Repeating the same external identity retries pending invitation delivery. Accepted invitations do not change existing access. Team membership is shared between Test and Live; the external identity is mode-scoped. Keys cannot accept invitations. Headless registration and signing use separate endpoints.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { InvitePracticeTeamPersonOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // InvitePracticeTeamPersonRequest
    invitePracticeTeamPersonRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies InvitePracticeTeamPersonOperationRequest;

  try {
    const data = await api.invitePracticeTeamPerson(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                | Type                                                                  | Description | Notes                                |
| ----------------------------------- | --------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                      | `string`                                                              |             | [Defaults to `undefined`]            |
| **idempotencyKey**                  | `string`                                                              |             | [Defaults to `undefined`]            |
| **invitePracticeTeamPersonRequest** | [InvitePracticeTeamPersonRequest](InvitePracticeTeamPersonRequest.md) |             |                                      |
| **affinityVersion**                 | `string`                                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**InvitePracticeTeamPersonResponse**](InvitePracticeTeamPersonResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |
| **502**     | HTTP 502    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPracticeTeamInvitations

> ListPracticeTeamInvitationsResponse listPracticeTeamInvitations(practiceId, limit, startingAfter, endingBefore, status, email, externalId, affinityVersion)

List invitations

Requires team:read. Lists practice invitations, including invitations sent in Clinic. Filter by pending, expired, accepted, declined, or revoked status, exact email, or your integration externalId. Only your integration and API key mode can see its external identity and onboarding state. Follow person.nextActions after invitation acceptance.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { ListPracticeTeamInvitationsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: invite_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    endingBefore: invite_01j2y8m6jcc9tt24af5pw9x1bc,
    // 'accepted' | 'declined' | 'pending' | 'expired' | 'revoked' (optional)
    status: status_example,
    // string (optional)
    email: email_example,
    // string (optional)
    externalId: externalId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeTeamInvitationsRequest;

  try {
    const data = await api.listPracticeTeamInvitations(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                                                    | Description | Notes                                                                                      |
| ------------------- | ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| **practiceId**      | `string`                                                |             | [Defaults to `undefined`]                                                                  |
| **limit**           | `number`                                                |             | [Optional] [Defaults to `25`]                                                              |
| **startingAfter**   | `string`                                                |             | [Optional] [Defaults to `undefined`]                                                       |
| **endingBefore**    | `string`                                                |             | [Optional] [Defaults to `undefined`]                                                       |
| **status**          | `accepted`, `declined`, `pending`, `expired`, `revoked` |             | [Optional] [Defaults to `undefined`] [Enum: accepted, declined, pending, expired, revoked] |
| **email**           | `string`                                                |             | [Optional] [Defaults to `undefined`]                                                       |
| **externalId**      | `string`                                                |             | [Optional] [Defaults to `undefined`]                                                       |
| **affinityVersion** | `string`                                                |             | [Optional] [Defaults to `undefined`]                                                       |

### Return type

[**ListPracticeTeamInvitationsResponse**](ListPracticeTeamInvitationsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPracticeTeamMembers

> ListPracticeTeamMembersResponse listPracticeTeamMembers(practiceId, limit, startingAfter, endingBefore, search, role, status, affinityVersion)

List team members

Requires team:read. Search the roster by name or email, and filter by role or membership status. Includes members invited in Clinic, location access, and account-specific prescriber connections. Memberships are shared between Test and Live.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { ListPracticeTeamMembersRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: mbr_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    endingBefore: mbr_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    search: search_example,
    // 'owner' | 'administrator' | 'prescriber' | 'clinical_staff' | 'billing' | 'developer' (optional)
    role: role_example,
    // 'active' | 'disabled' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeTeamMembersRequest;

  try {
    const data = await api.listPracticeTeamMembers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                                                                             | Description | Notes                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| **practiceId**      | `string`                                                                         |             | [Defaults to `undefined`]                                                                                         |
| **limit**           | `number`                                                                         |             | [Optional] [Defaults to `25`]                                                                                     |
| **startingAfter**   | `string`                                                                         |             | [Optional] [Defaults to `undefined`]                                                                              |
| **endingBefore**    | `string`                                                                         |             | [Optional] [Defaults to `undefined`]                                                                              |
| **search**          | `string`                                                                         |             | [Optional] [Defaults to `undefined`]                                                                              |
| **role**            | `owner`, `administrator`, `prescriber`, `clinical_staff`, `billing`, `developer` |             | [Optional] [Defaults to `undefined`] [Enum: owner, administrator, prescriber, clinical_staff, billing, developer] |
| **status**          | `active`, `disabled`                                                             |             | [Optional] [Defaults to `undefined`] [Enum: active, disabled]                                                     |
| **affinityVersion** | `string`                                                                         |             | [Optional] [Defaults to `undefined`]                                                                              |

### Return type

[**ListPracticeTeamMembersResponse**](ListPracticeTeamMembersResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPracticeTeamPrescribers

> ListPracticeTeamPrescribersResponse listPracticeTeamPrescribers(practiceId, limit, startingAfter, endingBefore, search, npi, state, status, affinityVersion)

List prescribers

Requires team:read. Filter practice prescribers by name, NPI, state, and practice status. Records include submitted licenses and their IDs. Signing authority also requires an active account connection, Live practice access, and prescription eligibility.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { ListPracticeTeamPrescribersRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    endingBefore: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    search: search_example,
    // string (optional)
    npi: npi_example,
    // string (optional)
    state: state_example,
    // 'active' | 'inactive' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeTeamPrescribersRequest;

  try {
    const data = await api.listPracticeTeamPrescribers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                 | Description | Notes                                                         |
| ------------------- | -------------------- | ----------- | ------------------------------------------------------------- |
| **practiceId**      | `string`             |             | [Defaults to `undefined`]                                     |
| **limit**           | `number`             |             | [Optional] [Defaults to `25`]                                 |
| **startingAfter**   | `string`             |             | [Optional] [Defaults to `undefined`]                          |
| **endingBefore**    | `string`             |             | [Optional] [Defaults to `undefined`]                          |
| **search**          | `string`             |             | [Optional] [Defaults to `undefined`]                          |
| **npi**             | `string`             |             | [Optional] [Defaults to `undefined`]                          |
| **state**           | `string`             |             | [Optional] [Defaults to `undefined`]                          |
| **status**          | `active`, `inactive` |             | [Optional] [Defaults to `undefined`] [Enum: active, inactive] |
| **affinityVersion** | `string`             |             | [Optional] [Defaults to `undefined`]                          |

### Return type

[**ListPracticeTeamPrescribersResponse**](ListPracticeTeamPrescribersResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## registerUser

> RegisterUserResponse registerUser(practiceId, idempotencyKey, registerUserRequest, affinityVersion)

Register user

Requires team:write and Idempotency-Key. Registers a practice member without an invitation. Test requires synthetic .test emails and Affinity Test NPIs. Live requires approved integration and practice access. Identity attestation records the integration\&#39;s assertion; it does not verify login email or clinical credentials. Existing memberships and verified provider records are preserved. Use the returned user ID for orders and signing.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { RegisterUserOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // RegisterUserRequest
    registerUserRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RegisterUserOperationRequest;

  try {
    const data = await api.registerUser(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                    | Type                                          | Description | Notes                                |
| ----------------------- | --------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**          | `string`                                      |             | [Defaults to `undefined`]            |
| **idempotencyKey**      | `string`                                      |             | [Defaults to `undefined`]            |
| **registerUserRequest** | [RegisterUserRequest](RegisterUserRequest.md) |             |                                      |
| **affinityVersion**     | `string`                                      |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RegisterUserResponse**](RegisterUserResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## resendPracticeTeamInvitation

> ResendPracticeTeamInvitationResponse resendPracticeTeamInvitation(practiceId, invitationId, idempotencyKey, affinityVersion)

Resend invitation

Requires team:write. Resends a pending or expired invitation with the same ID, recipient, roles, and locations. The previous link stops working and the new link expires in seven days. Accepted and revoked invitations return 409. A 502 means the invitation was saved but email delivery could not be confirmed; retry this operation.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { ResendPracticeTeamInvitationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    invitationId: invite_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ResendPracticeTeamInvitationRequest;

  try {
    const data = await api.resendPracticeTeamInvitation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **invitationId**    | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ResendPracticeTeamInvitationResponse**](ResendPracticeTeamInvitationResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |
| **502**     | HTTP 502    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## revokePracticeTeamInvitation

> RevokePracticeTeamInvitationResponse revokePracticeTeamInvitation(practiceId, invitationId, idempotencyKey, affinityVersion)

Revoke invitation

Requires team:write. Revokes a pending or expired invitation and its pending prescriber account connection. Repeating the revoke returns the revoked invitation. Accepted invitations return 409; disable the member instead. Retains invitation history.

### Example

```ts
import { Configuration, TeamApi } from "@affinity-health/sdk";
import type { RevokePracticeTeamInvitationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    invitationId: invite_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RevokePracticeTeamInvitationRequest;

  try {
    const data = await api.revokePracticeTeamInvitation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **invitationId**    | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RevokePracticeTeamInvitationResponse**](RevokePracticeTeamInvitationResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePracticeTeamLicense

> UpdatePracticeTeamLicenseResponse updatePracticeTeamLicense(practiceId, prescriberId, licenseId, idempotencyKey, updatePracticeTeamLicenseRequest, affinityVersion)

Update license

Requires team:write and an active accepted prescriber account connection in this practice. Correct the state or license number, or set or clear the optional expiresAt value. A supplied expiration must be in the future. Other licenses stay unchanged. Changes apply across practices and Test/Live.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeTeamLicenseOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    prescriberId: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    licenseId: lic_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeTeamLicenseRequest
    updatePracticeTeamLicenseRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeTeamLicenseOperationRequest;

  try {
    const data = await api.updatePracticeTeamLicense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                 | Type                                                                    | Description | Notes                                |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                       | `string`                                                                |             | [Defaults to `undefined`]            |
| **prescriberId**                     | `string`                                                                |             | [Defaults to `undefined`]            |
| **licenseId**                        | `string`                                                                |             | [Defaults to `undefined`]            |
| **idempotencyKey**                   | `string`                                                                |             | [Defaults to `undefined`]            |
| **updatePracticeTeamLicenseRequest** | [UpdatePracticeTeamLicenseRequest](UpdatePracticeTeamLicenseRequest.md) |             |                                      |
| **affinityVersion**                  | `string`                                                                |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeTeamLicenseResponse**](UpdatePracticeTeamLicenseResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePracticeTeamMember

> UpdatePracticeTeamMemberResponse updatePracticeTeamMember(practiceId, memberId, idempotencyKey, updatePracticeTeamMemberRequest, affinityVersion)

Update member access

Requires team:write. Supply role, status, or locationIds; omitted values stay unchanged. A role replaces existing roles. Disable access with status disabled. An empty locationIds array grants all practice locations. Ownership changes require an active practice owner using a personal API key; service keys manage non-owner memberships. The final active owner cannot be removed. Changes apply to both Test and Live. Sign-in email and account security remain account settings.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeTeamMemberOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    memberId: mbr_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeTeamMemberRequest
    updatePracticeTeamMemberRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeTeamMemberOperationRequest;

  try {
    const data = await api.updatePracticeTeamMember(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                | Type                                                                  | Description | Notes                                |
| ----------------------------------- | --------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                      | `string`                                                              |             | [Defaults to `undefined`]            |
| **memberId**                        | `string`                                                              |             | [Defaults to `undefined`]            |
| **idempotencyKey**                  | `string`                                                              |             | [Defaults to `undefined`]            |
| **updatePracticeTeamMemberRequest** | [UpdatePracticeTeamMemberRequest](UpdatePracticeTeamMemberRequest.md) |             |                                      |
| **affinityVersion**                 | `string`                                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeTeamMemberResponse**](UpdatePracticeTeamMemberResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePracticeTeamPrescriber

> UpdatePracticeTeamPrescriberResponse updatePracticeTeamPrescriber(practiceId, prescriberId, idempotencyKey, updatePracticeTeamPrescriberRequest, affinityVersion)

Update prescriber

Requires team:write and an active prescriber with a registered or accepted account connection and active practice membership. Updates only supplied profile fields. NPI cannot be changed. The canonical profile is shared across practices and Test/Live.

### Example

```ts
import {
  Configuration,
  TeamApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeTeamPrescriberOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new TeamApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    prescriberId: prov_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeTeamPrescriberRequest
    updatePracticeTeamPrescriberRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeTeamPrescriberOperationRequest;

  try {
    const data = await api.updatePracticeTeamPrescriber(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                    | Type                                                                          | Description | Notes                                |
| --------------------------------------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                          | `string`                                                                      |             | [Defaults to `undefined`]            |
| **prescriberId**                        | `string`                                                                      |             | [Defaults to `undefined`]            |
| **idempotencyKey**                      | `string`                                                                      |             | [Defaults to `undefined`]            |
| **updatePracticeTeamPrescriberRequest** | [UpdatePracticeTeamPrescriberRequest](UpdatePracticeTeamPrescriberRequest.md) |             |                                      |
| **affinityVersion**                     | `string`                                                                      |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeTeamPrescriberResponse**](UpdatePracticeTeamPrescriberResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
