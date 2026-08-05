# APIKeysApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                         | HTTP request            | Description         |
| ---------------------------------------------- | ----------------------- | ------------------- |
| [**getApiAccess**](APIKeysApi.md#getapiaccess) | **GET** /v1/auth/access | Read API key access |

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
    // string (optional)
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

| Name                | Type     | Description | Notes                                |
| ------------------- | -------- | ----------- | ------------------------------------ |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
