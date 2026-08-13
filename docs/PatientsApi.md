# PatientsApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                         | HTTP request                                                      | Description               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------- |
| [**createPatient**](PatientsApi.md#createpatientoperation)                     | **POST** /v1/practices/{practiceId}/patients                      | Create practice patient   |
| [**getPatient**](PatientsApi.md#getpatient)                                    | **GET** /v1/practices/{practiceId}/patients/{patientId}           | Read practice patient     |
| [**getPatientAllergies**](PatientsApi.md#getpatientallergies)                  | **GET** /v1/practices/{practiceId}/patients/{patientId}/allergies | Read patient allergies    |
| [**listPatients**](PatientsApi.md#listpatients)                                | **GET** /v1/practices/{practiceId}/patients                       | List practice patients    |
| [**replacePatientAllergies**](PatientsApi.md#replacepatientallergiesoperation) | **PUT** /v1/practices/{practiceId}/patients/{patientId}/allergies | Replace patient allergies |
| [**updatePatient**](PatientsApi.md#updatepatientoperation)                     | **PATCH** /v1/practices/{practiceId}/patients/{patientId}         | Update practice patient   |

## createPatient

> CreatePatientResponse createPatient(practiceId, idempotencyKey, createPatientRequest, affinityVersion, affinityActorId, affinityActorType)

Create practice patient

Creates or returns a synthetic or real patient by the platform\&#39;s stable external ID. Idempotency-Key is required.

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
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                     | Type                                            | Description | Notes                                |
| ------------------------ | ----------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**           | `string`                                        |             | [Defaults to `undefined`]            |
| **idempotencyKey**       | `string`                                        |             | [Defaults to `undefined`]            |
| **createPatientRequest** | [CreatePatientRequest](CreatePatientRequest.md) |             |                                      |
| **affinityVersion**      | `string`                                        |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**      | `string`                                        |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType**    | `string`                                        |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPatient

> GetPatientResponse getPatient(patientId, practiceId, affinityVersion, affinityActorId, affinityActorType)

Read practice patient

Returns one patient owned by the platform-managed practice.

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
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **patientId**         | `string` |             | [Defaults to `undefined`]            |
| **practiceId**        | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getPatientAllergies

> GetPatientAllergiesResponse getPatientAllergies(patientId, practiceId, affinityVersion, affinityActorId, affinityActorType)

Read patient allergies

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
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **patientId**         | `string` |             | [Defaults to `undefined`]            |
| **practiceId**        | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## listPatients

> ListPatientsResponse listPatients(practiceId, endingBefore, limit, query, startingAfter, affinityVersion, affinityActorId, affinityActorType)

List practice patients

Lists patients owned by one platform-managed practice in the current mode.

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
    // number (optional)
    limit: 56,
    // string (optional)
    query: query_example,
    // string (optional)
    startingAfter: startingAfter_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                  | Type     | Description | Notes                                |
| --------------------- | -------- | ----------- | ------------------------------------ |
| **practiceId**        | `string` |             | [Defaults to `undefined`]            |
| **endingBefore**      | `string` |             | [Optional] [Defaults to `undefined`] |
| **limit**             | `number` |             | [Optional] [Defaults to `25`]        |
| **query**             | `string` |             | [Optional] [Defaults to `undefined`] |
| **startingAfter**     | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityVersion**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**   | `string` |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType** | `string` |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## replacePatientAllergies

> ReplacePatientAllergiesResponse replacePatientAllergies(patientId, practiceId, idempotencyKey, replacePatientAllergiesRequest, affinityVersion, affinityActorId, affinityActorType)

Replace patient allergies

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
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                               | Type                                                                | Description | Notes                                |
| ---------------------------------- | ------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **patientId**                      | `string`                                                            |             | [Defaults to `undefined`]            |
| **practiceId**                     | `string`                                                            |             | [Defaults to `undefined`]            |
| **idempotencyKey**                 | `string`                                                            |             | [Defaults to `undefined`]            |
| **replacePatientAllergiesRequest** | [ReplacePatientAllergiesRequest](ReplacePatientAllergiesRequest.md) |             |                                      |
| **affinityVersion**                | `string`                                                            |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**                | `string`                                                            |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType**              | `string`                                                            |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## updatePatient

> UpdatePatientResponse updatePatient(patientId, practiceId, idempotencyKey, updatePatientRequest, affinityVersion, affinityActorId, affinityActorType)

Update practice patient

Updates one patient owned by the platform-managed practice.

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
    // string (optional)
    affinityActorId: affinityActorId_example,
    // string (optional)
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

| Name                     | Type                                            | Description | Notes                                |
| ------------------------ | ----------------------------------------------- | ----------- | ------------------------------------ |
| **patientId**            | `string`                                        |             | [Defaults to `undefined`]            |
| **practiceId**           | `string`                                        |             | [Defaults to `undefined`]            |
| **idempotencyKey**       | `string`                                        |             | [Defaults to `undefined`]            |
| **updatePatientRequest** | [UpdatePatientRequest](UpdatePatientRequest.md) |             |                                      |
| **affinityVersion**      | `string`                                        |             | [Optional] [Defaults to `undefined`] |
| **affinityActorId**      | `string`                                        |             | [Optional] [Defaults to `undefined`] |
| **affinityActorType**    | `string`                                        |             | [Optional] [Defaults to `undefined`] |

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
| **401**     | HTTP 401    | -                |
| **403**     | HTTP 403    | -                |
| **429**     | HTTP 429    | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
