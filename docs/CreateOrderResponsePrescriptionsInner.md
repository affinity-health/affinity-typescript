# CreateOrderResponsePrescriptionsInner

## Properties

| Name             | Type   |
| ---------------- | ------ |
| `createdAt`      | Date   |
| `directions`     | string |
| `id`             | string |
| `medicationId`   | string |
| `medicationName` | string |
| `object`         | string |
| `quantity`       | number |
| `quantityUnit`   | string |
| `refills`        | number |
| `status`         | string |

## Example

```typescript
import type { CreateOrderResponsePrescriptionsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  directions: null,
  id: null,
  medicationId: null,
  medicationName: null,
  object: null,
  quantity: null,
  quantityUnit: null,
  refills: null,
  status: null,
} satisfies CreateOrderResponsePrescriptionsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderResponsePrescriptionsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
