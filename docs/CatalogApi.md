# CatalogApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                       | HTTP request                                               | Description                |
| ------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------- |
| [**listCatalogItems**](CatalogApi.md#listcatalogitems)       | **GET** /v1/catalog/items                                  | List catalog items         |
| [**listCompounders**](CatalogApi.md#listcompounders)         | **GET** /v1/compounders                                    | List available compounders |
| [**listShippingOptions**](CatalogApi.md#listshippingoptions) | **GET** /v1/catalog/items/{catalogItemId}/shipping-options | List shipping options      |

## listCatalogItems

> ListCatalogItemsResponse listCatalogItems(availability, compounderIds, dosageForms, endingBefore, limit, orgId, query, requirement, route, startingAfter, affinityVersion)

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
    // 'all' | 'orderable' | 'unavailable' (optional)
    availability: availability_example,
    // ListCatalogItemsCompounderIdsParameter (optional)
    compounderIds: ...,
    // ListCatalogItemsDosageFormsParameter (optional)
    dosageForms: ...,
    // string (optional)
    endingBefore: endingBefore_example,
    // ListCatalogItemsLimitParameter (optional)
    limit: ...,
    // string (optional)
    orgId: orgId_example,
    // string (optional)
    query: query_example,
    // 'all' | 'office_use' | 'patient_specific' (optional)
    requirement: requirement_example,
    // 'all' | 'injectable' | 'nasal' | 'oral' | 'sublingual' | 'topical' | 'unknown' (optional)
    route: route_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
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

| Name                | Type                                                                     | Description | Notes                                                                                                   |
| ------------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| **availability**    | `all`, `orderable`, `unavailable`                                        |             | [Optional] [Defaults to `undefined`] [Enum: all, orderable, unavailable]                                |
| **compounderIds**   | [](.md)                                                                  |             | [Optional] [Defaults to `undefined`]                                                                    |
| **dosageForms**     | [](.md)                                                                  |             | [Optional] [Defaults to `undefined`]                                                                    |
| **endingBefore**    | `string`                                                                 |             | [Optional] [Defaults to `undefined`]                                                                    |
| **limit**           | [](.md)                                                                  |             | [Optional] [Defaults to `undefined`]                                                                    |
| **orgId**           | `string`                                                                 |             | [Optional] [Defaults to `undefined`]                                                                    |
| **query**           | `string`                                                                 |             | [Optional] [Defaults to `undefined`]                                                                    |
| **requirement**     | `all`, `office_use`, `patient_specific`                                  |             | [Optional] [Defaults to `undefined`] [Enum: all, office_use, patient_specific]                          |
| **route**           | `all`, `injectable`, `nasal`, `oral`, `sublingual`, `topical`, `unknown` |             | [Optional] [Defaults to `undefined`] [Enum: all, injectable, nasal, oral, sublingual, topical, unknown] |
| **startingAfter**   | `string`                                                                 |             | [Optional] [Defaults to `undefined`]                                                                    |
| **affinityVersion** | `string`                                                                 |             | [Optional] [Defaults to `undefined`]                                                                    |

### Return type

[**ListCatalogItemsResponse**](ListCatalogItemsResponse.md)

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

## listCompounders

> ListCompoundersResponse listCompounders(orgId, query, affinityVersion)

List available compounders

Lists compounders available to the authenticated account, including approved invite-only relationships.

### Example

```ts
import { Configuration, CatalogApi } from "@affinity-health/sdk";
import type { ListCompoundersRequest } from "@affinity-health/sdk";

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
    orgId: orgId_example,
    // string (optional)
    query: query_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListCompoundersRequest;

  try {
    const data = await api.listCompounders(body);
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
| **query**           | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListCompoundersResponse**](ListCompoundersResponse.md)

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

## listShippingOptions

> ListShippingOptionsResponse listShippingOptions(catalogItemId, destinationState, destinationType, affinityVersion)

List shipping options

Lists reviewed shipping services eligible for a catalog item, destination, and API mode.

### Example

```ts
import { Configuration, CatalogApi } from "@affinity-health/sdk";
import type { ListShippingOptionsRequest } from "@affinity-health/sdk";

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
    // string (optional)
    affinityVersion: affinityVersion_example,
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

| Name                 | Type                  | Description | Notes                                                          |
| -------------------- | --------------------- | ----------- | -------------------------------------------------------------- |
| **catalogItemId**    | `string`              |             | [Defaults to `undefined`]                                      |
| **destinationState** | `string`              |             | [Defaults to `undefined`]                                      |
| **destinationType**  | `patient`, `practice` |             | [Optional] [Defaults to `undefined`] [Enum: patient, practice] |
| **affinityVersion**  | `string`              |             | [Optional] [Defaults to `undefined`]                           |

### Return type

[**ListShippingOptionsResponse**](ListShippingOptionsResponse.md)

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
