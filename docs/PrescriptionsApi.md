# PrescriptionsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                    | HTTP request               | Description               |
| ------------------------------------------------------------------------- | -------------------------- | ------------------------- |
| [**createPrescription**](PrescriptionsApi.md#createprescriptionoperation) | **POST** /v1/prescriptions | Create prescription draft |

## createPrescription

> CreatePrescriptionResponse createPrescription(affinityActorId, affinityActorType, createPrescriptionRequest, idempotencyKey, affinityVersion)

Create prescription draft

Creates a complete unsigned prescription draft. A platform API key cannot sign it; create a provider-bound prescription signing session next. Idempotency-Key and actor context are required.

### Example

```ts
import {
  Configuration,
  PrescriptionsApi,
} from '@affinity-health/sdk';
import type { CreatePrescriptionOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PrescriptionsApi(config);

  const body = {
    // string | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address.
    affinityActorId: affinityActorId_example,
    // 'user' | 'system' | Whether the external actor is an authenticated platform user or an automated system process.
    affinityActorType: affinityActorType_example,
    // CreatePrescriptionRequest
    createPrescriptionRequest: ...,
    // string | Unique operation key required for every mutation. (optional)
    idempotencyKey: idempotencyKey_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-29,
  } satisfies CreatePrescriptionOperationRequest;

  try {
    const data = await api.createPrescription(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                          | Type                                                      | Description                                                                                                                  | Notes                                          |
| ----------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **affinityActorId**           | `string`                                                  | Stable opaque ID of the authenticated platform user or system initiating a PHI-capable request. Do not use an email address. | [Defaults to `undefined`]                      |
| **affinityActorType**         | `user`, `system`                                          | Whether the external actor is an authenticated platform user or an automated system process.                                 | [Defaults to `undefined`] [Enum: user, system] |
| **createPrescriptionRequest** | [CreatePrescriptionRequest](CreatePrescriptionRequest.md) |                                                                                                                              |                                                |
| **idempotencyKey**            | `string`                                                  | Unique operation key required for every mutation.                                                                            | [Optional] [Defaults to `undefined`]           |
| **affinityVersion**           | `string`                                                  | Optional per-request override for the service account\&#39;s pinned API version.                                             | [Optional] [Defaults to `undefined`]           |

### Return type

[**CreatePrescriptionResponse**](CreatePrescriptionResponse.md)

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
