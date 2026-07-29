# SubmitOrderRequest

## Properties

| Name               | Type   |
| ------------------ | ------ |
| `shippingOptionId` | string |

## Example

```typescript
import type { SubmitOrderRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  shippingOptionId: null,
} satisfies SubmitOrderRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubmitOrderRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
