# CreateOrderRequestPrescriptionsInnerDispensing

## Properties

| Name                     | Type    |
| ------------------------ | ------- |
| `dispenseUponAcceptance` | boolean |
| `pharmacyNotes`          | string  |
| `requestedFillDate`      | Date    |
| `substitutionPermitted`  | boolean |

## Example

```typescript
import type { CreateOrderRequestPrescriptionsInnerDispensing } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  dispenseUponAcceptance: null,
  pharmacyNotes: null,
  requestedFillDate: null,
  substitutionPermitted: null,
} satisfies CreateOrderRequestPrescriptionsInnerDispensing;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestPrescriptionsInnerDispensing;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
