# MembershipsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                              | HTTP request                                                    | Description                |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- |
| [**createPracticeMembership**](MembershipsApi.md#createpracticemembershipoperation) | **POST** /v1/practices/{practiceId}/memberships                 | Create practice membership |
| [**listPracticeMemberships**](MembershipsApi.md#listpracticememberships)            | **GET** /v1/practices/{practiceId}/memberships                  | List practice memberships  |
| [**updatePracticeMembership**](MembershipsApi.md#updatepracticemembershipoperation) | **PATCH** /v1/practices/{practiceId}/memberships/{membershipId} | Update practice membership |

## createPracticeMembership

> CreatePracticeMembershipResponse createPracticeMembership(practiceId, idempotencyKey, createPracticeMembershipRequest, affinityVersion)

Create practice membership

Creates a pending role grant. The user must accept it in an Affinity Hosted launch before it becomes active.

### Example

```ts
import {
  Configuration,
  MembershipsApi,
} from '@affinity-health/sdk';
import type { CreatePracticeMembershipOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new MembershipsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeMembershipRequest
    createPracticeMembershipRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePracticeMembershipOperationRequest;

  try {
    const data = await api.createPracticeMembership(body);
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
| **createPracticeMembershipRequest** | [CreatePracticeMembershipRequest](CreatePracticeMembershipRequest.md) |             |                                      |
| **affinityVersion**                 | `string`                                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticeMembershipResponse**](CreatePracticeMembershipResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPracticeMemberships

> ListPracticeMembershipsResponse listPracticeMemberships(practiceId, affinityVersion)

List practice memberships

Lists pending, active, and revoked platform membership grants.

### Example

```ts
import { Configuration, MembershipsApi } from "@affinity-health/sdk";
import type { ListPracticeMembershipsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new MembershipsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeMembershipsRequest;

  try {
    const data = await api.listPracticeMemberships(body);
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

[**ListPracticeMembershipsResponse**](ListPracticeMembershipsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePracticeMembership

> UpdatePracticeMembershipResponse updatePracticeMembership(membershipId, practiceId, idempotencyKey, updatePracticeMembershipRequest, affinityVersion)

Update practice membership

Changes a pending grant\&#39;s role or revokes the grant.

### Example

```ts
import {
  Configuration,
  MembershipsApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeMembershipOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new MembershipsApi(config);

  const body = {
    // string
    membershipId: membershipId_example,
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeMembershipRequest
    updatePracticeMembershipRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeMembershipOperationRequest;

  try {
    const data = await api.updatePracticeMembership(body);
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
| **membershipId**                    | `string`                                                              |             | [Defaults to `undefined`]            |
| **practiceId**                      | `string`                                                              |             | [Defaults to `undefined`]            |
| **idempotencyKey**                  | `string`                                                              |             | [Defaults to `undefined`]            |
| **updatePracticeMembershipRequest** | [UpdatePracticeMembershipRequest](UpdatePracticeMembershipRequest.md) |             |                                      |
| **affinityVersion**                 | `string`                                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeMembershipResponse**](UpdatePracticeMembershipResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     | HTTP 200    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
