# GetProviderMappingResponse

## Properties

| Name         | Type    |
| ------------ | ------- |
| `createdAt`  | Date    |
| `externalId` | string  |
| `id`         | string  |
| `livemode`   | boolean |
| `npi`        | string  |
| `object`     | string  |
| `practiceId` | string  |
| `status`     | string  |
| `updatedAt`  | Date    |
| `userId`     | string  |
| `verifiedAt` | Date    |

## Example

```typescript
import type { GetProviderMappingResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  externalId: null,
  id: null,
  livemode: null,
  npi: null,
  object: null,
  practiceId: null,
  status: null,
  updatedAt: null,
  userId: null,
  verifiedAt: null,
} satisfies GetProviderMappingResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetProviderMappingResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
