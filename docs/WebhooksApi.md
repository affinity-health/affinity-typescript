# WebhooksApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                        | HTTP request                                              | Description           |
| ----------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| [**createWebhookEndpoint**](WebhooksApi.md#createwebhookendpointoperation)    | **POST** /v1/webhook-endpoints                            | Create endpoint       |
| [**deleteWebhookEndpoint**](WebhooksApi.md#deletewebhookendpoint)             | **DELETE** /v1/webhook-endpoints/{endpointId}             | Disable endpoint      |
| [**getWebhookEvent**](WebhooksApi.md#getwebhookevent)                         | **GET** /v1/webhook-events/{eventId}                      | Read event attempts   |
| [**listWebhookEndpoints**](WebhooksApi.md#listwebhookendpoints)               | **GET** /v1/webhook-endpoints                             | List endpoints        |
| [**listWebhookEvents**](WebhooksApi.md#listwebhookevents)                     | **GET** /v1/webhook-events                                | List events           |
| [**listWebhookGrants**](WebhooksApi.md#listwebhookgrants)                     | **GET** /v1/webhook-grants                                | List access grants    |
| [**replayWebhookEvent**](WebhooksApi.md#replaywebhookevent)                   | **POST** /v1/webhook-events/{eventId}/replay              | Replay event          |
| [**revokeWebhookGrant**](WebhooksApi.md#revokewebhookgrant)                   | **DELETE** /v1/webhook-grants/{platformId}                | Revoke webhook access |
| [**rotateWebhookEndpointSecret**](WebhooksApi.md#rotatewebhookendpointsecret) | **POST** /v1/webhook-endpoints/{endpointId}/rotate-secret | Rotate signing secret |
| [**saveWebhookGrant**](WebhooksApi.md#savewebhookgrantoperation)              | **PUT** /v1/webhook-grants/{platformId}                   | Grant webhook access  |
| [**testWebhookEndpoint**](WebhooksApi.md#testwebhookendpoint)                 | **POST** /v1/webhook-endpoints/{endpointId}/test          | Send test event       |
| [**updateWebhookEndpoint**](WebhooksApi.md#updatewebhookendpointoperation)    | **PATCH** /v1/webhook-endpoints/{endpointId}              | Update endpoint       |

## createWebhookEndpoint

> CreateWebhookEndpointResponse createWebhookEndpoint(idempotencyKey, createWebhookEndpointRequest, affinityVersion, xAffinityOrganizationId)

Create endpoint

Requires webhooks:write and Idempotency-Key. Defaults to the API key organization. A platform can select a practice or pharmacy owner with X-Affinity-Organization-Id and an explicit webhook grant. For platform-owned endpoints, practiceIds narrows delivery to selected connected practices. An empty filter receives all otherwise-authorized events.

### Example

```ts
import {
  Configuration,
  WebhooksApi,
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
  const api = new WebhooksApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateWebhookEndpointRequest
    createWebhookEndpointRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                             | Type                                                            | Description                                                                                                                                                                                                 | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **idempotencyKey**               | `string`                                                        |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **createWebhookEndpointRequest** | [CreateWebhookEndpointRequest](CreateWebhookEndpointRequest.md) |                                                                                                                                                                                                             |                                      |
| **affinityVersion**              | `string`                                                        |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId**      | `string`                                                        | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## deleteWebhookEndpoint

> DeleteWebhookEndpointResponse deleteWebhookEndpoint(endpointId, idempotencyKey, affinityVersion, xAffinityOrganizationId)

Disable endpoint

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { DeleteWebhookEndpointRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **endpointId**              | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **idempotencyKey**          | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getWebhookEvent

> GetWebhookEventResponse getWebhookEvent(eventId, affinityVersion, xAffinityOrganizationId)

Read event attempts

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { GetWebhookEventRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    eventId: eventId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **eventId**                 | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listWebhookEndpoints

> ListWebhookEndpointsResponse listWebhookEndpoints(endingBefore, limit, startingAfter, affinityVersion, xAffinityOrganizationId)

List endpoints

Requires webhooks:read. Returns endpoints owned by the key organization, or the organization selected with X-Affinity-Organization-Id. Platform delegation requires a webhook grant in the key\&#39;s mode.

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { ListWebhookEndpointsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string (optional)
    endingBefore: whe_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: whe_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **endingBefore**            | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **limit**                   | `number` |                                                                                                                                                                                                             | [Optional] [Defaults to `25`]        |
| **startingAfter**           | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listWebhookEvents

> ListWebhookEventsResponse listWebhookEvents(endingBefore, limit, status, startingAfter, affinityVersion, xAffinityOrganizationId)

List events

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { ListWebhookEventsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string (optional)
    endingBefore: evt_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // 'all' | 'delivered' | 'failed' | 'pending' (optional)
    status: status_example,
    // string (optional)
    startingAfter: evt_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type                                    | Description                                                                                                                                                                                                 | Notes                                                                        |
| --------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **endingBefore**            | `string`                                |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`]                                         |
| **limit**                   | `number`                                |                                                                                                                                                                                                             | [Optional] [Defaults to `25`]                                                |
| **status**                  | `all`, `delivered`, `failed`, `pending` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] [Enum: all, delivered, failed, pending] |
| **startingAfter**           | `string`                                |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`]                                         |
| **affinityVersion**         | `string`                                |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`]                                         |
| **xAffinityOrganizationId** | `string`                                | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`]                                         |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listWebhookGrants

> ListWebhookGrantsResponse listWebhookGrants(limit, startingAfter, endingBefore, affinityVersion)

List access grants

Requires webhooks:read on the owning practice or pharmacy key. Lists platform webhook grants in the key\&#39;s mode. Platforms cannot list or grant themselves delegated access.

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { ListWebhookGrantsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // number (optional)
    limit: 56,
    // string (optional)
    startingAfter: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    endingBefore: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListWebhookGrantsRequest;

  try {
    const data = await api.listWebhookGrants(body);
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
| **limit**           | `number` |             | [Optional] [Defaults to `25`]        |
| **startingAfter**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **endingBefore**    | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListWebhookGrantsResponse**](ListWebhookGrantsResponse.md)

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

## replayWebhookEvent

> ReplayWebhookEventResponse replayWebhookEvent(eventId, idempotencyKey, affinityVersion, xAffinityOrganizationId)

Replay event

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { ReplayWebhookEventRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    eventId: eventId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **eventId**                 | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **idempotencyKey**          | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## revokeWebhookGrant

> RevokeWebhookGrantResponse revokeWebhookGrant(platformId, idempotencyKey, affinityVersion)

Revoke webhook access

Requires webhooks:write on the owning practice or pharmacy key and Idempotency-Key. Removes platform webhook access in this mode. Existing endpoints remain owned by the practice or pharmacy and continue operating.

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { RevokeWebhookGrantRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    platformId: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RevokeWebhookGrantRequest;

  try {
    const data = await api.revokeWebhookGrant(body);
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
| **platformId**      | `string` |             | [Defaults to `undefined`]            |
| **idempotencyKey**  | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RevokeWebhookGrantResponse**](RevokeWebhookGrantResponse.md)

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

## rotateWebhookEndpointSecret

> RotateWebhookEndpointSecretResponse rotateWebhookEndpointSecret(endpointId, idempotencyKey, affinityVersion, xAffinityOrganizationId)

Rotate signing secret

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { RotateWebhookEndpointSecretRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **endpointId**              | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **idempotencyKey**          | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## saveWebhookGrant

> SaveWebhookGrantResponse saveWebhookGrant(platformId, idempotencyKey, saveWebhookGrantRequest, affinityVersion)

Grant webhook access

Requires webhooks:write on the owning practice or pharmacy key and Idempotency-Key. Grants or replaces a platform\&#39;s webhook permissions in this mode. A practice must already be connected to that platform. The grant does not give the platform access to other API resources.

### Example

```ts
import {
  Configuration,
  WebhooksApi,
} from '@affinity-health/sdk';
import type { SaveWebhookGrantOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    platformId: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // SaveWebhookGrantRequest
    saveWebhookGrantRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies SaveWebhookGrantOperationRequest;

  try {
    const data = await api.saveWebhookGrant(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                        | Type                                                  | Description | Notes                                |
| --------------------------- | ----------------------------------------------------- | ----------- | ------------------------------------ |
| **platformId**              | `string`                                              |             | [Defaults to `undefined`]            |
| **idempotencyKey**          | `string`                                              |             | [Defaults to `undefined`]            |
| **saveWebhookGrantRequest** | [SaveWebhookGrantRequest](SaveWebhookGrantRequest.md) |             |                                      |
| **affinityVersion**         | `string`                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**SaveWebhookGrantResponse**](SaveWebhookGrantResponse.md)

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

## testWebhookEndpoint

> TestWebhookEndpointResponse testWebhookEndpoint(endpointId, idempotencyKey, affinityVersion, xAffinityOrganizationId)

Send test event

### Example

```ts
import { Configuration, WebhooksApi } from "@affinity-health/sdk";
import type { TestWebhookEndpointRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new WebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
  } satisfies TestWebhookEndpointRequest;

  try {
    const data = await api.testWebhookEndpoint(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                        | Type     | Description                                                                                                                                                                                                 | Notes                                |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **endpointId**              | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **idempotencyKey**          | `string` |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **affinityVersion**         | `string` |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId** | `string` | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

### Return type

[**TestWebhookEndpointResponse**](TestWebhookEndpointResponse.md)

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
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updateWebhookEndpoint

> UpdateWebhookEndpointResponse updateWebhookEndpoint(endpointId, idempotencyKey, updateWebhookEndpointRequest, affinityVersion, xAffinityOrganizationId)

Update endpoint

Requires webhooks:write and Idempotency-Key. Updates an endpoint in the selected organization and mode. Omitted practiceIds preserves the filter; an empty array removes the practice filter. Subscription changes apply to newly generated events.

### Example

```ts
import {
  Configuration,
  WebhooksApi,
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
  const api = new WebhooksApi(config);

  const body = {
    // string
    endpointId: endpointId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdateWebhookEndpointRequest
    updateWebhookEndpointRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. (optional)
    xAffinityOrganizationId: xAffinityOrganizationId_example,
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

| Name                             | Type                                                            | Description                                                                                                                                                                                                 | Notes                                |
| -------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **endpointId**                   | `string`                                                        |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **idempotencyKey**               | `string`                                                        |                                                                                                                                                                                                             | [Defaults to `undefined`]            |
| **updateWebhookEndpointRequest** | [UpdateWebhookEndpointRequest](UpdateWebhookEndpointRequest.md) |                                                                                                                                                                                                             |                                      |
| **affinityVersion**              | `string`                                                        |                                                                                                                                                                                                             | [Optional] [Defaults to `undefined`] |
| **xAffinityOrganizationId**      | `string`                                                        | Defaults to the API key organization. A platform may select a practice or pharmacy only with an explicit webhook grant in this mode. This changes the webhook owner, not the caller or event subscriptions. | [Optional] [Defaults to `undefined`] |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **422**     | HTTP 422    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
