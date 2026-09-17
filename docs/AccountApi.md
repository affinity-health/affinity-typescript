# AccountApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                     | HTTP request        | Description  |
| ------------------------------------------ | ------------------- | ------------ |
| [**getAccount**](AccountApi.md#getaccount) | **GET** /v1/account | Read account |

## getAccount

> GetAccountResponse getAccount(orgId, affinityVersion)

Read account

Returns the platform organization and the current role.

### Example

```ts
import { Configuration, AccountApi } from "@affinity-health/sdk";
import type { GetAccountRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new AccountApi(config);

  const body = {
    // string (optional)
    orgId: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetAccountRequest;

  try {
    const data = await api.getAccount(body);
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
| **orgId**           | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetAccountResponse**](GetAccountResponse.md)

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
