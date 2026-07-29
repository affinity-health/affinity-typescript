# CreatePortalSessionResponse

## Properties

| Name        | Type   |
| ----------- | ------ |
| `expiresAt` | Date   |
| `id`        | string |
| `object`    | string |
| `url`       | string |

## Example

```typescript
import type { CreatePortalSessionResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  expiresAt: null,
  id: null,
  object: null,
  url: null,
} satisfies CreatePortalSessionResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePortalSessionResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
