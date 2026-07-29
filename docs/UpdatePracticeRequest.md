# UpdatePracticeRequest

## Properties

| Name                | Type                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `address`           | [CreateOrderRequestAnyOfPatientAddress](CreateOrderRequestAnyOfPatientAddress.md)              |
| `attestations`      | [CreatePracticeRequestAttestations](CreatePracticeRequestAttestations.md)                      |
| `complianceContact` | [CreatePracticeRequestComplianceContact](CreatePracticeRequestComplianceContact.md)            |
| `externalId`        | string                                                                                         |
| `legalName`         | string                                                                                         |
| `metadata`          | { [key: string]: any; }                                                                        |
| `name`              | string                                                                                         |
| `prescribers`       | [Array&lt;CreatePracticeRequestPrescribersInner&gt;](CreatePracticeRequestPrescribersInner.md) |
| `primaryContact`    | [CreatePracticeRequestComplianceContact](CreatePracticeRequestComplianceContact.md)            |
| `supportEmail`      | string                                                                                         |
| `supportPhone`      | string                                                                                         |
| `timezone`          | string                                                                                         |

## Example

```typescript
import type { UpdatePracticeRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  address: null,
  attestations: null,
  complianceContact: null,
  externalId: null,
  legalName: null,
  metadata: null,
  name: null,
  prescribers: null,
  primaryContact: null,
  supportEmail: null,
  supportPhone: null,
  timezone: null,
} satisfies UpdatePracticeRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePracticeRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
