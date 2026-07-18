# CatalogApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listCatalogItems**](CatalogApi.md#listcatalogitems) | **GET** /v1/catalog/items | List catalog items |



## listCatalogItems

> ListCatalogItems200Response listCatalogItems(query, limit, route)

List catalog items

Searches the Affinity catalog across all connected compounders and routing restrictions.

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '@affinity-health/sdk';
import type { ListCatalogItemsRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new CatalogApi(config);

  const body = {
    // string (optional)
    query: query_example,
    // number (optional)
    limit: 56,
    // 'all' | 'injectable' | 'nasal' | 'oral' | 'sublingual' | 'topical' | 'unknown' (optional)
    route: route_example,
  } satisfies ListCatalogItemsRequest;

  try {
    const data = await api.listCatalogItems(body);
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
| **query** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `50`] |
| **route** | `all`, `injectable`, `nasal`, `oral`, `sublingual`, `topical`, `unknown` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, injectable, nasal, oral, sublingual, topical, unknown] |

### Return type

[**ListCatalogItems200Response**](ListCatalogItems200Response.md)

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

