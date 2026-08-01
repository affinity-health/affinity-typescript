# ListOrdersResponseDataInnerPrescriptionsInner

## Properties

| Name             | Type   |
| ---------------- | ------ |
| `catalogItemId`  | string |
| `compounderId`   | string |
| `directions`     | string |
| `dosageForm`     | string |
| `id`             | string |
| `medicationName` | string |
| `quantity`       | number |
| `quantityUnit`   | string |
| `refills`        | number |
| `status`         | string |
| `strength`       | string |

## Example

```typescript
import type { ListOrdersResponseDataInnerPrescriptionsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  catalogItemId: null,
  compounderId: null,
  directions: null,
  dosageForm: null,
  id: null,
  medicationName: null,
  quantity: null,
  quantityUnit: null,
  refills: null,
  status: null,
  strength: null,
} satisfies ListOrdersResponseDataInnerPrescriptionsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListOrdersResponseDataInnerPrescriptionsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
