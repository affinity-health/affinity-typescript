# CreateProviderMappingRequest

## Properties

| Name           | Type                                                                                    |
| -------------- | --------------------------------------------------------------------------------------- |
| `attestations` | [CreateProviderMappingRequestAttestations](CreateProviderMappingRequestAttestations.md) |
| `credentials`  | string                                                                                  |
| `externalId`   | string                                                                                  |
| `name`         | string                                                                                  |
| `npi`          | string                                                                                  |
| `practiceId`   | string                                                                                  |
| `userId`       | string                                                                                  |

## Example

```typescript
import type { CreateProviderMappingRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  attestations: null,
  credentials: null,
  externalId: null,
  name: null,
  npi: null,
  practiceId: null,
  userId: null,
} satisfies CreateProviderMappingRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateProviderMappingRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
