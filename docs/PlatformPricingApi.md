# PlatformPricingApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                                                                  | HTTP request                                            | Description        |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------ |
| [**platformPublicApiSellingPricesReadSellingPrice**](PlatformPricingApi.md#platformpublicapisellingpricesreadsellingprice)              | **GET** /v1/catalog/items/{catalogItemId}/selling-price | Read selling price |
| [**platformPublicApiSellingPricesUpdateSellingPrice**](PlatformPricingApi.md#platformpublicapisellingpricesupdatesellingpriceoperation) | **PUT** /v1/catalog/items/{catalogItemId}/selling-price | Set selling price  |

## platformPublicApiSellingPricesReadSellingPrice

> PlatformPublicApiSellingPricesReadSellingPriceResponse platformPublicApiSellingPricesReadSellingPrice(catalogItemId, practiceId, affinityVersion)

Read selling price

Requires selling_prices:read. Omit practiceId for the platform default, or supply a managed practice. A null amount inherits the next applicable price. Amounts use the catalog pricing basis, in USD cents.

### Example

```ts
import { Configuration, PlatformPricingApi } from "@affinity-health/sdk";
import type { PlatformPublicApiSellingPricesReadSellingPriceRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformPricingApi(config);

  const body = {
    // string
    catalogItemId: cat_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies PlatformPublicApiSellingPricesReadSellingPriceRequest;

  try {
    const data = await api.platformPublicApiSellingPricesReadSellingPrice(body);
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
| **catalogItemId**   | `string` |             | [Defaults to `undefined`]            |
| **practiceId**      | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**PlatformPublicApiSellingPricesReadSellingPriceResponse**](PlatformPublicApiSellingPricesReadSellingPriceResponse.md)

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
| **404**     | HTTP 404    | -                |
| **409**     | HTTP 409    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## platformPublicApiSellingPricesUpdateSellingPrice

> PlatformPublicApiSellingPricesUpdateSellingPriceResponse platformPublicApiSellingPricesUpdateSellingPrice(catalogItemId, idempotencyKey, platformPublicApiSellingPricesUpdateSellingPriceRequest, affinityVersion)

Set selling price

Requires selling_prices:write. Sets a platform default or managed practice override in the current Test/Live mode. Send baseVersion from Read selling price. Null removes the override. Prices use the catalog pricing basis. This does not change the platform\&#39;s Affinity purchase price or collect practice payments.

### Example

```ts
import {
  Configuration,
  PlatformPricingApi,
} from '@affinity-health/sdk';
import type { PlatformPublicApiSellingPricesUpdateSellingPriceOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PlatformPricingApi(config);

  const body = {
    // string
    catalogItemId: cat_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    idempotencyKey: idempotencyKey_example,
    // PlatformPublicApiSellingPricesUpdateSellingPriceRequest
    platformPublicApiSellingPricesUpdateSellingPriceRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies PlatformPublicApiSellingPricesUpdateSellingPriceOperationRequest;

  try {
    const data = await api.platformPublicApiSellingPricesUpdateSellingPrice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                                        | Type                                                                                                                  | Description | Notes                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **catalogItemId**                                           | `string`                                                                                                              |             | [Defaults to `undefined`]            |
| **idempotencyKey**                                          | `string`                                                                                                              |             | [Defaults to `undefined`]            |
| **platformPublicApiSellingPricesUpdateSellingPriceRequest** | [PlatformPublicApiSellingPricesUpdateSellingPriceRequest](PlatformPublicApiSellingPricesUpdateSellingPriceRequest.md) |             |                                      |
| **affinityVersion**                                         | `string`                                                                                                              |             | [Optional] [Defaults to `undefined`] |

### Return type

[**PlatformPublicApiSellingPricesUpdateSellingPriceResponse**](PlatformPublicApiSellingPricesUpdateSellingPriceResponse.md)

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
