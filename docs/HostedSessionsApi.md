# HostedSessionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                       | HTTP request                 | Description           |
| ---------------------------------------------------------------------------- | ---------------------------- | --------------------- |
| [**createHostedSession**](HostedSessionsApi.md#createhostedsessionoperation) | **POST** /v1/hosted-sessions | Create hosted session |

## createHostedSession

> CreateHostedSessionResponse createHostedSession(idempotencyKey, createHostedSessionRequest, affinityVersion)

Create hosted session

Creates a single-use Affinity Hosted workflow URL that expires after 15 minutes. The platform API key must stay on the server.

### Example

```ts
import {
  Configuration,
  HostedSessionsApi,
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
  const api = new HostedSessionsApi(config);

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
