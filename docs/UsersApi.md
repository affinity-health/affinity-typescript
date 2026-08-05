# UsersApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                            | HTTP request                 | Description |
| ------------------------------------------------- | ---------------------------- | ----------- |
| [**createUser**](UsersApi.md#createuseroperation) | **POST** /v1/users           | Create user |
| [**getUser**](UsersApi.md#getuser)                | **GET** /v1/users/{userId}   | Read user   |
| [**listUsers**](UsersApi.md#listusers)            | **GET** /v1/users            | List users  |
| [**updateUser**](UsersApi.md#updateuseroperation) | **PATCH** /v1/users/{userId} | Update user |

## createUser

> CreateUserResponse createUser(idempotencyKey, createUserRequest, affinityVersion)

Create user

Creates or returns a user by the platform\&#39;s stable external ID. Idempotency-Key is required.

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '@affinity-health/sdk';
import type { CreateUserOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateUserRequest
    createUserRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateUserOperationRequest;

  try {
    const data = await api.createUser(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type                                      | Description | Notes                                |
| --------------------- | ----------------------------------------- | ----------- | ------------------------------------ |
| **idempotencyKey**    | `string`                                  |             | [Defaults to `undefined`]            |
| **createUserRequest** | [CreateUserRequest](CreateUserRequest.md) |             |                                      |
| **affinityVersion**   | `string`                                  |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateUserResponse**](CreateUserResponse.md)

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

## getUser

> GetUserResponse getUser(userId, affinityVersion)

Read user

Returns one platform-owned user in the current mode.

### Example

```ts
import { Configuration, UsersApi } from "@affinity-health/sdk";
import type { GetUserRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    userId: userId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetUserRequest;

  try {
    const data = await api.getUser(body);
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
| **userId**          | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetUserResponse**](GetUserResponse.md)

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

## listUsers

> ListUsersResponse listUsers(limit, affinityVersion)

List users

Lists platform-owned user records in the current Test or Live mode.

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '@affinity-health/sdk';
import type { ListUsersRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new UsersApi(config);

  const body = {
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListUsersRequest;

  try {
    const data = await api.listUsers(body);
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
| **limit**           | [](.md)  |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListUsersResponse**](ListUsersResponse.md)

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

## updateUser

> UpdateUserResponse updateUser(userId, idempotencyKey, updateUserRequest, affinityVersion)

Update user

Updates or deactivates a platform-owned user. Deactivation revokes grants and launch sessions, not the user\&#39;s independent Affinity account.

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '@affinity-health/sdk';
import type { UpdateUserOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new UsersApi(config);

  const body = {
    // string
    userId: userId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateUserRequest
    updateUserRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdateUserOperationRequest;

  try {
    const data = await api.updateUser(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type                                      | Description | Notes                                |
| --------------------- | ----------------------------------------- | ----------- | ------------------------------------ |
| **userId**            | `string`                                  |             | [Defaults to `undefined`]            |
| **idempotencyKey**    | `string`                                  |             | [Defaults to `undefined`]            |
| **updateUserRequest** | [UpdateUserRequest](UpdateUserRequest.md) |             |                                      |
| **affinityVersion**   | `string`                                  |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateUserResponse**](UpdateUserResponse.md)

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
