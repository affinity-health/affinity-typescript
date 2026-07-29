# CreateOrderRequestAnyOfClinical

## Properties

| Name          | Type                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `allergies`   | [Array&lt;CreateOrderRequestAnyOfClinicalAllergiesInner&gt;](CreateOrderRequestAnyOfClinicalAllergiesInner.md)     |
| `conditions`  | [Array&lt;CreateOrderRequestAnyOfClinicalConditionsInner&gt;](CreateOrderRequestAnyOfClinicalConditionsInner.md)   |
| `medications` | [Array&lt;CreateOrderRequestAnyOfClinicalMedicationsInner&gt;](CreateOrderRequestAnyOfClinicalMedicationsInner.md) |

## Example

```typescript
import type { CreateOrderRequestAnyOfClinical } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  allergies: null,
  conditions: null,
  medications: null,
} satisfies CreateOrderRequestAnyOfClinical;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOfClinical;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
