# LocationsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                        | HTTP request                                                       | Description      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------- |
| [**archivePracticeLocation**](LocationsApi.md#archivepracticelocation)        | **POST** /v1/practices/{practiceId}/locations/{locationId}/archive | Archive location |
| [**createPracticeLocation**](LocationsApi.md#createpracticelocationoperation) | **POST** /v1/practices/{practiceId}/locations                      | Create location  |
| [**getPracticeLocation**](LocationsApi.md#getpracticelocation)                | **GET** /v1/practices/{practiceId}/locations/{locationId}          | Read location    |
| [**listPracticeLocations**](LocationsApi.md#listpracticelocations)            | **GET** /v1/practices/{practiceId}/locations                       | List locations   |
| [**updatePracticeLocation**](LocationsApi.md#updatepracticelocationoperation) | **PATCH** /v1/practices/{practiceId}/locations/{locationId}        | Update location  |

## archivePracticeLocation

> ArchivePracticeLocationResponse archivePracticeLocation(practiceId, locationId, idempotencyKey, affinityVersion)

Archive location

Requires locations:write and Idempotency-Key for API keys. Retains the location and historical associations. Archived locations cannot receive new Team assignments. Repeating archive returns the archived location. Changes apply to both Test and Live.

### Example

```ts
import { Configuration, LocationsApi } from "@affinity-health/sdk";
import type { ArchivePracticeLocationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new LocationsApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    locationId: loc_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ArchivePracticeLocationRequest;

  try {
    const data = await api.archivePracticeLocation(body);
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
| **locationId**      | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ArchivePracticeLocationResponse**](ArchivePracticeLocationResponse.md)

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

## createPracticeLocation

> CreatePracticeLocationResponse createPracticeLocation(practiceId, idempotencyKey, createPracticeLocationRequest, affinityVersion)

Create location

Requires locations:write and Idempotency-Key for API keys. Creates an active location with a unique name in this practice. Locations are shared between Test and Live. Use the returned ID for Team location access.

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '@affinity-health/sdk';
import type { CreatePracticeLocationOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new LocationsApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticeLocationRequest
    createPracticeLocationRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePracticeLocationOperationRequest;

  try {
    const data = await api.createPracticeLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                              | Type                                                              | Description | Notes                                |
| --------------------------------- | ----------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                    | `string`                                                          |             | [Defaults to `undefined`]            |
| **idempotencyKey**                | `string`                                                          |             | [Defaults to `undefined`]            |
| **createPracticeLocationRequest** | [CreatePracticeLocationRequest](CreatePracticeLocationRequest.md) |             |                                      |
| **affinityVersion**               | `string`                                                          |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticeLocationResponse**](CreatePracticeLocationResponse.md)

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

## getPracticeLocation

> GetPracticeLocationResponse getPracticeLocation(practiceId, locationId, affinityVersion)

Read location

Requires locations:read. Returns one active or archived location in the authorized practice.

### Example

```ts
import { Configuration, LocationsApi } from "@affinity-health/sdk";
import type { GetPracticeLocationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new LocationsApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    locationId: loc_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticeLocationRequest;

  try {
    const data = await api.getPracticeLocation(body);
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
| **locationId**      | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticeLocationResponse**](GetPracticeLocationResponse.md)

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

## listPracticeLocations

> ListPracticeLocationsResponse listPracticeLocations(practiceId, limit, startingAfter, endingBefore, status, affinityVersion)

List locations

Requires locations:read on a practice key or an authorized platform key. Lists active and archived locations by name, with cursor pagination. Use status to filter. Location records are shared between Test and Live for the same practice.

### Example

```ts
import { Configuration, LocationsApi } from "@affinity-health/sdk";
import type { ListPracticeLocationsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new LocationsApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: loc_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    endingBefore: loc_01j2y8m6jcc9tt24af5pw9x1bc,
    // 'active' | 'archived' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPracticeLocationsRequest;

  try {
    const data = await api.listPracticeLocations(body);
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
| **status**          | `active`, `archived` |             | [Optional] [Defaults to `undefined`] [Enum: active, archived] |
| **affinityVersion** | `string`             |             | [Optional] [Defaults to `undefined`]                          |

### Return type

[**ListPracticeLocationsResponse**](ListPracticeLocationsResponse.md)

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

## updatePracticeLocation

> UpdatePracticeLocationResponse updatePracticeLocation(practiceId, locationId, idempotencyKey, updatePracticeLocationRequest, affinityVersion)

Update location

Requires locations:write and Idempotency-Key for API keys. Updates only supplied fields; null clears optional contact and address fields. Archived locations cannot be updated. Changes apply to both Test and Live.

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '@affinity-health/sdk';
import type { UpdatePracticeLocationOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new LocationsApi(config);

  const body = {
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    locationId: loc_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePracticeLocationRequest
    updatePracticeLocationRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdatePracticeLocationOperationRequest;

  try {
    const data = await api.updatePracticeLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                              | Type                                                              | Description | Notes                                |
| --------------------------------- | ----------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                    | `string`                                                          |             | [Defaults to `undefined`]            |
| **locationId**                    | `string`                                                          |             | [Defaults to `undefined`]            |
| **idempotencyKey**                | `string`                                                          |             | [Defaults to `undefined`]            |
| **updatePracticeLocationRequest** | [UpdatePracticeLocationRequest](UpdatePracticeLocationRequest.md) |             |                                      |
| **affinityVersion**               | `string`                                                          |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePracticeLocationResponse**](UpdatePracticeLocationResponse.md)

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
