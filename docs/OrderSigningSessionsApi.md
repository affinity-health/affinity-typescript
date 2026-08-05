# OrderSigningSessionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                         | HTTP request                        | Description                  |
| ---------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------- |
| [**createOrderSigningSession**](OrderSigningSessionsApi.md#createordersigningsessionoperation) | **POST** /v1/order-signing-sessions | Create order signing session |

## createOrderSigningSession

> CreateOrderSigningSessionResponse createOrderSigningSession(idempotencyKey, createOrderSigningSessionRequest, affinityVersion)

Create order signing session

Creates a one-time Affinity Hosted URL where the mapped provider reviews and PIN-signs every prescription in one patient order. The provider PIN never reaches the platform.

### Example

```ts
import {
  Configuration,
  OrderSigningSessionsApi,
} from '@affinity-health/sdk';
import type { CreateOrderSigningSessionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new OrderSigningSessionsApi(config);

  const body = {
    // string
    idempotencyKey: idempotencyKey_example,
    // CreateOrderSigningSessionRequest
    createOrderSigningSessionRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreateOrderSigningSessionOperationRequest;

  try {
    const data = await api.createOrderSigningSession(body);
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
| **idempotencyKey**                   | `string`                                                                |             | [Defaults to `undefined`]            |
| **createOrderSigningSessionRequest** | [CreateOrderSigningSessionRequest](CreateOrderSigningSessionRequest.md) |             |                                      |
| **affinityVersion**                  | `string`                                                                |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateOrderSigningSessionResponse**](CreateOrderSigningSessionResponse.md)

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
