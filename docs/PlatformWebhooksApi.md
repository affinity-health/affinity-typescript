# PlatformWebhooksApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createWebhookEndpoint**](PlatformWebhooksApi.md#createwebhookendpointoperation) | **POST** /v1/webhook-endpoints | Create webhook endpoint |
| [**deleteWebhookEndpoint**](PlatformWebhooksApi.md#deletewebhookendpoint) | **DELETE** /v1/webhook-endpoints/{endpointId} | Disable webhook endpoint |
| [**getWebhookEvent**](PlatformWebhooksApi.md#getwebhookevent) | **GET** /v1/webhook-events/{eventId} | Read webhook event attempts |
| [**listWebhookEndpoints**](PlatformWebhooksApi.md#listwebhookendpoints) | **GET** /v1/webhook-endpoints | List webhook endpoints |
| [**listWebhookEvents**](PlatformWebhooksApi.md#listwebhookevents) | **GET** /v1/webhook-events | List webhook events |
| [**replayWebhookEvent**](PlatformWebhooksApi.md#replaywebhookevent) | **POST** /v1/webhook-events/{eventId}/replay | Replay webhook event |
| [**rotateWebhookEndpointSecret**](PlatformWebhooksApi.md#rotatewebhookendpointsecret) | **POST** /v1/webhook-endpoints/{endpointId}/rotate-secret | Rotate webhook signing secret |
| [**updateWebhookEndpoint**](PlatformWebhooksApi.md#updatewebhookendpointoperation) | **PATCH** /v1/webhook-endpoints/{endpointId} | Update webhook endpoint |



## createWebhookEndpoint

> CreateWebhookEndpoint200Response createWebhookEndpoint(idempotencyKey, createWebhookEndpointRequest)

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // CreateWebhookEndpointRequest
    createWebhookEndpointRequest: ...,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **createWebhookEndpointRequest** | [CreateWebhookEndpointRequest](CreateWebhookEndpointRequest.md) |  | |

### Return type

[**CreateWebhookEndpoint200Response**](CreateWebhookEndpoint200Response.md)

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


## deleteWebhookEndpoint

> DeleteWebhookEndpoint200Response deleteWebhookEndpoint(endpointId, idempotencyKey)

Disable webhook endpoint

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { DeleteWebhookEndpointRequest } from '@affinity-health/sdk';

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **endpointId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |

### Return type

[**DeleteWebhookEndpoint200Response**](DeleteWebhookEndpoint200Response.md)

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


## getWebhookEvent

> GetWebhookEvent200Response getWebhookEvent(eventId)

Read webhook event attempts

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { GetWebhookEventRequest } from '@affinity-health/sdk';

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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **eventId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**GetWebhookEvent200Response**](GetWebhookEvent200Response.md)

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


## listWebhookEndpoints

> ListWebhookEndpoints200Response listWebhookEndpoints()

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

  try {
    const data = await api.listWebhookEndpoints();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ListWebhookEndpoints200Response**](ListWebhookEndpoints200Response.md)

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


## listWebhookEvents

> ListWebhookEvents200Response listWebhookEvents(limit, status)

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
    // number (optional)
    limit: 56,
    // 'all' | 'delivered' | 'failed' | 'pending' | 'skipped' (optional)
    status: status_example,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` |  | [Optional] [Defaults to `25`] |
| **status** | `all`, `delivered`, `failed`, `pending`, `skipped` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, delivered, failed, pending, skipped] |

### Return type

[**ListWebhookEvents200Response**](ListWebhookEvents200Response.md)

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


## replayWebhookEvent

> ReplayWebhookEvent200Response replayWebhookEvent(eventId, idempotencyKey)

Replay webhook event

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { ReplayWebhookEventRequest } from '@affinity-health/sdk';

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **eventId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |

### Return type

[**ReplayWebhookEvent200Response**](ReplayWebhookEvent200Response.md)

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


## rotateWebhookEndpointSecret

> CreateWebhookEndpoint200Response rotateWebhookEndpointSecret(endpointId, idempotencyKey)

Rotate webhook signing secret

### Example

```ts
import {
  Configuration,
  PlatformWebhooksApi,
} from '@affinity-health/sdk';
import type { RotateWebhookEndpointSecretRequest } from '@affinity-health/sdk';

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **endpointId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |

### Return type

[**CreateWebhookEndpoint200Response**](CreateWebhookEndpoint200Response.md)

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


## updateWebhookEndpoint

> DeleteWebhookEndpoint200Response updateWebhookEndpoint(endpointId, idempotencyKey, updateWebhookEndpointRequest)

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // UpdateWebhookEndpointRequest
    updateWebhookEndpointRequest: ...,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **endpointId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **updateWebhookEndpointRequest** | [UpdateWebhookEndpointRequest](UpdateWebhookEndpointRequest.md) |  | |

### Return type

[**DeleteWebhookEndpoint200Response**](DeleteWebhookEndpoint200Response.md)

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

