# PlatformOrdersApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                       | HTTP request                         | Description          |
| ------------------------------------------------------------ | ------------------------------------ | -------------------- |
| [**cancelOrder**](PlatformOrdersApi.md#cancelorderoperation) | **POST** /v1/orders/{orderId}/cancel | Cancel order         |
| [**createOrder**](PlatformOrdersApi.md#createorderoperation) | **POST** /v1/orders                  | Create patient order |
| [**getOrder**](PlatformOrdersApi.md#getorder)                | **GET** /v1/orders/{orderId}         | Read order           |
| [**listOrderEvents**](PlatformOrdersApi.md#listorderevents)  | **GET** /v1/orders/{orderId}/events  | List order events    |
| [**listOrders**](PlatformOrdersApi.md#listorders)            | **GET** /v1/orders                   | List platform orders |

## cancelOrder

> CancelOrderResponse cancelOrder(orderId, affinityActorId, affinityActorType, cancelOrderRequest, idempotencyKey, affinityVersion)

Cancel order

Cancels an order before shipment. To correct an order, cancel it and create a replacement.

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { CancelOrderOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformOrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // CancelOrderRequest
    cancelOrderRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies CancelOrderOperationRequest;

  try {
    const data = await api.cancelOrder(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                   | Type                                        | Description                                                                                                                  | Notes                                          |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **orderId**            | `string`                                    |                                                                                                                              | [Defaults to `undefined`]                      |
| **affinityActorId**    | `string`                                    | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                      |
| **affinityActorType**  | `user`, `system`                            | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system] |
| **cancelOrderRequest** | [CancelOrderRequest](CancelOrderRequest.md) |                                                                                                                              |                                                |
| **idempotencyKey**     | `string`                                    | Unique operation key required for every mutation.                                                                            | [Optional] [Defaults to `undefined`]           |
| **affinityVersion**    | `string`                                    | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]           |

### Return type

[**CancelOrderResponse**](CancelOrderResponse.md)

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

## createOrder

> CreateOrderResponse createOrder(affinityActorId, affinityActorType, createOrderRequest, idempotencyKey, affinityVersion)

Create patient order

Creates one patient order containing one or more unsigned prescription drafts. A platform API key cannot sign them; create a provider-bound order signing session next. Idempotency-Key and actor context are required.

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { CreateOrderOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformOrdersApi(config);

  const body = {
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // CreateOrderRequest
    createOrderRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies CreateOrderOperationRequest;

  try {
    const data = await api.createOrder(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                   | Type                                        | Description                                                                                                                  | Notes                                          |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **affinityActorId**    | `string`                                    | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                      |
| **affinityActorType**  | `user`, `system`                            | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system] |
| **createOrderRequest** | [CreateOrderRequest](CreateOrderRequest.md) |                                                                                                                              |                                                |
| **idempotencyKey**     | `string`                                    | Unique operation key required for every mutation.                                                                            | [Optional] [Defaults to `undefined`]           |
| **affinityVersion**    | `string`                                    | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]           |

### Return type

[**CreateOrderResponse**](CreateOrderResponse.md)

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

## getOrder

> GetOrderResponse getOrder(orderId, affinityActorId, affinityActorType, affinityVersion)

Read order

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { GetOrderRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformOrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies GetOrderRequest;

  try {
    const data = await api.getOrder(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type             | Description                                                                                                                  | Notes                                          |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **orderId**           | `string`         |                                                                                                                              | [Defaults to `undefined`]                      |
| **affinityActorId**   | `string`         | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                      |
| **affinityActorType** | `user`, `system` | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system] |
| **affinityVersion**   | `string`         | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]           |

### Return type

[**GetOrderResponse**](GetOrderResponse.md)

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

## listOrderEvents

> ListOrderEventsResponse listOrderEvents(orderId, affinityActorId, affinityActorType, limit, startingAfter, endingBefore, affinityVersion)

List order events

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { ListOrderEventsRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformOrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies ListOrderEventsRequest;

  try {
    const data = await api.listOrderEvents(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type             | Description                                                                                                                  | Notes                                          |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **orderId**           | `string`         |                                                                                                                              | [Defaults to `undefined`]                      |
| **affinityActorId**   | `string`         | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                      |
| **affinityActorType** | `user`, `system` | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system] |
| **limit**             | `number`         |                                                                                                                              | [Optional] [Defaults to `25`]                  |
| **startingAfter**     | `string`         |                                                                                                                              | [Optional] [Defaults to `undefined`]           |
| **endingBefore**      | `string`         |                                                                                                                              | [Optional] [Defaults to `undefined`]           |
| **affinityVersion**   | `string`         | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]           |

### Return type

[**ListOrderEventsResponse**](ListOrderEventsResponse.md)

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

## listOrders

> ListOrdersResponse listOrders(affinityActorId, affinityActorType, patientExternalId, limit, startingAfter, endingBefore, externalOrderId, practiceId, status, affinityVersion)

List platform orders

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { ListOrdersRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformOrdersApi(config);

  const body = {
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // string (optional)
    patientExternalId: patientExternalId_example,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // string (optional)
    externalOrderId: externalOrderId_example,
    // string (optional)
    practiceId: practiceId_example,
    // 'blocked' | 'cancelled' | 'delivered' | 'draft' | 'partially_submitted' | 'processing' | 'ready' | 'requires_provider_signature' | 'shipped' | 'submitted' (optional)
    status: status_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies ListOrdersRequest;

  try {
    const data = await api.listOrders(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type                                                                                                                                              | Description                                                                                                                  | Notes                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **affinityActorId**   | `string`                                                                                                                                          | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                                                                                                                                                  |
| **affinityActorType** | `user`, `system`                                                                                                                                  | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system]                                                                                                                             |
| **patientExternalId** | `string`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **limit**             | `number`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `100`]                                                                                                                                             |
| **startingAfter**     | `string`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **endingBefore**      | `string`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **externalOrderId**   | `string`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **practiceId**        | `string`                                                                                                                                          |                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **status**            | `blocked`, `cancelled`, `delivered`, `draft`, `partially_submitted`, `processing`, `ready`, `requires_provider_signature`, `shipped`, `submitted` |                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: blocked, cancelled, delivered, draft, partially_submitted, processing, ready, requires_provider_signature, shipped, submitted] |
| **affinityVersion**   | `string`                                                                                                                                          | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]                                                                                                                                       |

### Return type

[**ListOrdersResponse**](ListOrdersResponse.md)

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
