# CreateComponentSessionRequest

## Properties

| Name                | Type                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- |
| `allowedOrigin`     | string                                                                                |
| `components`        | [CreateComponentSessionRequestComponents](CreateComponentSessionRequestComponents.md) |
| `consent`           | [CreateComponentSessionRequestConsent](CreateComponentSessionRequestConsent.md)       |
| `context`           | [CreateComponentSessionRequestContext](CreateComponentSessionRequestContext.md)       |
| `membershipId`      | string                                                                                |
| `practiceId`        | string                                                                                |
| `providerMappingId` | string                                                                                |
| `userId`            | string                                                                                |

## Example

```typescript
import type { CreateComponentSessionRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  allowedOrigin: null,
  components: null,
  consent: null,
  context: null,
  membershipId: null,
  practiceId: null,
  providerMappingId: null,
  userId: null,
} satisfies CreateComponentSessionRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateComponentSessionRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
