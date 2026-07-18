# PracticesApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPractice**](PracticesApi.md#createpracticeoperation) | **POST** /v1/practices | Create practice |
| [**getPractice**](PracticesApi.md#getpractice) | **GET** /v1/practices/{practiceId} | Read practice |
| [**listPractices**](PracticesApi.md#listpractices) | **GET** /v1/practices | List practices |
| [**updatePractice**](PracticesApi.md#updatepracticeoperation) | **PATCH** /v1/practices/{practiceId} | Update practice |



## createPractice

> CreatePractice200Response createPractice(idempotencyKey, createPracticeRequest)

Create practice

Creates a platform-owned practice. Send Idempotency-Key to safely retry network failures.

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeRequest
    createPracticeRequest: {"address":{"city":"Los Angeles","country":"US","line1":"100 Practice Way","line2":null,"postalCode":"90001","state":"CA"},"attestations":{"authorizedPracticeRelationship":true,"authorizedPhiTransfer":true,"minimumNecessaryPhi":true,"providerDataAccuracy":true},"complianceContact":null,"externalId":"practice_123","legalName":"Example Medical Group PLLC","metadata":{},"name":"Example Medical Group","prescribers":[{"credentials":"MD","licenseStates":["CA"],"name":"Alex Morgan","npi":"1234567893"}],"primaryContact":{"email":"operations@example-practice.com","name":"Jordan Lee","phone":null},"supportEmail":"support@example-practice.com","supportPhone":null,"timezone":"America/Los_Angeles"},
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **createPracticeRequest** | [CreatePracticeRequest](CreatePracticeRequest.md) |  | |

### Return type

[**CreatePractice200Response**](CreatePractice200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Bad request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not found |  -  |
| **409** | Conflict |  -  |
| **410** | Gone |  -  |
| **413** | Payload too large |  -  |
| **422** | Unprocessable entity |  -  |
| **429** | Too many requests |  -  |
| **500** | Internal server error |  -  |
| **501** | Not implemented |  -  |
| **502** | Bad gateway |  -  |
| **503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPractice

> CreatePractice200Response getPractice(practiceId)

Read practice

Reads a platform-owned practice by id.

### Example

```ts
import {
  Configuration,
  PracticesApi,
} from '@affinity-health/sdk';
import type { GetPracticeRequest } from '@affinity-health/sdk';

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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **practiceId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**CreatePractice200Response**](CreatePractice200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Bad request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not found |  -  |
| **409** | Conflict |  -  |
| **410** | Gone |  -  |
| **413** | Payload too large |  -  |
| **422** | Unprocessable entity |  -  |
| **429** | Too many requests |  -  |
| **500** | Internal server error |  -  |
| **501** | Not implemented |  -  |
| **502** | Bad gateway |  -  |
| **503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPractices

> ListPractices200Response listPractices(limit)

List practices

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
    // number (optional)
    limit: 56,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` |  | [Optional] [Defaults to `25`] |

### Return type

[**ListPractices200Response**](ListPractices200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Bad request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not found |  -  |
| **409** | Conflict |  -  |
| **410** | Gone |  -  |
| **413** | Payload too large |  -  |
| **422** | Unprocessable entity |  -  |
| **429** | Too many requests |  -  |
| **500** | Internal server error |  -  |
| **501** | Not implemented |  -  |
| **502** | Bad gateway |  -  |
| **503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePractice

> CreatePractice200Response updatePractice(practiceId, idempotencyKey, updatePracticeRequest)

Update practice

Updates a platform-owned practice. Send Idempotency-Key for safe retries.

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeRequest
    updatePracticeRequest: ...,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **practiceId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **updatePracticeRequest** | [UpdatePracticeRequest](UpdatePracticeRequest.md) |  | |

### Return type

[**CreatePractice200Response**](CreatePractice200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Bad request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not found |  -  |
| **409** | Conflict |  -  |
| **410** | Gone |  -  |
| **413** | Payload too large |  -  |
| **422** | Unprocessable entity |  -  |
| **429** | Too many requests |  -  |
| **500** | Internal server error |  -  |
| **501** | Not implemented |  -  |
| **502** | Bad gateway |  -  |
| **503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

