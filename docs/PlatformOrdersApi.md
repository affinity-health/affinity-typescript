# PlatformOrdersApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**cancelOrder**](PlatformOrdersApi.md#cancelorderoperation) | **POST** /v1/orders/{orderId}/cancel | Cancel order |
| [**createOrder**](PlatformOrdersApi.md#createorderoperation) | **POST** /v1/orders | Create order |
| [**getOrder**](PlatformOrdersApi.md#getorder) | **GET** /v1/orders/{orderId} | Read order |
| [**listOrderEvents**](PlatformOrdersApi.md#listorderevents) | **GET** /v1/orders/{orderId}/events | List order events |
| [**listOrders**](PlatformOrdersApi.md#listorders) | **GET** /v1/orders | List platform orders |
| [**submitOrder**](PlatformOrdersApi.md#submitorder) | **POST** /v1/orders/{orderId}/submit | Submit order |
| [**updateOrder**](PlatformOrdersApi.md#updateorderoperation) | **PATCH** /v1/orders/{orderId} | Update draft order |



## cancelOrder

> CreateOrder200Response cancelOrder(orderId, idempotencyKey, cancelOrderRequest)

Cancel order

Cancels an order before shipment. Corrections use cancel-and-replace.

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // CancelOrderRequest
    cancelOrderRequest: ...,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **orderId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **cancelOrderRequest** | [CancelOrderRequest](CancelOrderRequest.md) |  | |

### Return type

[**CreateOrder200Response**](CreateOrder200Response.md)

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


## createOrder

> CreateOrder200Response createOrder(idempotencyKey, createOrderRequest)

Create order

Creates an editable synthetic draft in test mode or releases an existing signed immutable prescription version in live mode.

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // CreateOrderRequest
    createOrderRequest: {"catalogItemId":"catalog_item_123","practiceId":"3f4bd943-a34d-4d4c-aa41-00556569a71d","directions":"Inject 0.25 mL subcutaneously once weekly.","externalOrderId":"order_123","patient":{"address":{"city":"Los Angeles","country":"US","line1":"100 Main Street","line2":null,"postalCode":"90001","state":"CA"},"dateOfBirth":"1988-05-12","email":"patient@example.com","externalPatientId":"patient_123","name":"Example Patient","state":"CA"},"prescriber":{"credentials":"MD","licenseStates":["CA"],"name":"Alex Morgan","npi":"1234567893"},"prescription":{"authorized":true,"signedAt":"2026-07-10T12:00:00.000Z"},"quantity":1},
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **createOrderRequest** | [CreateOrderRequest](CreateOrderRequest.md) |  | |

### Return type

[**CreateOrder200Response**](CreateOrder200Response.md)

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


## getOrder

> CreateOrder200Response getOrder(orderId)

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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **orderId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**CreateOrder200Response**](CreateOrder200Response.md)

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


## listOrderEvents

> ListOrderEvents200Response listOrderEvents(orderId)

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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **orderId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ListOrderEvents200Response**](ListOrderEvents200Response.md)

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


## listOrders

> ListOrders200Response listOrders(externalOrderId, patientExternalId, limit, status)

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
    externalOrderId: externalOrderId_example,
    // string (optional)
    patientExternalId: patientExternalId_example,
    // number (optional)
    limit: 56,
    // 'blocked' | 'cancelled' | 'delivered' | 'draft' | 'processing' | 'shipped' | 'submitted' (optional)
    status: status_example,
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


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **externalOrderId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **patientExternalId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `100`] |
| **status** | `blocked`, `cancelled`, `delivered`, `draft`, `processing`, `shipped`, `submitted` |  | [Optional] [Defaults to `undefined`] [Enum: blocked, cancelled, delivered, draft, processing, shipped, submitted] |

### Return type

[**ListOrders200Response**](ListOrders200Response.md)

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


## submitOrder

> CreateOrder200Response submitOrder(orderId, idempotencyKey)

Submit order

Validates and submits an immutable order to the Affinity review queue.

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { SubmitOrderRequest } from '@affinity-health/sdk';

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
  } satisfies SubmitOrderRequest;

  try {
    const data = await api.submitOrder(body);
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
| **orderId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |

### Return type

[**CreateOrder200Response**](CreateOrder200Response.md)

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


## updateOrder

> CreateOrder200Response updateOrder(orderId, idempotencyKey, updateOrderRequest)

Update draft order

Updates an order while it remains a draft.

### Example

```ts
import {
  Configuration,
  PlatformOrdersApi,
} from '@affinity-health/sdk';
import type { UpdateOrderOperationRequest } from '@affinity-health/sdk';

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
    // string | Unique operation key required for every mutation.
    idempotencyKey: idempotencyKey_example,
    // UpdateOrderRequest
    updateOrderRequest: ...,
  } satisfies UpdateOrderOperationRequest;

  try {
    const data = await api.updateOrder(body);
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
| **orderId** | `string` |  | [Defaults to `undefined`] |
| **idempotencyKey** | `string` | Unique operation key required for every mutation. | [Defaults to `undefined`] |
| **updateOrderRequest** | [UpdateOrderRequest](UpdateOrderRequest.md) |  | |

### Return type

[**CreateOrder200Response**](CreateOrder200Response.md)

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

