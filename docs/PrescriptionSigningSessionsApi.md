# PrescriptionSigningSessionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                                              | HTTP request                               | Description                         |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------- |
| [**createPrescriptionSigningSession**](PrescriptionSigningSessionsApi.md#createprescriptionsigningsessionoperation) | **POST** /v1/prescription-signing-sessions | Create prescription signing session |

## createPrescriptionSigningSession

> CreatePrescriptionSigningSessionResponse createPrescriptionSigningSession(createPrescriptionSigningSessionRequest, idempotencyKey, affinityVersion)

Create prescription signing session

Creates a one-time Affinity Hosted URL where the mapped provider reviews, PIN-signs, and sends one API-created prescription. The provider PIN never reaches the platform.

### Example

```ts
import {
  Configuration,
  PrescriptionSigningSessionsApi,
} from '@affinity-health/sdk';
import type { CreatePrescriptionSigningSessionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PrescriptionSigningSessionsApi(config);

  const body = {
    // CreatePrescriptionSigningSessionRequest
    createPrescriptionSigningSessionRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies CreatePrescriptionSigningSessionOperationRequest;

  try {
    const data = await api.createPrescriptionSigningSession(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                        | Type                                                                                  | Description                                                                      | Notes                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| **createPrescriptionSigningSessionRequest** | [CreatePrescriptionSigningSessionRequest](CreatePrescriptionSigningSessionRequest.md) |                                                                                  |                                      |
| **idempotencyKey**                          | `string`                                                                              | Unique operation key required for every mutation.                                | [Optional] [Defaults to `undefined`] |
| **affinityVersion**                         | `string`                                                                              | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePrescriptionSigningSessionResponse**](CreatePrescriptionSigningSessionResponse.md)

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
