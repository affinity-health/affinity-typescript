# PlatformsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getPlatformOrganization**](PlatformsApi.md#getplatformorganization) | **GET** /v1/platform/organization | Read platform organization |



## getPlatformOrganization

> GetPlatformOrganization200Response getPlatformOrganization(orgId)

Read platform organization

Reads the authenticated platform organization and current role.

### Example

```ts
import {
  Configuration,
  PlatformsApi,
} from '@affinity-health/sdk';
import type { GetPlatformOrganizationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformsApi(config);

  const body = {
    // string (optional)
    orgId: orgId_example,
  } satisfies GetPlatformOrganizationRequest;

  try {
    const data = await api.getPlatformOrganization(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **orgId** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPlatformOrganization200Response**](GetPlatformOrganization200Response.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |
| **400** | Bad request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not found |  -  |
| **409** | Conflict |  -  |
| **410** | Gone |  -  |
| **413** | Payload too large |  -  |
| **422** | Unprocessable entity |  -  |
| **429** | Too many requests |  -  |
| **500** | Internal server error |  -  |
| **501** | Not implemented |  -  |
| **502** | Bad gateway |  -  |
| **503** | Service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

