# ProviderMappingsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                             | HTTP request                                        | Description             |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------- |
| [**createProviderMapping**](ProviderMappingsApi.md#createprovidermappingoperation) | **POST** /v1/provider-mappings                      | Create provider mapping |
| [**getProviderMapping**](ProviderMappingsApi.md#getprovidermapping)                | **GET** /v1/provider-mappings/{providerMappingId}   | Read provider mapping   |
| [**listProviderMappings**](ProviderMappingsApi.md#listprovidermappings)            | **GET** /v1/provider-mappings                       | List provider mappings  |
| [**updateProviderMapping**](ProviderMappingsApi.md#updateprovidermappingoperation) | **PATCH** /v1/provider-mappings/{providerMappingId} | Revoke provider mapping |

## createProviderMapping

> CreateProviderMappingResponse createProviderMapping(idempotencyKey, createProviderMappingRequest, affinityVersion)

Create provider mapping

Links your platform\&#39;s provider identity to a clinician in Affinity. Store the returned pmap\_ ID and use it as providerMappingId for component or hosted sessions. Creating a mapping does not assert prescribing authority.

### Example

```ts
import {
  Configuration,
  ProviderMappingsApi,
} from '@affinity-health/sdk';
import type { CreateProviderMappingOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new ProviderMappingsApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateProviderMappingRequest
    createProviderMappingRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateProviderMappingOperationRequest;

  try {
    const data = await api.createProviderMapping(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                             | Type                                                            | Description | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | ----------- | ------------------------------------ |
| **idempotencyKey**               | `string`                                                        |             | [Defaults to `undefined`]            |
| **createProviderMappingRequest** | [CreateProviderMappingRequest](CreateProviderMappingRequest.md) |             |                                      |
| **affinityVersion**              | `string`                                                        |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateProviderMappingResponse**](CreateProviderMappingResponse.md)

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

## getProviderMapping

> GetProviderMappingResponse getProviderMapping(providerMappingId, affinityVersion)

Read provider mapping

Returns the provider mapping and its current verification state. Use the mapping\&#39;s pmap\_ ID when you create component or hosted sessions.

### Example

```ts
import { Configuration, ProviderMappingsApi } from "@affinity-health/sdk";
import type { GetProviderMappingRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new ProviderMappingsApi(config);

  const body = {
    // string
    providerMappingId: providerMappingId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetProviderMappingRequest;

  try {
    const data = await api.getProviderMapping(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **providerMappingId** | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetProviderMappingResponse**](GetProviderMappingResponse.md)

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

## listProviderMappings

> ListProviderMappingsResponse listProviderMappings(endingBefore, externalId, limit, practiceId, startingAfter, status, affinityVersion)

List provider mappings

Lists the platform\&#39;s provider-to-Affinity identity mappings in the current Test or Live mode.

### Example

```ts
import {
  Configuration,
  ProviderMappingsApi,
} from '@affinity-health/sdk';
import type { ListProviderMappingsRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new ProviderMappingsApi(config);

  const body = {
    // string (optional)
    endingBefore: endingBefore_example,
    // string (optional)
    externalId: externalId_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    practiceId: practiceId_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // 'pending' | 'verified' | 'revoked' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListProviderMappingsRequest;

  try {
    const data = await api.listProviderMappings(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                             | Description | Notes                                                                   |
| ------------------- | -------------------------------- | ----------- | ----------------------------------------------------------------------- |
| **endingBefore**    | `string`                         |             | [Optional] [Defaults to `undefined`]                                    |
| **externalId**      | `string`                         |             | [Optional] [Defaults to `undefined`]                                    |
| **limit**           | [](.md)                          |             | [Optional] [Defaults to `undefined`]                                    |
| **practiceId**      | `string`                         |             | [Optional] [Defaults to `undefined`]                                    |
| **startingAfter**   | `string`                         |             | [Optional] [Defaults to `undefined`]                                    |
| **status**          | `pending`, `verified`, `revoked` |             | [Optional] [Defaults to `undefined`] [Enum: pending, verified, revoked] |
| **affinityVersion** | `string`                         |             | [Optional] [Defaults to `undefined`]                                    |

### Return type

[**ListProviderMappingsResponse**](ListProviderMappingsResponse.md)

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

## updateProviderMapping

> UpdateProviderMappingResponse updateProviderMapping(providerMappingId, idempotencyKey, updateProviderMappingRequest, affinityVersion)

Revoke provider mapping

Revokes a provider mapping and every component, hosted, and delegated session issued through it.

### Example

```ts
import {
  Configuration,
  ProviderMappingsApi,
} from '@affinity-health/sdk';
import type { UpdateProviderMappingOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new ProviderMappingsApi(config);

  const body = {
    // string
    providerMappingId: providerMappingId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateProviderMappingRequest
    updateProviderMappingRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdateProviderMappingOperationRequest;

  try {
    const data = await api.updateProviderMapping(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                             | Type                                                            | Description | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | ----------- | ------------------------------------ |
| **providerMappingId**            | `string`                                                        |             | [Defaults to `undefined`]            |
| **idempotencyKey**               | `string`                                                        |             | [Defaults to `undefined`]            |
| **updateProviderMappingRequest** | [UpdateProviderMappingRequest](UpdateProviderMappingRequest.md) |             |                                      |
| **affinityVersion**              | `string`                                                        |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateProviderMappingResponse**](UpdateProviderMappingResponse.md)

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
