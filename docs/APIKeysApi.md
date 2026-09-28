# APIKeysApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                  | HTTP request                                 | Description                       |
| --------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------- |
| [**createPlatformPracticeApiKey**](APIKeysApi.md#createplatformpracticeapikeyoperation) | **POST** /v1/practices/{practiceId}/api-keys | Create connected practice API key |
| [**getApiAccess**](APIKeysApi.md#getapiaccess)                                          | **GET** /v1/auth/access                      | Read API key access               |

## createPlatformPracticeApiKey

> CreatePlatformPracticeApiKeyResponse createPlatformPracticeApiKey(practiceId, idempotencyKey, createPlatformPracticeApiKeyRequest, affinityVersion)

Create connected practice API key

Creates a practice API key for a connected practice. Requires a platform key with service_keys:write and every requested scope. The practice key uses the platform key\&#39;s Test or Live mode and cannot outlive it. Requires Idempotency-Key for safe retries; the secret is returned in the encrypted replay response for 24 hours.

### Example

```ts
import {
  Configuration,
  APIKeysApi,
} from '@affinity-health/sdk';
import type { CreatePlatformPracticeApiKeyOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new APIKeysApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePlatformPracticeApiKeyRequest
    createPlatformPracticeApiKeyRequest: ...,
    // string | Selects the HTTP API contract for this request only. When omitted, API-key requests use their service account’s stored version. Does not change the stored default. (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePlatformPracticeApiKeyOperationRequest;

  try {
    const data = await api.createPlatformPracticeApiKey(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                    | Type                                                                          | Description                                                                                                                                                         | Notes                                |
| --------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**                          | `string`                                                                      |                                                                                                                                                                     | [Defaults to `undefined`]            |
| **idempotencyKey**                      | `string`                                                                      |                                                                                                                                                                     | [Defaults to `undefined`]            |
| **createPlatformPracticeApiKeyRequest** | [CreatePlatformPracticeApiKeyRequest](CreatePlatformPracticeApiKeyRequest.md) |                                                                                                                                                                     |                                      |
| **affinityVersion**                     | `string`                                                                      | Selects the HTTP API contract for this request only. When omitted, API-key requests use their service account’s stored version. Does not change the stored default. | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePlatformPracticeApiKeyResponse**](CreatePlatformPracticeApiKeyResponse.md)

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

## getApiAccess

> GetApiAccessResponse getApiAccess(affinityVersion)

Read API key access

Returns the subject, mode, and scopes for the API key.

### Example

```ts
import { Configuration, APIKeysApi } from "@affinity-health/sdk";
import type { GetApiAccessRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new APIKeysApi(config);

  const body = {
    // string | Selects the HTTP API contract for this request only. When omitted, API-key requests use their service account’s stored version. Does not change the stored default. (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetApiAccessRequest;

  try {
    const data = await api.getApiAccess(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                | Type     | Description                                                                                                                                                         | Notes                                |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **affinityVersion** | `string` | Selects the HTTP API contract for this request only. When omitted, API-key requests use their service account’s stored version. Does not change the stored default. | [Optional] [Defaults to `undefined`] |

### Return type

[**GetApiAccessResponse**](GetApiAccessResponse.md)

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
