# CreatePrescriptionSigningSessionRequest

## Properties

| Name                | Type                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| `consent`           | [CreateComponentSessionRequestConsent](CreateComponentSessionRequestConsent.md) |
| `membershipId`      | string                                                                          |
| `practiceId`        | string                                                                          |
| `prescriptionId`    | string                                                                          |
| `providerMappingId` | string                                                                          |
| `returnUrl`         | string                                                                          |
| `userId`            | string                                                                          |

## Example

```typescript
import type { CreatePrescriptionSigningSessionRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  consent: null,
  membershipId: null,
  practiceId: null,
  prescriptionId: null,
  providerMappingId: null,
  returnUrl: null,
  userId: null,
} satisfies CreatePrescriptionSigningSessionRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePrescriptionSigningSessionRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
