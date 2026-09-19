# SessionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                       | HTTP request                    | Description              |
| ---------------------------------------------------------------------------- | ------------------------------- | ------------------------ |
| [**createComponentSession**](SessionsApi.md#createcomponentsessionoperation) | **POST** /v1/component-sessions | Create component session |
| [**createHostedSession**](SessionsApi.md#createhostedsessionoperation)       | **POST** /v1/hosted-sessions    | Create hosted session    |

## createComponentSession

> CreateComponentSessionResponse createComponentSession(idempotencyKey, createComponentSessionRequest, affinityVersion)

Create component session

Creates a one-time, origin-bound Affinity Elements client secret. The platform API key must stay on the server.

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@affinity-health/sdk';
import type { CreateComponentSessionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new SessionsApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateComponentSessionRequest
    createComponentSessionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateComponentSessionOperationRequest;

  try {
    const data = await api.createComponentSession(body);
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
| **idempotencyKey**                | `string`                                                          |             | [Defaults to `undefined`]            |
| **createComponentSessionRequest** | [CreateComponentSessionRequest](CreateComponentSessionRequest.md) |             |                                      |
| **affinityVersion**               | `string`                                                          |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateComponentSessionResponse**](CreateComponentSessionResponse.md)

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

## createHostedSession

> CreateHostedSessionResponse createHostedSession(idempotencyKey, createHostedSessionRequest, affinityVersion)

Create hosted session

Creates a hosted workflow URL that expires after 15 minutes. Use order_review to open an existing draft for clinician signing in Clinic. Opening the page does not change order state; no review request or approval step is required. The clinician must sign in and have current prescribing access; the link grants no signing authority. Keep the practice or platform API key on the server.

### Example

```ts
import {
  Configuration,
  SessionsApi,
} from '@affinity-health/sdk';
import type { CreateHostedSessionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new SessionsApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateHostedSessionRequest
    createHostedSessionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateHostedSessionOperationRequest;

  try {
    const data = await api.createHostedSession(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                           | Type                                                        | Description | Notes                                |
| ------------------------------ | ----------------------------------------------------------- | ----------- | ------------------------------------ |
| **idempotencyKey**             | `string`                                                    |             | [Defaults to `undefined`]            |
| **createHostedSessionRequest** | [CreateHostedSessionRequest](CreateHostedSessionRequest.md) |             |                                      |
| **affinityVersion**            | `string`                                                    |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateHostedSessionResponse**](CreateHostedSessionResponse.md)

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
