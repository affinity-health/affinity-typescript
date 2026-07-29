# CreateHostedSessionRequest

## Properties

| Name                | Type                                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| `consent`           | [CreateComponentSessionRequestConsent](CreateComponentSessionRequestConsent.md) |
| `flow`              | string                                                                          |
| `membershipId`      | string                                                                          |
| `patientId`         | string                                                                          |
| `practiceId`        | string                                                                          |
| `providerMappingId` | string                                                                          |
| `returnUrl`         | string                                                                          |
| `userId`            | string                                                                          |

## Example

```typescript
import type { CreateHostedSessionRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  consent: null,
  flow: null,
  membershipId: null,
  patientId: null,
  practiceId: null,
  providerMappingId: null,
  returnUrl: null,
  userId: null,
} satisfies CreateHostedSessionRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateHostedSessionRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
