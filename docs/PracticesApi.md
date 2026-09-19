# PracticesApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                        | HTTP request                         | Description     |
| ------------------------------------------------------------- | ------------------------------------ | --------------- |
| [**createPractice**](PracticesApi.md#createpracticeoperation) | **POST** /v1/practices               | Create practice |
| [**getPractice**](PracticesApi.md#getpractice)                | **GET** /v1/practices/{practiceId}   | Read practice   |
| [**listPractices**](PracticesApi.md#listpractices)            | **GET** /v1/practices                | List practices  |
| [**updatePractice**](PracticesApi.md#updatepracticeoperation) | **PATCH** /v1/practices/{practiceId} | Update practice |

## createPractice

> CreatePracticeResponse createPractice(createPracticeRequest, affinityVersion, idempotencyKey)

Create practice

Creates a practice owned by the platform. Set liveEnabled to true to enable Live access at creation with an approved platform and a Live request. Defaults to false. Requires practices:write. Send Idempotency-Key when you retry the same request.

### Example

```ts
import {
  Configuration,
  PracticesApi,
} from '@affinity-health/sdk';
import type { CreatePracticeOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PracticesApi(config);

  const body = {
    // CreatePracticeRequest
    createPracticeRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    idempotencyKey: idempotencyKey_example,
  } satisfies CreatePracticeOperationRequest;

  try {
    const data = await api.createPractice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                      | Type                                              | Description | Notes                                |
| ------------------------- | ------------------------------------------------- | ----------- | ------------------------------------ |
| **createPracticeRequest** | [CreatePracticeRequest](CreatePracticeRequest.md) |             |                                      |
| **affinityVersion**       | `string`                                          |             | [Optional] [Defaults to `undefined`] |
| **idempotencyKey**        | `string`                                          |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticeResponse**](CreatePracticeResponse.md)

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
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPractice

> GetPracticeResponse getPractice(practiceId, affinityVersion)

Read practice

Returns one practice that belongs to the platform.

### Example

```ts
import { Configuration, PracticesApi } from "@affinity-health/sdk";
import type { GetPracticeRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PracticesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeRequest;

  try {
    const data = await api.getPractice(body);
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

[**GetPracticeResponse**](GetPracticeResponse.md)

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
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPractices

> ListPracticesResponse listPractices(search, endingBefore, limit, startingAfter, affinityVersion)

List practices

Returns the practices that belong to the platform. The default Affinity-Version is 2026-08-11.

### Example

```ts
import { Configuration, PracticesApi } from "@affinity-health/sdk";
import type { ListPracticesRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PracticesApi(config);

  const body = {
    // string (optional)
    search: search_example,
    // string (optional)
    endingBefore: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticesRequest;

  try {
    const data = await api.listPractices(body);
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
| **search**          | `string` |             | [Optional] [Defaults to `undefined`] |
| **endingBefore**    | `string` |             | [Optional] [Defaults to `undefined`] |
| **limit**           | `number` |             | [Optional] [Defaults to `25`]        |
| **startingAfter**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListPracticesResponse**](ListPracticesResponse.md)

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
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePractice

> UpdatePracticeResponse updatePractice(practiceId, updatePracticeRequest, affinityVersion, idempotencyKey)

Update practice

Updates one practice owned by the platform. Set liveEnabled to true or false to control Live access with an approved platform and a Live request. Affinity Admin decisions take precedence. Requires practices:write. Send Idempotency-Key when you retry the same request.

### Example

```ts
import {
  Configuration,
  PracticesApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PracticesApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // UpdatePracticeRequest
    updatePracticeRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    idempotencyKey: idempotencyKey_example,
  } satisfies UpdatePracticeOperationRequest;

  try {
    const data = await api.updatePractice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                      | Type                                              | Description | Notes                                |
| ------------------------- | ------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**            | `string`                                          |             | [Defaults to `undefined`]            |
| **updatePracticeRequest** | [UpdatePracticeRequest](UpdatePracticeRequest.md) |             |                                      |
| **affinityVersion**       | `string`                                          |             | [Optional] [Defaults to `undefined`] |
| **idempotencyKey**        | `string`                                          |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeResponse**](UpdatePracticeResponse.md)

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
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
