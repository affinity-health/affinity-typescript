# OrdersApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                           | HTTP request                                                   | Description                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------- |
| [**actOnOrderException**](OrdersApi.md#actonorderexceptionoperation)             | **POST** /v1/orders/{orderId}/exceptions/{exceptionId}/actions | Handle order exception          |
| [**addOrderPrescription**](OrdersApi.md#addorderprescriptionoperation)           | **POST** /v1/orders/{orderId}/prescriptions                    | Add prescription to order       |
| [**cancelOrder**](OrdersApi.md#cancelorderoperation)                             | **POST** /v1/orders/{orderId}/cancel                           | Cancel order                    |
| [**createOrder**](OrdersApi.md#createorderoperation)                             | **POST** /v1/orders                                            | Create order                    |
| [**createOrderBatch**](OrdersApi.md#createorderbatchoperation)                   | **POST** /v1/order-batches                                     | Create order batch              |
| [**getOrder**](OrdersApi.md#getorder)                                            | **GET** /v1/orders/{orderId}                                   | Read order                      |
| [**getOrderTestSimulation**](OrdersApi.md#getordertestsimulation)                | **GET** /v1/orders/{orderId}/test-simulation                   | Read Test order controls        |
| [**listOrderEvents**](OrdersApi.md#listorderevents)                              | **GET** /v1/orders/{orderId}/events                            | List order events               |
| [**listOrders**](OrdersApi.md#listorders)                                        | **GET** /v1/orders                                             | List orders                     |
| [**rejectOrder**](OrdersApi.md#rejectorderoperation)                             | **POST** /v1/orders/{orderId}/rejection                        | Reject order                    |
| [**signOrder**](OrdersApi.md#signorderoperation)                                 | **POST** /v1/orders/{orderId}/sign                             | Sign order                      |
| [**submitOrder**](OrdersApi.md#submitorderoperation)                             | **POST** /v1/orders/{orderId}/submit                           | Submit order                    |
| [**updateOrderPrescription**](OrdersApi.md#updateorderprescriptionoperation)     | **PATCH** /v1/orders/{orderId}/prescriptions/{prescriptionId}  | Update prescription in order    |
| [**updateOrderTestSimulation**](OrdersApi.md#updateordertestsimulationoperation) | **PUT** /v1/orders/{orderId}/test-simulation                   | Configure Test order simulation |

## actOnOrderException

> ActOnOrderExceptionResponse actOnOrderException(exceptionId, orderId, idempotencyKey, actOnOrderExceptionRequest, affinityVersion, affinityActorId, affinityActorType)

Handle order exception

Acknowledge, retry, contact, assign, or resolve an order exception.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { ActOnOrderExceptionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    exceptionId: exceptionId_example,
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // ActOnOrderExceptionRequest
    actOnOrderExceptionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies ActOnOrderExceptionOperationRequest;

  try {
    const data = await api.actOnOrderException(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                           | Type                                                        | Description                                                                                                                                  | Notes                                |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **exceptionId**                | `string`                                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **orderId**                    | `string`                                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**             | `string`                                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **actOnOrderExceptionRequest** | [ActOnOrderExceptionRequest](ActOnOrderExceptionRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**            | `string`                                                    |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**            | `string`                                                    | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**          | `string`                                                    | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**ActOnOrderExceptionResponse**](ActOnOrderExceptionResponse.md)

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
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## addOrderPrescription

> AddOrderPrescriptionResponse addOrderPrescription(orderId, idempotencyKey, addOrderPrescriptionRequest, affinityVersion, affinityActorId, affinityActorType)

Add prescription to order

Requires orders:write, Idempotency-Key and the current expectedVersions for every prescription. Adds a complete prescription to an unsigned Order and returns all new versions. Omitted actor context defaults to the authenticated service account as a system actor. Patient and prescriber attribution stay fixed. Signed orders cannot be amended through this endpoint. Signing and submission require orders:sign through their separate endpoints.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { AddOrderPrescriptionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // AddOrderPrescriptionRequest
    addOrderPrescriptionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies AddOrderPrescriptionOperationRequest;

  try {
    const data = await api.addOrderPrescription(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                            | Type                                                          | Description                                                                                                                                  | Notes                                |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **orderId**                     | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**              | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **addOrderPrescriptionRequest** | [AddOrderPrescriptionRequest](AddOrderPrescriptionRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**             | `string`                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**             | `string`                                                      | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**           | `string`                                                      | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**AddOrderPrescriptionResponse**](AddOrderPrescriptionResponse.md)

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

## cancelOrder

> CancelOrderResponse cancelOrder(orderId, idempotencyKey, cancelOrderRequest, affinityVersion, affinityActorId, affinityActorType)

Cancel order

Confirms cancellation locally before external submission; otherwise creates an acknowledged pharmacy cancellation request. Shipment possession makes the request too late.

### Example

```ts
import {
  Configuration,
  OrdersApi,
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
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CancelOrderRequest
    cancelOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
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

| Name                   | Type                                        | Description                                                                                                                                  | Notes                                |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **orderId**            | `string`                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**     | `string`                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **cancelOrderRequest** | [CancelOrderRequest](CancelOrderRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**    | `string`                                    |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**    | `string`                                    | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**  | `string`                                    | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## createOrder

> CreateOrderResponse createOrder(idempotencyKey, createOrderRequest, affinityVersion, affinityActorId, affinityActorType)

Create order

Creates one unsigned order with 1–20 prescriptions for one patient in one practice. Supply exactly one of patientId or patient; inline patient creation additionally requires patients:write and commits atomically with the order. External identities resolve within the practice and mode; email does not merge patients. Omit userId for an unassigned draft or select a registered or accepted clinician. Use the sign and submit endpoints after collecting clinician attestation. Idempotency-Key is required. Omitted actor context defaults to the authenticated service account as a system actor.

### Example

```ts
import {
  Configuration,
  OrdersApi,
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
  const api = new OrdersApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateOrderRequest
    createOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
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

| Name                   | Type                                        | Description                                                                                                                                  | Notes                                |
| ---------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **idempotencyKey**     | `string`                                    |                                                                                                                                              | [Defaults to `undefined`]            |
| **createOrderRequest** | [CreateOrderRequest](CreateOrderRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**    | `string`                                    |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**    | `string`                                    | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**  | `string`                                    | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## createOrderBatch

> CreateOrderBatchResponse createOrderBatch(idempotencyKey, createOrderBatchRequest, affinityVersion, affinityActorId, affinityActorType)

Create order batch

Creates 1–20 orders for distinct patients in one practice, each with 1–20 prescriptions. Each accepts patientId or inline patient details. Orders and newly created patients commit atomically; any failure saves none. Requires orders:write and Idempotency-Key; inline patients also require patients:write. Omitted actor context defaults to the authenticated service account as a system actor. Sign and submit each resulting order separately using orders:sign.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { CreateOrderBatchOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateOrderBatchRequest
    createOrderBatchRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies CreateOrderBatchOperationRequest;

  try {
    const data = await api.createOrderBatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                        | Type                                                  | Description                                                                                                                                  | Notes                                |
| --------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **idempotencyKey**          | `string`                                              |                                                                                                                                              | [Defaults to `undefined`]            |
| **createOrderBatchRequest** | [CreateOrderBatchRequest](CreateOrderBatchRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**         | `string`                                              |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**         | `string`                                              | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**       | `string`                                              | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateOrderBatchResponse**](CreateOrderBatchResponse.md)

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

## getOrder

> GetOrderResponse getOrder(orderId, affinityVersion, affinityActorId, affinityActorType)

Read order

### Example

```ts
import { Configuration, OrdersApi } from "@affinity-health/sdk";
import type { GetOrderRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
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

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **orderId**           | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getOrderTestSimulation

> GetOrderTestSimulationResponse getOrderTestSimulation(orderId, affinityVersion)

Read Test order controls

Requires orders:write. Available only in Test mode.

### Example

```ts
import { Configuration, OrdersApi } from "@affinity-health/sdk";
import type { GetOrderTestSimulationRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetOrderTestSimulationRequest;

  try {
    const data = await api.getOrderTestSimulation(body);
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
| **orderId**         | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetOrderTestSimulationResponse**](GetOrderTestSimulationResponse.md)

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

## listOrderEvents

> ListOrderEventsResponse listOrderEvents(orderId, endingBefore, limit, startingAfter, affinityVersion, affinityActorId, affinityActorType)

List order events

### Example

```ts
import { Configuration, OrdersApi } from "@affinity-health/sdk";
import type { ListOrderEventsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
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

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **orderId**           | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **endingBefore**      | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **limit**             | `number` |                                                                                                                                              | [Optional] [Defaults to `25`]        |
| **startingAfter**     | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listOrders

> ListOrdersResponse listOrders(query, externalOrderId, createdAfter, createdBefore, endingBefore, limit, orderId, patientId, patientExternalId, practiceId, sort, startingAfter, status, affinityVersion, affinityActorId, affinityActorType)

List orders

### Example

```ts
import { Configuration, OrdersApi } from "@affinity-health/sdk";
import type { ListOrdersRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string (optional)
    query: query_example,
    // string (optional)
    externalOrderId: externalOrderId_example,
    // string (optional)
    createdAfter: createdAfter_example,
    // string (optional)
    createdBefore: createdBefore_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // number (optional)
    limit: 56,
    // string (optional)
    orderId: orderId_example,
    // string (optional)
    patientId: patientId_example,
    // string (optional)
    patientExternalId: patientExternalId_example,
    // string (optional)
    practiceId: practiceId_example,
    // 'newest' | 'oldest' (optional)
    sort: sort_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // 'blocked' | 'cancelled' | 'delivered' | 'draft' | 'partially_submitted' | 'processing' | 'ready' | 'rejected' | 'requires_provider_signature' | 'shipped' | 'submitted' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
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

| Name                  | Type                                                                                                                                                          | Description                                                                                                                                  | Notes                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **query**             | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **externalOrderId**   | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **createdAfter**      | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **createdBefore**     | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **endingBefore**      | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **limit**             | `number`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `25`]                                                                                                                                                        |
| **orderId**           | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **patientId**         | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **patientExternalId** | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **practiceId**        | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **sort**              | `newest`, `oldest`                                                                                                                                            |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: newest, oldest]                                                                                                                          |
| **startingAfter**     | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **status**            | `blocked`, `cancelled`, `delivered`, `draft`, `partially_submitted`, `processing`, `ready`, `rejected`, `requires_provider_signature`, `shipped`, `submitted` |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: blocked, cancelled, delivered, draft, partially_submitted, processing, ready, rejected, requires_provider_signature, shipped, submitted] |
| **affinityVersion**   | `string`                                                                                                                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **affinityActorId**   | `string`                                                                                                                                                      | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`]                                                                                                                                                 |
| **affinityActorType** | `string`                                                                                                                                                      | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`]                                                                                                                                                 |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## rejectOrder

> RejectOrderResponse rejectOrder(orderId, idempotencyKey, rejectOrderRequest, affinityVersion)

Reject order

Requires orders:sign, clinician actor headers, and Idempotency-Key. Permanently rejects the complete unsigned order after checking the exact prescription versions.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { RejectOrderOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // RejectOrderRequest
    rejectOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RejectOrderOperationRequest;

  try {
    const data = await api.rejectOrder(body);
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
| **rejectOrderRequest** | [RejectOrderRequest](RejectOrderRequest.md) |             |                                      |
| **affinityVersion**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RejectOrderResponse**](RejectOrderResponse.md)

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

## signOrder

> SignOrderResponse signOrder(orderId, idempotencyKey, signOrderRequest, affinityVersion)

Sign order

Requires orders:sign, Idempotency-Key, and the clinician\&#39;s registered external ID in Affinity-Actor-Id with Affinity-Actor-Type: user. Attest to every exact prescription version. Live requires approved organizations and verified prescribing authority. Signing does not submit to a pharmacy; use Submit order.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { SignOrderOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // SignOrderRequest
    signOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies SignOrderOperationRequest;

  try {
    const data = await api.signOrder(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                 | Type                                    | Description | Notes                                |
| -------------------- | --------------------------------------- | ----------- | ------------------------------------ |
| **orderId**          | `string`                                |             | [Defaults to `undefined`]            |
| **idempotencyKey**   | `string`                                |             | [Defaults to `undefined`]            |
| **signOrderRequest** | [SignOrderRequest](SignOrderRequest.md) |             |                                      |
| **affinityVersion**  | `string`                                |             | [Optional] [Defaults to `undefined`] |

### Return type

[**SignOrderResponse**](SignOrderResponse.md)

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

## submitOrder

> SubmitOrderResponse submitOrder(orderId, idempotencyKey, submitOrderRequest, affinityVersion)

Submit order

Requires orders:sign and Idempotency-Key. Queues signed prescriptions after rechecking authorization, signature integrity, billing, and fulfillment eligibility. Track pharmacy acceptance through order reads and webhooks. After a partial failure, retry submission with a new idempotency key; already queued prescriptions are not duplicated.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { SubmitOrderOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // SubmitOrderRequest
    submitOrderRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies SubmitOrderOperationRequest;

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

| Name                   | Type                                        | Description | Notes                                |
| ---------------------- | ------------------------------------------- | ----------- | ------------------------------------ |
| **orderId**            | `string`                                    |             | [Defaults to `undefined`]            |
| **idempotencyKey**     | `string`                                    |             | [Defaults to `undefined`]            |
| **submitOrderRequest** | [SubmitOrderRequest](SubmitOrderRequest.md) |             |                                      |
| **affinityVersion**    | `string`                                    |             | [Optional] [Defaults to `undefined`] |

### Return type

[**SubmitOrderResponse**](SubmitOrderResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **202**     | HTTP 202    | -                |
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updateOrderPrescription

> UpdateOrderPrescriptionResponse updateOrderPrescription(orderId, prescriptionId, idempotencyKey, updateOrderPrescriptionRequest, affinityVersion, affinityActorId, affinityActorType)

Update prescription in order

Requires orders:write, Idempotency-Key and the current expectedVersions for every prescription. Replaces one prescription with complete medication instructions and returns all new versions. Omitted actor context defaults to the authenticated service account as a system actor. Patient and prescriber attribution stay fixed. Signed orders cannot be amended through this endpoint. Signing and submission require orders:sign through their separate endpoints.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { UpdateOrderPrescriptionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    prescriptionId: prescriptionId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateOrderPrescriptionRequest
    updateOrderPrescriptionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies UpdateOrderPrescriptionOperationRequest;

  try {
    const data = await api.updateOrderPrescription(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                               | Type                                                                | Description                                                                                                                                  | Notes                                |
| ---------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **orderId**                        | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **prescriptionId**                 | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**                 | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **updateOrderPrescriptionRequest** | [UpdateOrderPrescriptionRequest](UpdateOrderPrescriptionRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**                | `string`                                                            |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**                | `string`                                                            | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**              | `string`                                                            | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateOrderPrescriptionResponse**](UpdateOrderPrescriptionResponse.md)

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

## updateOrderTestSimulation

> UpdateOrderTestSimulationResponse updateOrderTestSimulation(orderId, idempotencyKey, updateOrderTestSimulationRequest, affinityVersion)

Configure Test order simulation

Requires orders:write and Idempotency-Key. Configure before submission or queue a valid pharmacy event in manual mode. Events use normal order history and Test webhooks. Live requests are rejected.

### Example

```ts
import {
  Configuration,
  OrdersApi,
} from '@affinity-health/sdk';
import type { UpdateOrderTestSimulationOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrdersApi(config);

  const body = {
    // string
    orderId: orderId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateOrderTestSimulationRequest
    updateOrderTestSimulationRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies UpdateOrderTestSimulationOperationRequest;

  try {
    const data = await api.updateOrderTestSimulation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                 | Type                                                                    | Description | Notes                                |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **orderId**                          | `string`                                                                |             | [Defaults to `undefined`]            |
| **idempotencyKey**                   | `string`                                                                |             | [Defaults to `undefined`]            |
| **updateOrderTestSimulationRequest** | [UpdateOrderTestSimulationRequest](UpdateOrderTestSimulationRequest.md) |             |                                      |
| **affinityVersion**                  | `string`                                                                |             | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdateOrderTestSimulationResponse**](UpdateOrderTestSimulationResponse.md)

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
