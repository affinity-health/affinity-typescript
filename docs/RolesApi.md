# RolesApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                            | HTTP request                                         | Description          |
| ----------------------------------------------------------------- | ---------------------------------------------------- | -------------------- |
| [**createPracticeRole**](RolesApi.md#createpracticeroleoperation) | **POST** /v1/practices/{practiceId}/roles            | Create practice role |
| [**deletePracticeRole**](RolesApi.md#deletepracticerole)          | **DELETE** /v1/practices/{practiceId}/roles/{roleId} | Delete practice role |
| [**listPracticeRoles**](RolesApi.md#listpracticeroles)            | **GET** /v1/practices/{practiceId}/roles             | List practice roles  |
| [**updatePracticeRole**](RolesApi.md#updatepracticeroleoperation) | **PATCH** /v1/practices/{practiceId}/roles/{roleId}  | Update practice role |

## createPracticeRole

> CreatePracticeRoleResponse createPracticeRole(practiceId, idempotencyKey, createPracticeRoleRequest, affinityVersion)

Create practice role

Creates a custom role for a platform-managed practice.

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '@affinity-health/sdk';
import type { CreatePracticeRoleOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new RolesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeRoleRequest
    createPracticeRoleRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePracticeRoleOperationRequest;

  try {
    const data = await api.createPracticeRole(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                          | Type                                                      | Description | Notes                                |
| ----------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                | `string`                                                  |             | [Defaults to `undefined`]            |
| **idempotencyKey**            | `string`                                                  |             | [Defaults to `undefined`]            |
| **createPracticeRoleRequest** | [CreatePracticeRoleRequest](CreatePracticeRoleRequest.md) |             |                                      |
| **affinityVersion**           | `string`                                                  |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticeRoleResponse**](CreatePracticeRoleResponse.md)

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

## deletePracticeRole

> DeletePracticeRoleResponse deletePracticeRole(practiceId, roleId, idempotencyKey, affinityVersion)

Delete practice role

Deletes an unassigned custom role. Protected roles and roles with active assignments cannot be deleted.

### Example

```ts
import { Configuration, RolesApi } from "@affinity-health/sdk";
import type { DeletePracticeRoleRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new RolesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    roleId: roleId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies DeletePracticeRoleRequest;

  try {
    const data = await api.deletePracticeRole(body);
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
| **roleId**          | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**DeletePracticeRoleResponse**](DeletePracticeRoleResponse.md)

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

## listPracticeRoles

> ListPracticeRolesResponse listPracticeRoles(practiceId, affinityVersion)

List practice roles

Lists roles available for a platform-managed practice.

### Example

```ts
import { Configuration, RolesApi } from "@affinity-health/sdk";
import type { ListPracticeRolesRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new RolesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeRolesRequest;

  try {
    const data = await api.listPracticeRoles(body);
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

[**ListPracticeRolesResponse**](ListPracticeRolesResponse.md)

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

## updatePracticeRole

> UpdatePracticeRoleResponse updatePracticeRole(practiceId, roleId, idempotencyKey, updatePracticeRoleRequest, affinityVersion)

Update practice role

Updates a custom role for a platform-managed practice.

### Example

```ts
import {
  Configuration,
  RolesApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeRoleOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new RolesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    roleId: roleId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeRoleRequest
    updatePracticeRoleRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeRoleOperationRequest;

  try {
    const data = await api.updatePracticeRole(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                          | Type                                                      | Description | Notes                                |
| ----------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                | `string`                                                  |             | [Defaults to `undefined`]            |
| **roleId**                    | `string`                                                  |             | [Defaults to `undefined`]            |
| **idempotencyKey**            | `string`                                                  |             | [Defaults to `undefined`]            |
| **updatePracticeRoleRequest** | [UpdatePracticeRoleRequest](UpdatePracticeRoleRequest.md) |             |                                      |
| **affinityVersion**           | `string`                                                  |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeRoleResponse**](UpdatePracticeRoleResponse.md)

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
