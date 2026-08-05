# PlatformWebhooksApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                | HTTP request                                              | Description                   |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------- |
| [**createWebhookEndpoint**](PlatformWebhooksApi.md#createwebhookendpointoperation)    | **POST** /v1/webhook-endpoints                            | Create webhook endpoint       |
| [**deleteWebhookEndpoint**](PlatformWebhooksApi.md#deletewebhookendpoint)             | **DELETE** /v1/webhook-endpoints/{endpointId}             | Disable webhook endpoint      |
| [**getWebhookEvent**](PlatformWebhooksApi.md#getwebhookevent)                         | **GET** /v1/webhook-events/{eventId}                      | Read webhook event attempts   |
| [**listWebhookEndpoints**](PlatformWebhooksApi.md#listwebhookendpoints)               | **GET** /v1/webhook-endpoints                             | List webhook endpoints        |
| [**listWebhookEvents**](PlatformWebhooksApi.md#listwebhookevents)                     | **GET** /v1/webhook-events                                | List webhook events           |
| [**replayWebhookEvent**](PlatformWebhooksApi.md#replaywebhookevent)                   | **POST** /v1/webhook-events/{eventId}/replay              | Replay webhook event          |
| [**rotateWebhookEndpointSecret**](PlatformWebhooksApi.md#rotatewebhookendpointsecret) | **POST** /v1/webhook-endpoints/{endpointId}/rotate-secret | Rotate webhook signing secret |
| [**updateWebhookEndpoint**](PlatformWebhooksApi.md#updatewebhookendpointoperation)    | **PATCH** /v1/webhook-endpoints/{endpointId}              | Update webhook endpoint       |

## createWebhookEndpoint

> CreateWebhookEndpointResponse createWebhookEndpoint(idempotencyKey, createWebhookEndpointRequest, affinityVersion)

Create webhook endpoint

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { CreateWebhookEndpointOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateWebhookEndpointRequest
    createWebhookEndpointRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateWebhookEndpointOperationRequest;

  try {
    const data = await api.createWebhookEndpoint(body);
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
| **createWebhookEndpointRequest** | [CreateWebhookEndpointRequest](CreateWebhookEndpointRequest.md) |             |                                      |
| **affinityVersion**              | `string`                                                        |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateWebhookEndpointResponse**](CreateWebhookEndpointResponse.md)

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

## deleteWebhookEndpoint

> DeleteWebhookEndpointResponse deleteWebhookEndpoint(endpointId, idempotencyKey, affinityVersion)

Disable webhook endpoint

### Example

```ts
import { Configuration, PlatformWebhooksApi } from "@affinity-health/sdk";
import type { DeleteWebhookEndpointRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies DeleteWebhookEndpointRequest;

  try {
    const data = await api.deleteWebhookEndpoint(body);
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
| **endpointId**      | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**DeleteWebhookEndpointResponse**](DeleteWebhookEndpointResponse.md)

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

## getWebhookEvent

> GetWebhookEventResponse getWebhookEvent(eventId, affinityVersion)

Read webhook event attempts

### Example

```ts
import { Configuration, PlatformWebhooksApi } from "@affinity-health/sdk";
import type { GetWebhookEventRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    eventId: eventId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetWebhookEventRequest;

  try {
    const data = await api.getWebhookEvent(body);
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
| **eventId**         | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetWebhookEventResponse**](GetWebhookEventResponse.md)

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

## listWebhookEndpoints

> ListWebhookEndpointsResponse listWebhookEndpoints(endingBefore, limit, startingAfter, affinityVersion)

List webhook endpoints

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { ListWebhookEndpointsRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string (optional)
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListWebhookEndpointsRequest;

  try {
    const data = await api.listWebhookEndpoints(body);
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

[**ListWebhookEndpointsResponse**](ListWebhookEndpointsResponse.md)

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

## listWebhookEvents

> ListWebhookEventsResponse listWebhookEvents(endingBefore, limit, status, startingAfter, affinityVersion)

List webhook events

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { ListWebhookEventsRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string (optional)
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // 'all' | 'delivered' | 'failed' | 'pending' (optional)
    status: status_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListWebhookEventsRequest;

  try {
    const data = await api.listWebhookEvents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type                                    | Description | Notes                                                                        |
| ------------------- | --------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| **endingBefore**    | `string`                                |             | [Optional] [Defaults to `undefined`]                                         |
| **limit**           | [](.md)                                 |             | [Optional] [Defaults to `undefined`]                                         |
| **status**          | `all`, `delivered`, `failed`, `pending` |             | [Optional] [Defaults to `undefined`] [Enum: all, delivered, failed, pending] |
| **startingAfter**   | `string`                                |             | [Optional] [Defaults to `undefined`]                                         |
| **affinityVersion** | `string`                                |             | [Optional] [Defaults to `undefined`]                                         |

### Return type

[**ListWebhookEventsResponse**](ListWebhookEventsResponse.md)

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

## replayWebhookEvent

> ReplayWebhookEventResponse replayWebhookEvent(eventId, idempotencyKey, affinityVersion)

Replay webhook event

### Example

```ts
import { Configuration, PlatformWebhooksApi } from "@affinity-health/sdk";
import type { ReplayWebhookEventRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    eventId: eventId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ReplayWebhookEventRequest;

  try {
    const data = await api.replayWebhookEvent(body);
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
| **eventId**         | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ReplayWebhookEventResponse**](ReplayWebhookEventResponse.md)

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

## rotateWebhookEndpointSecret

> RotateWebhookEndpointSecretResponse rotateWebhookEndpointSecret(endpointId, idempotencyKey, affinityVersion)

Rotate webhook signing secret

### Example

```ts
import { Configuration, PlatformWebhooksApi } from "@affinity-health/sdk";
import type { RotateWebhookEndpointSecretRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RotateWebhookEndpointSecretRequest;

  try {
    const data = await api.rotateWebhookEndpointSecret(body);
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
| **endpointId**      | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RotateWebhookEndpointSecretResponse**](RotateWebhookEndpointSecretResponse.md)

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

## updateWebhookEndpoint

> UpdateWebhookEndpointResponse updateWebhookEndpoint(endpointId, idempotencyKey, updateWebhookEndpointRequest, affinityVersion)

Update webhook endpoint

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { UpdateWebhookEndpointOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformWebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateWebhookEndpointRequest
    updateWebhookEndpointRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdateWebhookEndpointOperationRequest;

  try {
    const data = await api.updateWebhookEndpoint(body);
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
| **endpointId**                   | `string`                                                        |             | [Defaults to `undefined`]            |
| **idempotencyKey**               | `string`                                                        |             | [Defaults to `undefined`]            |
| **updateWebhookEndpointRequest** | [UpdateWebhookEndpointRequest](UpdateWebhookEndpointRequest.md) |             |                                      |
| **affinityVersion**              | `string`                                                        |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateWebhookEndpointResponse**](UpdateWebhookEndpointResponse.md)

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
