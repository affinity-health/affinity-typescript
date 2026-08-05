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

> CancelOrderResponse cancelOrder(orderId, idempotencyKey, cancelOrderRequest, affinityVersion, affinityActorId, affinityActorType)

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
    // string
    idempotencyKey: idempotencyKey_example,
    // CancelOrderRequest
    cancelOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
    affinityActorType: affinityActorType_example,
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

| Name                   | Type                                        | Description | Notes                                |
| ---------------------- | ------------------------------------------- | ----------- | ------------------------------------ |
| **orderId**            | `string`                                    |             | [Defaults to `undefined`]            |
| **idempotencyKey**     | `string`                                    |             | [Defaults to `undefined`]            |
| **cancelOrderRequest** | [CancelOrderRequest](CancelOrderRequest.md) |             |                                      |
| **affinityVersion**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType**  | `string`                                    |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CancelOrderResponse**](CancelOrderResponse.md)

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

## createOrder

> CreateOrderResponse createOrder(idempotencyKey, createOrderRequest, affinityVersion, affinityActorId, affinityActorType)

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
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateOrderRequest
    createOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
    affinityActorType: affinityActorType_example,
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

| Name                   | Type                                        | Description | Notes                                |
| ---------------------- | ------------------------------------------- | ----------- | ------------------------------------ |
| **idempotencyKey**     | `string`                                    |             | [Defaults to `undefined`]            |
| **createOrderRequest** | [CreateOrderRequest](CreateOrderRequest.md) |             |                                      |
| **affinityVersion**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType**  | `string`                                    |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateOrderResponse**](CreateOrderResponse.md)

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

## getOrder

> GetOrderResponse getOrder(orderId, affinityVersion, affinityActorId, affinityActorType)

Read order

### Example

```ts
import { Configuration, PlatformOrdersApi } from "@affinity-health/sdk";
import type { GetOrderRequest } from "@affinity-health/sdk";

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
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
    affinityActorType: affinityActorType_example,
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

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **orderId**           | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetOrderResponse**](GetOrderResponse.md)

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

## listOrderEvents

> ListOrderEventsResponse listOrderEvents(orderId, endingBefore, limit, startingAfter, affinityVersion, affinityActorId, affinityActorType)

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
    // string (optional)
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
    affinityActorType: affinityActorType_example,
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

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **orderId**           | `string` |             | [Defaults to `undefined`]            |
| **endingBefore**      | `string` |             | [Optional] [Defaults to `undefined`] |
| **limit**             | [](.md)  |             | [Optional] [Defaults to `undefined`] |
| **startingAfter**     | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListOrderEventsResponse**](ListOrderEventsResponse.md)

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

## listOrders

> ListOrdersResponse listOrders(endingBefore, limit, patientExternalId, practiceId, startingAfter, status, affinityVersion, affinityActorId, affinityActorType)

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
    // string (optional)
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    patientExternalId: patientExternalId_example,
    // string (optional)
    practiceId: practiceId_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // 'blocked' | 'cancelled' | 'delivered' | 'draft' | 'partially_submitted' | 'processing' | 'ready' | 'requires_provider_signature' | 'shipped' | 'submitted' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
    affinityActorType: affinityActorType_example,
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

| Name                  | Type                                                                                                                                              | Description | Notes                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **endingBefore**      | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **limit**             | [](.md)                                                                                                                                           |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **patientExternalId** | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **practiceId**        | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **startingAfter**     | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **status**            | `blocked`, `cancelled`, `delivered`, `draft`, `partially_submitted`, `processing`, `ready`, `requires_provider_signature`, `shipped`, `submitted` |             | [Optional] [Defaults to `undefined`] [Enum: blocked, cancelled, delivered, draft, partially_submitted, processing, ready, requires_provider_signature, shipped, submitted] |
| **affinityVersion**   | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **affinityActorId**   | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |
| **affinityActorType** | `string`                                                                                                                                          |             | [Optional] [Defaults to `undefined`]                                                                                                                                       |

### Return type

[**ListOrdersResponse**](ListOrdersResponse.md)

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
