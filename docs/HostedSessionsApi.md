# HostedSessionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                       | HTTP request                 | Description           |
| ---------------------------------------------------------------------------- | ---------------------------- | --------------------- |
| [**createHostedSession**](HostedSessionsApi.md#createhostedsessionoperation) | **POST** /v1/hosted-sessions | Create hosted session |

## createHostedSession

> CreateHostedSessionResponse createHostedSession(createHostedSessionRequest, idempotencyKey, affinityVersion)

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
    // CreateHostedSessionRequest
    createHostedSessionRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
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

| Name                           | Type                                                        | Description                                                                      | Notes                                |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **createHostedSessionRequest** | [CreateHostedSessionRequest](CreateHostedSessionRequest.md) |                                                                                  |                                      |
| **idempotencyKey**             | `string`                                                    | Unique operation key required for every mutation.                                | [Optional] [Defaults to `undefined`] |
| **affinityVersion**            | `string`                                                    | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**CreateHostedSessionResponse**](CreateHostedSessionResponse.md)

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
