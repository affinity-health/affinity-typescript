# PatientsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                         | HTTP request                                                                          | Description                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------- |
| [**archivePatientAddress**](PatientsApi.md#archivepatientaddress)              | **DELETE** /v1/practices/{practiceId}/patients/{patientId}/addresses/{addressId}      | Archive delivery address     |
| [**createPatient**](PatientsApi.md#createpatientoperation)                     | **POST** /v1/practices/{practiceId}/patients                                          | Create patient               |
| [**createPatientAddress**](PatientsApi.md#createpatientaddressoperation)       | **POST** /v1/practices/{practiceId}/patients/{patientId}/addresses                    | Save delivery address        |
| [**deletePatient**](PatientsApi.md#deletepatient)                              | **DELETE** /v1/practices/{practiceId}/patients/{patientId}                            | Delete patient               |
| [**getPatient**](PatientsApi.md#getpatient)                                    | **GET** /v1/practices/{practiceId}/patients/{patientId}                               | Read patient                 |
| [**getPatientAllergies**](PatientsApi.md#getpatientallergies)                  | **GET** /v1/practices/{practiceId}/patients/{patientId}/allergies                     | Read allergies               |
| [**listPatientAddresses**](PatientsApi.md#listpatientaddresses)                | **GET** /v1/practices/{practiceId}/patients/{patientId}/addresses                     | List delivery addresses      |
| [**listPatients**](PatientsApi.md#listpatients)                                | **GET** /v1/practices/{practiceId}/patients                                           | List patients                |
| [**replacePatientAllergies**](PatientsApi.md#replacepatientallergiesoperation) | **PUT** /v1/practices/{practiceId}/patients/{patientId}/allergies                     | Replace allergies            |
| [**setDefaultPatientAddress**](PatientsApi.md#setdefaultpatientaddress)        | **PUT** /v1/practices/{practiceId}/patients/{patientId}/addresses/{addressId}/default | Set default delivery address |
| [**updatePatient**](PatientsApi.md#updatepatientoperation)                     | **PATCH** /v1/practices/{practiceId}/patients/{patientId}                             | Update patient               |
| [**updatePatientAddress**](PatientsApi.md#updatepatientaddressoperation)       | **PATCH** /v1/practices/{practiceId}/patients/{patientId}/addresses/{addressId}       | Update delivery address      |

## archivePatientAddress

> ArchivePatientAddressResponse archivePatientAddress(practiceId, patientId, addressId, idempotencyKey, affinityVersion, affinityActorId, affinityActorType)

Archive delivery address

Preserves the address ID and history. Archiving the default selects the oldest remaining active address. Existing orders remain unchanged.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { ArchivePatientAddressRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    patientId: patientId_example,
    // string
    addressId: addressId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies ArchivePatientAddressRequest;

  try {
    const data = await api.archivePatientAddress(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**        | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **patientId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **addressId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**    | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**ArchivePatientAddressResponse**](ArchivePatientAddressResponse.md)

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

## createPatient

> CreatePatientResponse createPatient(practiceId, idempotencyKey, createPatientRequest, affinityVersion, affinityActorId, affinityActorType)

Create patient

Creates a patient or resolves a matching externalId or external identity within this practice and mode. externalId belongs to the calling integration; externalIdentities holds aliases from other systems. Resolution preserves existing demographics; use PATCH to update them. Conflicting identifiers return 409. Email never merges patients. API keys require Idempotency-Key.

### Example

```ts
import {
  Configuration,
  PatientsApi,
} from '@affinity-health/sdk';
import type { CreatePatientOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePatientRequest
    createPatientRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies CreatePatientOperationRequest;

  try {
    const data = await api.createPatient(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                     | Type                                            | Description                                                                                                                                  | Notes                                |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**           | `string`                                        |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**       | `string`                                        |                                                                                                                                              | [Defaults to `undefined`]            |
| **createPatientRequest** | [CreatePatientRequest](CreatePatientRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**      | `string`                                        |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**      | `string`                                        | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**    | `string`                                        | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePatientResponse**](CreatePatientResponse.md)

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

## createPatientAddress

> CreatePatientAddressResponse createPatientAddress(practiceId, patientId, idempotencyKey, createPatientAddressRequest, affinityVersion, affinityActorId, affinityActorType)

Save delivery address

Returns the existing active address for a normalized duplicate. The first address becomes the default. API keys require Idempotency-Key.

### Example

```ts
import {
  Configuration,
  PatientsApi,
} from '@affinity-health/sdk';
import type { CreatePatientAddressOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    patientId: patientId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePatientAddressRequest
    createPatientAddressRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies CreatePatientAddressOperationRequest;

  try {
    const data = await api.createPatientAddress(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                            | Type                                                          | Description                                                                                                                                  | Notes                                |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**                  | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **patientId**                   | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**              | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **createPatientAddressRequest** | [CreatePatientAddressRequest](CreatePatientAddressRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**             | `string`                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**             | `string`                                                      | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**           | `string`                                                      | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePatientAddressResponse**](CreatePatientAddressResponse.md)

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

## deletePatient

> DeletePatientResponse deletePatient(patientId, practiceId, idempotencyKey, affinityVersion, affinityActorId, affinityActorType)

Delete patient

Requires patients:write and Idempotency-Key for API keys. Permanently deletes a patient with no order history. Any order history returns 409; use Update patient with status archived instead. Available to practice keys and authorized platform keys. Reusing the same idempotency key returns the original deletion result.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { DeletePatientRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    patientId: patientId_example,
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies DeletePatientRequest;

  try {
    const data = await api.deletePatient(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **patientId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **practiceId**        | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**    | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**DeletePatientResponse**](DeletePatientResponse.md)

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

## getPatient

> GetPatientResponse getPatient(patientId, practiceId, affinityVersion, affinityActorId, affinityActorType)

Read patient

Returns one patient in the authorized practice and mode.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { GetPatientRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    patientId: patientId_example,
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies GetPatientRequest;

  try {
    const data = await api.getPatient(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **patientId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **practiceId**        | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPatientResponse**](GetPatientResponse.md)

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

## getPatientAllergies

> GetPatientAllergiesResponse getPatientAllergies(patientId, practiceId, affinityVersion, affinityActorId, affinityActorType)

Read allergies

Returns the patient\&#39;s structured allergy entries and review status. A not_reviewed status is not a no-known-allergies assertion and blocks clinical review and signing.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { GetPatientAllergiesRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    patientId: patientId_example,
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies GetPatientAllergiesRequest;

  try {
    const data = await api.getPatientAllergies(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **patientId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **practiceId**        | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPatientAllergiesResponse**](GetPatientAllergiesResponse.md)

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

## listPatientAddresses

> ListPatientAddressesResponse listPatientAddresses(practiceId, patientId, status, startingAfter, endingBefore, limit, affinityVersion, affinityActorId, affinityActorType)

List delivery addresses

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { ListPatientAddressesRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    patientId: patientId_example,
    // 'active' | 'archived' | 'all' (optional)
    status: status_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // number (optional)
    limit: 56,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies ListPatientAddressesRequest;

  try {
    const data = await api.listPatientAddresses(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type                        | Description                                                                                                                                  | Notes                                                              |
| --------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **practiceId**        | `string`                    |                                                                                                                                              | [Defaults to `undefined`]                                          |
| **patientId**         | `string`                    |                                                                                                                                              | [Defaults to `undefined`]                                          |
| **status**            | `active`, `archived`, `all` |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: active, archived, all] |
| **startingAfter**     | `string`                    |                                                                                                                                              | [Optional] [Defaults to `undefined`]                               |
| **endingBefore**      | `string`                    |                                                                                                                                              | [Optional] [Defaults to `undefined`]                               |
| **limit**             | `number`                    |                                                                                                                                              | [Optional] [Defaults to `25`]                                      |
| **affinityVersion**   | `string`                    |                                                                                                                                              | [Optional] [Defaults to `undefined`]                               |
| **affinityActorId**   | `string`                    | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`]                               |
| **affinityActorType** | `string`                    | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`]                               |

### Return type

[**ListPatientAddressesResponse**](ListPatientAddressesResponse.md)

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

## listPatients

> ListPatientsResponse listPatients(practiceId, endingBefore, externalId, externalIdentitySource, externalIdentityValue, gender, lastOrderAfter, lastOrderBefore, limit, program, query, sort, startingAfter, states, status, affinityVersion, affinityActorId, affinityActorType)

List patients

Lists patients in one practice and mode. Use externalId for an exact match in the calling integration\&#39;s namespace. Use externalIdentitySource with externalIdentityValue to search an explicit alias. Identity matching is case-sensitive after trimming whitespace. Other filters also apply.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { ListPatientsRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string (optional)
    endingBefore: endingBefore_example,
    // string (optional)
    externalId: externalId_example,
    // string (optional)
    externalIdentitySource: externalIdentitySource_example,
    // string (optional)
    externalIdentityValue: externalIdentityValue_example,
    // 'f' | 'm' | 'o' | 'u' (optional)
    gender: gender_example,
    // string (optional)
    lastOrderAfter: lastOrderAfter_example,
    // string (optional)
    lastOrderBefore: lastOrderBefore_example,
    // number (optional)
    limit: 56,
    // string (optional)
    program: program_example,
    // string (optional)
    query: query_example,
    // 'created' | 'name' (optional)
    sort: sort_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    states: states_example,
    // 'active' | 'inactive' (optional)
    status: status_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies ListPatientsRequest;

  try {
    const data = await api.listPatients(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                       | Type                 | Description                                                                                                                                  | Notes                                                         |
| -------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **practiceId**             | `string`             |                                                                                                                                              | [Defaults to `undefined`]                                     |
| **endingBefore**           | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **externalId**             | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **externalIdentitySource** | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **externalIdentityValue**  | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **gender**                 | `f`, `m`, `o`, `u`   |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: f, m, o, u]       |
| **lastOrderAfter**         | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **lastOrderBefore**        | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **limit**                  | `number`             |                                                                                                                                              | [Optional] [Defaults to `25`]                                 |
| **program**                | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **query**                  | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **sort**                   | `created`, `name`    |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: created, name]    |
| **startingAfter**          | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **states**                 | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **status**                 | `active`, `inactive` |                                                                                                                                              | [Optional] [Defaults to `undefined`] [Enum: active, inactive] |
| **affinityVersion**        | `string`             |                                                                                                                                              | [Optional] [Defaults to `undefined`]                          |
| **affinityActorId**        | `string`             | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`]                          |
| **affinityActorType**      | `string`             | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`]                          |

### Return type

[**ListPatientsResponse**](ListPatientsResponse.md)

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

## replacePatientAllergies

> ReplacePatientAllergiesResponse replacePatientAllergies(patientId, practiceId, idempotencyKey, replacePatientAllergiesRequest, affinityVersion, affinityActorId, affinityActorType)

Replace allergies

Replaces the patient\&#39;s structured allergy record. Sending no_known is the explicit no-known-allergies acknowledgement; recorded requires at least one entry. Idempotency-Key is required.

### Example

```ts
import {
  Configuration,
  PatientsApi,
} from '@affinity-health/sdk';
import type { ReplacePatientAllergiesOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    patientId: patientId_example,
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // ReplacePatientAllergiesRequest
    replacePatientAllergiesRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies ReplacePatientAllergiesOperationRequest;

  try {
    const data = await api.replacePatientAllergies(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                               | Type                                                                | Description                                                                                                                                  | Notes                                |
| ---------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **patientId**                      | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **practiceId**                     | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**                 | `string`                                                            |                                                                                                                                              | [Defaults to `undefined`]            |
| **replacePatientAllergiesRequest** | [ReplacePatientAllergiesRequest](ReplacePatientAllergiesRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**                | `string`                                                            |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**                | `string`                                                            | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**              | `string`                                                            | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**ReplacePatientAllergiesResponse**](ReplacePatientAllergiesResponse.md)

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

## setDefaultPatientAddress

> SetDefaultPatientAddressResponse setDefaultPatientAddress(practiceId, patientId, addressId, idempotencyKey, affinityVersion, affinityActorId, affinityActorType)

Set default delivery address

Changes delivery selection for future drafts, without changing patient clinical location or existing signed orders.

### Example

```ts
import { Configuration, PatientsApi } from "@affinity-health/sdk";
import type { SetDefaultPatientAddressRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    patientId: patientId_example,
    // string
    addressId: addressId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies SetDefaultPatientAddressRequest;

  try {
    const data = await api.setDefaultPatientAddress(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                  | Type     | Description                                                                                                                                  | Notes                                |
| --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**        | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **patientId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **addressId**         | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**    | `string` |                                                                                                                                              | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**SetDefaultPatientAddressResponse**](SetDefaultPatientAddressResponse.md)

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

## updatePatient

> UpdatePatientResponse updatePatient(patientId, practiceId, idempotencyKey, updatePatientRequest, affinityVersion, affinityActorId, affinityActorType)

Update patient

Updates a patient in the current practice and mode. Omitted fields remain unchanged; null clears an optional field. externalId updates the calling integration\&#39;s identifier. externalIdentities replaces its explicit aliases. Identifiers cannot be reassigned from another patient. API keys require Idempotency-Key.

### Example

```ts
import {
  Configuration,
  PatientsApi,
} from '@affinity-health/sdk';
import type { UpdatePatientOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    patientId: patientId_example,
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePatientRequest
    updatePatientRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies UpdatePatientOperationRequest;

  try {
    const data = await api.updatePatient(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                     | Type                                            | Description                                                                                                                                  | Notes                                |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **patientId**            | `string`                                        |                                                                                                                                              | [Defaults to `undefined`]            |
| **practiceId**           | `string`                                        |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**       | `string`                                        |                                                                                                                                              | [Defaults to `undefined`]            |
| **updatePatientRequest** | [UpdatePatientRequest](UpdatePatientRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**      | `string`                                        |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**      | `string`                                        | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**    | `string`                                        | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePatientResponse**](UpdatePatientResponse.md)

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

## updatePatientAddress

> UpdatePatientAddressResponse updatePatientAddress(practiceId, patientId, addressId, idempotencyKey, updatePatientAddressRequest, affinityVersion, affinityActorId, affinityActorType)

Update delivery address

### Example

```ts
import {
  Configuration,
  PatientsApi,
} from '@affinity-health/sdk';
import type { UpdatePatientAddressOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new PatientsApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    patientId: patientId_example,
    // string
    addressId: addressId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // UpdatePatientAddressRequest
    updatePatientAddressRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. (optional)
    affinityActorId: affinityActorId_example,
    // string | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system. (optional)
    affinityActorType: affinityActorType_example,
  } satisfies UpdatePatientAddressOperationRequest;

  try {
    const data = await api.updatePatientAddress(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                            | Type                                                          | Description                                                                                                                                  | Notes                                |
| ------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **practiceId**                  | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **patientId**                   | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **addressId**                   | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **idempotencyKey**              | `string`                                                      |                                                                                                                                              | [Defaults to `undefined`]            |
| **updatePatientAddressRequest** | [UpdatePatientAddressRequest](UpdatePatientAddressRequest.md) |                                                                                                                                              |                                      |
| **affinityVersion**             | `string`                                                      |                                                                                                                                              | [Optional] [Defaults to `undefined`] |
| **affinityActorId**             | `string`                                                      | Required for user actors and optional for system actors. Omit both actor headers to use the authenticated service account as a system actor. | [Optional] [Defaults to `undefined`] |
| **affinityActorType**           | `string`                                                      | Use user when a person initiated the action and system for autonomous work. Omit both actor headers to default to system.                    | [Optional] [Defaults to `undefined`] |

### Return type

[**UpdatePatientAddressResponse**](UpdatePatientAddressResponse.md)

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
