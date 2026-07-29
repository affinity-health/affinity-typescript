# ProviderMappingsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                             | HTTP request                                        | Description             |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------- |
| [**createProviderMapping**](ProviderMappingsApi.md#createprovidermappingoperation) | **POST** /v1/provider-mappings                      | Create provider mapping |
| [**getProviderMapping**](ProviderMappingsApi.md#getprovidermapping)                | **GET** /v1/provider-mappings/{providerMappingId}   | Read provider mapping   |
| [**listProviderMappings**](ProviderMappingsApi.md#listprovidermappings)            | **GET** /v1/provider-mappings                       | List provider mappings  |
| [**updateProviderMapping**](ProviderMappingsApi.md#updateprovidermappingoperation) | **PATCH** /v1/provider-mappings/{providerMappingId} | Revoke provider mapping |

## createProviderMapping

> CreateProviderMappingResponse createProviderMapping(createProviderMappingRequest, idempotencyKey, affinityVersion)

Create provider mapping

Maps the platform\&#39;s provider identity to an independently verified Affinity provider. Creating a mapping does not assert prescribing authority.

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
    // CreateProviderMappingRequest
    createProviderMappingRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
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

| Name                             | Type                                                            | Description                                                                      | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **createProviderMappingRequest** | [CreateProviderMappingRequest](CreateProviderMappingRequest.md) |                                                                                  |                                      |
| **idempotencyKey**               | `string`                                                        | Unique operation key required for every mutation.                                | [Optional] [Defaults to `undefined`] |
| **affinityVersion**              | `string`                                                        | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateProviderMappingResponse**](CreateProviderMappingResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`

### HTTP response details

| Status code | Description           | Response headers                                                                                                              |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **200**     | Successful response   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **400**     | Bad request           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **401**     | Unauthorized          | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **403**     | Forbidden             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **409**     | Conflict              | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **413**     | Payload too large     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **422**     | Unprocessable entity  | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **429**     | Too many requests     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **500**     | Internal server error | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **502**     | Bad gateway           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **503**     | Service unavailable   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getProviderMapping

> GetProviderMappingResponse getProviderMapping(providerMappingId, affinityVersion)

Read provider mapping

Returns the current Affinity verification state for a provider mapping.

### Example

```ts
import {
  Configuration,
  ProviderMappingsApi,
} from '@affinity-health/sdk';
import type { GetProviderMappingRequest } from '@affinity-health/sdk';

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
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
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

| Name                  | Type     | Description                                                                      | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **providerMappingId** | `string` |                                                                                  | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**GetProviderMappingResponse**](GetProviderMappingResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`

### HTTP response details

| Status code | Description           | Response headers                                                                                                              |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **200**     | Successful response   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **400**     | Bad request           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **401**     | Unauthorized          | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **403**     | Forbidden             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **404**     | Not found             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **413**     | Payload too large     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **422**     | Unprocessable entity  | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **429**     | Too many requests     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **500**     | Internal server error | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **502**     | Bad gateway           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **503**     | Service unavailable   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listProviderMappings

> ListProviderMappingsResponse listProviderMappings(externalId, limit, startingAfter, endingBefore, practiceId, status, affinityVersion)

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
    externalId: externalId_example,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // string (optional)
    practiceId: practiceId_example,
    // 'pending' | 'verified' | 'revoked' (optional)
    status: status_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
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

| Name                | Type                             | Description                                                                      | Notes                                                                   |
| ------------------- | -------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **externalId**      | `string`                         |                                                                                  | [Optional] [Defaults to `undefined`]                                    |
| **limit**           | `number`                         |                                                                                  | [Optional] [Defaults to `25`]                                           |
| **startingAfter**   | `string`                         |                                                                                  | [Optional] [Defaults to `undefined`]                                    |
| **endingBefore**    | `string`                         |                                                                                  | [Optional] [Defaults to `undefined`]                                    |
| **practiceId**      | `string`                         |                                                                                  | [Optional] [Defaults to `undefined`]                                    |
| **status**          | `pending`, `verified`, `revoked` |                                                                                  | [Optional] [Defaults to `undefined`] [Enum: pending, verified, revoked] |
| **affinityVersion** | `string`                         | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`]                                    |

### Return type

[**ListProviderMappingsResponse**](ListProviderMappingsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`

### HTTP response details

| Status code | Description           | Response headers                                                                                                              |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **200**     | Successful response   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **400**     | Bad request           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **401**     | Unauthorized          | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **403**     | Forbidden             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **413**     | Payload too large     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **422**     | Unprocessable entity  | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **429**     | Too many requests     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **500**     | Internal server error | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **502**     | Bad gateway           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **503**     | Service unavailable   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updateProviderMapping

> UpdateProviderMappingResponse updateProviderMapping(providerMappingId, updateProviderMappingRequest, idempotencyKey, affinityVersion)

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
    // UpdateProviderMappingRequest
    updateProviderMappingRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
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

| Name                             | Type                                                            | Description                                                                      | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **providerMappingId**            | `string`                                                        |                                                                                  | [Defaults to `undefined`]            |
| **updateProviderMappingRequest** | [UpdateProviderMappingRequest](UpdateProviderMappingRequest.md) |                                                                                  |                                      |
| **idempotencyKey**               | `string`                                                        | Unique operation key required for every mutation.                                | [Optional] [Defaults to `undefined`] |
| **affinityVersion**              | `string`                                                        | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateProviderMappingResponse**](UpdateProviderMappingResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `application/problem+json`

### HTTP response details

| Status code | Description           | Response headers                                                                                                              |
| ----------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **200**     | Successful response   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **400**     | Bad request           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **401**     | Unauthorized          | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **403**     | Forbidden             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **404**     | Not found             | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **409**     | Conflict              | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **413**     | Payload too large     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **422**     | Unprocessable entity  | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **429**     | Too many requests     | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **500**     | Internal server error | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **502**     | Bad gateway           | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |
| **503**     | Service unavailable   | _ Affinity-Version - <br> _ RateLimit-Limit - <br> _ RateLimit-Remaining - <br> _ RateLimit-Reset - <br> \* Request-Id - <br> |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
