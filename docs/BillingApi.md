# BillingApi

All URIs are relative to *https://api.joinaffinityai.com*

| Method                                                                                  | HTTP request                                                       | Description                   |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------- |
| [**completePracticePaymentSetup**](BillingApi.md#completepracticepaymentsetupoperation) | **POST** /v1/practices/{practiceId}/payment-profile/setup/complete | Complete practice card setup  |
| [**createPracticePaymentSetup**](BillingApi.md#createpracticepaymentsetupoperation)     | **POST** /v1/practices/{practiceId}/payment-profile/setup          | Start practice card setup     |
| [**getPracticePaymentProfile**](BillingApi.md#getpracticepaymentprofile)                | **GET** /v1/practices/{practiceId}/payment-profile                 | Read practice payment profile |

## completePracticePaymentSetup

> CompletePracticePaymentSetupResponse completePracticePaymentSetup(practiceId, idempotencyKey, completePracticePaymentSetupRequest, affinityVersion)

Complete practice card setup

Finalizes a succeeded Stripe SetupIntent and makes its card the practice\&#39;s primary payment method.

### Example

```ts
import {
  Configuration,
  BillingApi,
} from '@affinity-health/sdk';
import type { CompletePracticePaymentSetupOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new BillingApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CompletePracticePaymentSetupRequest
    completePracticePaymentSetupRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CompletePracticePaymentSetupOperationRequest;

  try {
    const data = await api.completePracticePaymentSetup(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                    | Type                                                                          | Description | Notes                                |
| --------------------------------------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                          | `string`                                                                      |             | [Defaults to `undefined`]            |
| **idempotencyKey**                      | `string`                                                                      |             | [Defaults to `undefined`]            |
| **completePracticePaymentSetupRequest** | [CompletePracticePaymentSetupRequest](CompletePracticePaymentSetupRequest.md) |             |                                      |
| **affinityVersion**                     | `string`                                                                      |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CompletePracticePaymentSetupResponse**](CompletePracticePaymentSetupResponse.md)

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

## createPracticePaymentSetup

> CreatePracticePaymentSetupResponse createPracticePaymentSetup(practiceId, idempotencyKey, createPracticePaymentSetupRequest, affinityVersion)

Start practice card setup

Starts Stripe card setup after the practice accepts the current off-session collection terms.

### Example

```ts
import {
  Configuration,
  BillingApi,
} from '@affinity-health/sdk';
import type { CreatePracticePaymentSetupOperationRequest } from '@affinity-health/sdk';

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new BillingApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string
    idempotencyKey: idempotencyKey_example,
    // CreatePracticePaymentSetupRequest
    createPracticePaymentSetupRequest: ...,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies CreatePracticePaymentSetupOperationRequest;

  try {
    const data = await api.createPracticePaymentSetup(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name                                  | Type                                                                      | Description | Notes                                |
| ------------------------------------- | ------------------------------------------------------------------------- | ----------- | ------------------------------------ |
| **practiceId**                        | `string`                                                                  |             | [Defaults to `undefined`]            |
| **idempotencyKey**                    | `string`                                                                  |             | [Defaults to `undefined`]            |
| **createPracticePaymentSetupRequest** | [CreatePracticePaymentSetupRequest](CreatePracticePaymentSetupRequest.md) |             |                                      |
| **affinityVersion**                   | `string`                                                                  |             | [Optional] [Defaults to `undefined`] |

### Return type

[**CreatePracticePaymentSetupResponse**](CreatePracticePaymentSetupResponse.md)

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

## getPracticePaymentProfile

> GetPracticePaymentProfileResponse getPracticePaymentProfile(practiceId, affinityVersion)

Read practice payment profile

Returns payment-method readiness for this practice in the current mode.

### Example

```ts
import { Configuration, BillingApi } from "@affinity-health/sdk";
import type { GetPracticePaymentProfileRequest } from "@affinity-health/sdk";

async function example() {
  console.log("🚀 Testing @affinity-health/sdk SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearerAuth
    accessToken: "YOUR BEARER TOKEN",
    // To configure API key authorization: affinityApiKey
    apiKey: "YOUR API KEY",
  });
  const api = new BillingApi(config);

  const body = {
    // string
    practiceId: practiceId_example,
    // string (optional)
    affinityVersion: affinityVersion_example,
  } satisfies GetPracticePaymentProfileRequest;

  try {
    const data = await api.getPracticePaymentProfile(body);
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
| **practiceId**      | `string` |             | [Defaults to `undefined`]            |
| **affinityVersion** | `string` |             | [Optional] [Defaults to `undefined`] |

### Return type

[**GetPracticePaymentProfileResponse**](GetPracticePaymentProfileResponse.md)

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
