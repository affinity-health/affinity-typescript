# PracticesApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                        | HTTP request                         | Description     |
| ------------------------------------------------------------- | ------------------------------------ | --------------- |
| [**createPractice**](PracticesApi.md#createpracticeoperation) | **POST** /v1/practices               | Create practice |
| [**getPractice**](PracticesApi.md#getpractice)                | **GET** /v1/practices/{practiceId}   | Read practice   |
| [**listPractices**](PracticesApi.md#listpractices)            | **GET** /v1/practices                | List practices  |
| [**updatePractice**](PracticesApi.md#updatepracticeoperation) | **PATCH** /v1/practices/{practiceId} | Update practice |

## createPractice

> CreatePracticeResponse createPractice(idempotencyKey, createPracticeRequest, affinityVersion)

Create practice

Creates a practice for the platform. Send Idempotency-Key when you retry the same request.

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
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeRequest
    createPracticeRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
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
| **idempotencyKey**        | `string`                                          |             | [Defaults to `undefined`]            |
| **createPracticeRequest** | [CreatePracticeRequest](CreatePracticeRequest.md) |             |                                      |
| **affinityVersion**       | `string`                                          |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPractices

> ListPracticesResponse listPractices(endingBefore, limit, startingAfter, affinityVersion)

List practices

Returns the practices that belong to the platform. The default Affinity-Version is 2026-07-29.

### Example

```ts
import {
  Configuration,
  PracticesApi,
} from '@affinity-health/sdk';
import type { ListPracticesRequest } from '@affinity-health/sdk';

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
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    startingAfter: startingAfter_example,
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
| **endingBefore**    | `string` |             | [Optional] [Defaults to `undefined`] |
| **limit**           | [](.md)  |             | [Optional] [Defaults to `undefined`] |
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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePractice

> UpdatePracticeResponse updatePractice(practiceId, idempotencyKey, updatePracticeRequest, affinityVersion)

Update practice

Updates one practice that belongs to the platform. Send Idempotency-Key when you retry the same request.

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
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeRequest
    updatePracticeRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
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
| **idempotencyKey**        | `string`                                          |             | [Defaults to `undefined`]            |
| **updatePracticeRequest** | [UpdatePracticeRequest](UpdatePracticeRequest.md) |             |                                      |
| **affinityVersion**       | `string`                                          |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
