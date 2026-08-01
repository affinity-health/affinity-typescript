# CreateOrderSigningSessionResponse

## Properties

| Name        | Type   |
| ----------- | ------ |
| `expiresAt` | Date   |
| `id`        | string |
| `object`    | string |
| `orderId`   | string |
| `url`       | string |

## Example

```typescript
import type { CreateOrderSigningSessionResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  expiresAt: null,
  id: null,
  object: null,
  orderId: null,
  url: null,
} satisfies CreateOrderSigningSessionResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderSigningSessionResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
