# CatalogApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listCatalogItems**](CatalogApi.md#listcatalogitems) | **GET** /v1/catalog/items | List catalog items |
| [**listShippingOptions**](CatalogApi.md#listshippingoptions) | **GET** /v1/catalog/items/{catalogItemId}/shipping-options | List shipping options |



## listCatalogItems

> ListCatalogItemsResponse listCatalogItems(query, limit, startingAfter, endingBefore, route, affinityVersion)

List catalog items

Lists the catalog items that are eligible for the authenticated account and mode.

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
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // 'all' | 'injectable' | 'nasal' | 'oral' | 'sublingual' | 'topical' | 'unknown' (optional)
    route: route_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-26,
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
| **startingAfter** | `string` |  | [Optional] [Defaults to `undefined`] |
| **endingBefore** | `string` |  | [Optional] [Defaults to `undefined`] |
| **route** | `all`, `injectable`, `nasal`, `oral`, `sublingual`, `topical`, `unknown` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, injectable, nasal, oral, sublingual, topical, unknown] |
| **affinityVersion** | `string` | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListCatalogItemsResponse**](ListCatalogItemsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **400** | Bad request |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **401** | Unauthorized |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **403** | Forbidden |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **429** | Too many requests |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **500** | Internal server error |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listShippingOptions

> ListShippingOptionsResponse listShippingOptions(catalogItemId, destinationState, destinationType, affinityVersion)

List shipping options

Lists reviewed shipping services eligible for a catalog item, destination, and API mode.

### Example

```ts
import {
  Configuration,
  CatalogApi,
} from '@affinity-health/sdk';
import type { ListShippingOptionsRequest } from '@affinity-health/sdk';

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
    // string
    catalogItemId: catalogItemId_example,
    // string
    destinationState: destinationState_example,
    // 'patient' | 'practice' (optional)
    destinationType: destinationType_example,
    // string | Optional per-request override for the service account\'s pinned API version. (optional)
    affinityVersion: 2026-07-26,
  } satisfies ListShippingOptionsRequest;

  try {
    const data = await api.listShippingOptions(body);
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
| **catalogItemId** | `string` |  | [Defaults to `undefined`] |
| **destinationState** | `string` |  | [Defaults to `undefined`] |
| **destinationType** | `patient`, `practice` |  | [Optional] [Defaults to `&#39;patient&#39;`] [Enum: patient, practice] |
| **affinityVersion** | `string` | Optional per-request override for the service account\&#39;s pinned API version. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListShippingOptionsResponse**](ListShippingOptionsResponse.md)

### Authorization

[bearerAuth](../README.md#bearerAuth), [affinityApiKey](../README.md#affinityApiKey)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`, `application/problem+json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **400** | Bad request |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **401** | Unauthorized |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **403** | Forbidden |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **404** | Not found |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **429** | Too many requests |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |
| **500** | Internal server error |  * Affinity-Version -  <br>  * RateLimit-Limit -  <br>  * RateLimit-Remaining -  <br>  * RateLimit-Reset -  <br>  * Request-Id -  <br>  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

