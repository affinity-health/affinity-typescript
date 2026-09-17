# CatalogApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                     | HTTP request                                                  | Description                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------- |
| [**listCatalogItems**](CatalogApi.md#listcatalogitems)                     | **GET** /v1/catalog/items                                     | List catalog items           |
| [**listPharmacies**](CatalogApi.md#listpharmacies)                         | **GET** /v1/pharmacies                                        | List pharmacies              |
| [**listShippingOptions**](CatalogApi.md#listshippingoptions)               | **GET** /v1/catalog/items/{catalogItemId}/shipping-options    | List shipping options        |
| [**retrievePrescribingOptions**](CatalogApi.md#retrieveprescribingoptions) | **GET** /v1/catalog/items/{catalogItemId}/prescribing-options | Retrieve prescribing options |

## listCatalogItems

> ListCatalogItemsResponse listCatalogItems(catalogKind, sort, catalogItemId, availability, pharmacyIds, dosageForms, endingBefore, hideControlledSubstances, hideUnpriced, limit, orgId, practiceId, query, requirement, routes, startingAfter, affinityVersion)

List catalog items

Lists catalog items for the authenticated account and mode. When practiceId is supplied, a practice price overrides the platform price and missing overrides inherit the platform price.

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
    // 'prescription' | 'otc' (optional)
    catalogKind: catalogKind_example,
    // 'relevance' | 'name_asc' | 'name_desc' (optional)
    sort: sort_example,
    // string (optional)
    catalogItemId: cat_01j2y8m6jcc9tt24af5pw9x1bc,
    // 'all' | 'orderable' | 'unavailable' (optional)
    availability: availability_example,
    // ListCatalogItemsPharmacyIdsParameter (optional)
    pharmacyIds: ...,
    // ListCatalogItemsDosageFormsParameter (optional)
    dosageForms: ...,
    // string (optional)
    endingBefore: cat_01j2y8m6jcc9tt24af5pw9x1bc,
    // boolean (optional)
    hideControlledSubstances: true,
    // boolean (optional)
    hideUnpriced: true,
    // number (optional)
    limit: 56,
    // string (optional)
    orgId: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    query: query_example,
    // 'all' | 'office_use' | 'patient_specific' (optional)
    requirement: requirement_example,
    // ListCatalogItemsRoutesParameter (optional)
    routes: ...,
    // string (optional)
    startingAfter: cat_01j2y8m6jcc9tt24af5pw9x1bc,
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

| Name                         | Type                                    | Description | Notes                                                                          |
| ---------------------------- | --------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| **catalogKind**              | `prescription`, `otc`                   |             | [Optional] [Defaults to `undefined`] [Enum: prescription, otc]                 |
| **sort**                     | `relevance`, `name_asc`, `name_desc`    |             | [Optional] [Defaults to `undefined`] [Enum: relevance, name_asc, name_desc]    |
| **catalogItemId**            | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **availability**             | `all`, `orderable`, `unavailable`       |             | [Optional] [Defaults to `undefined`] [Enum: all, orderable, unavailable]       |
| **pharmacyIds**              | [](.md)                                 |             | [Optional] [Defaults to `undefined`]                                           |
| **dosageForms**              | [](.md)                                 |             | [Optional] [Defaults to `undefined`]                                           |
| **endingBefore**             | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **hideControlledSubstances** | `boolean`                               |             | [Optional] [Defaults to `undefined`]                                           |
| **hideUnpriced**             | `boolean`                               |             | [Optional] [Defaults to `undefined`]                                           |
| **limit**                    | `number`                                |             | [Optional] [Defaults to `25`]                                                  |
| **orgId**                    | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **practiceId**               | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **query**                    | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **requirement**              | `all`, `office_use`, `patient_specific` |             | [Optional] [Defaults to `undefined`] [Enum: all, office_use, patient_specific] |
| **routes**                   | [](.md)                                 |             | [Optional] [Defaults to `undefined`]                                           |
| **startingAfter**            | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |
| **affinityVersion**          | `string`                                |             | [Optional] [Defaults to `undefined`]                                           |

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
| **400**     | HTTP 400    | -                |
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPharmacies

> ListPharmaciesResponse listPharmacies(endingBefore, limit, orgId, pharmacyId, query, shipsToState, startingAfter, affinityVersion)

List pharmacies

Lists pharmacies available to the authenticated account, including approved invite-only relationships.

### Example

```ts
import { Configuration, CatalogApi } from "@affinity-health/sdk";
import type { ListPharmaciesRequest } from "@affinity-health/sdk";

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
    endingBefore: pharm_01j2y8m6jcc9tt24af5pw9x1bc,
    // number (optional)
    limit: 56,
    // string (optional)
    orgId: acct_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    pharmacyId: pharm_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    query: query_example,
    // string (optional)
    shipsToState: shipsToState_example,
    // string (optional)
    startingAfter: pharm_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies ListPharmaciesRequest;

  try {
    const data = await api.listPharmacies(body);
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
| **endingBefore**    | `string` |             | [Optional] [Defaults to `undefined`] |
| **limit**           | `number` |             | [Optional] [Defaults to `25`]        |
| **orgId**           | `string` |             | [Optional] [Defaults to `undefined`] |
| **pharmacyId**      | `string` |             | [Optional] [Defaults to `undefined`] |
| **query**           | `string` |             | [Optional] [Defaults to `undefined`] |
| **shipsToState**    | `string` |             | [Optional] [Defaults to `undefined`] |
| **startingAfter**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**ListPharmaciesResponse**](ListPharmaciesResponse.md)

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

## listShippingOptions

> Array&lt;ListShippingOptionsResponseInner&gt; listShippingOptions(catalogItemId, destinationState, destinationType, affinityVersion)

List shipping options

Returns at most 50 reviewed shipping services eligible for a catalog item, destination, and API mode.

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
    catalogItemId: cat_01j2y8m6jcc9tt24af5pw9x1bc,
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

[**Array&lt;ListShippingOptionsResponseInner&gt;**](ListShippingOptionsResponseInner.md)

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

## retrievePrescribingOptions

> RetrievePrescribingOptionsResponse retrievePrescribingOptions(catalogItemId, practiceId, affinityVersion)

Retrieve prescribing options

Requires catalog:read. Returns reviewed SIG presets, guided patterns, quantity constraints and product requirements for a practice and mode. Revisions identify changed defaults. No patient-specific rationale or diagnosis is inferred.

### Example

```ts
import { Configuration, CatalogApi } from "@affinity-health/sdk";
import type { RetrievePrescribingOptionsRequest } from "@affinity-health/sdk";

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
    catalogItemId: cat_01j2y8m6jcc9tt24af5pw9x1bc,
    // string
    practiceId: prac_01j2y8m6jcc9tt24af5pw9x1bc,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies RetrievePrescribingOptionsRequest;

  try {
    const data = await api.retrievePrescribingOptions(body);
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
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**RetrievePrescribingOptionsResponse**](RetrievePrescribingOptionsResponse.md)

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
