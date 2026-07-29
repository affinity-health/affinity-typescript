# CreateOrderRequestAnyOfPrescription

## Properties

| Name         | Type    |
| ------------ | ------- |
| `authorized` | boolean |
| `signedAt`   | Date    |

## Example

```typescript
import type { CreateOrderRequestAnyOfPrescription } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  authorized: null,
  signedAt: null,
} satisfies CreateOrderRequestAnyOfPrescription;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOfPrescription;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
