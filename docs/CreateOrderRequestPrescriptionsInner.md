# CreateOrderRequestPrescriptionsInner

## Properties

| Name            | Type                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `clinical`      | [CreateOrderRequestPrescriptionsInnerClinical](CreateOrderRequestPrescriptionsInnerClinical.md)           |
| `compounderId`  | string                                                                                                    |
| `daysSupply`    | number                                                                                                    |
| `dispensing`    | [CreateOrderRequestPrescriptionsInnerDispensing](CreateOrderRequestPrescriptionsInnerDispensing.md)       |
| `directions`    | string                                                                                                    |
| `medicationId`  | string                                                                                                    |
| `quantity`      | number                                                                                                    |
| `quantityUnit`  | string                                                                                                    |
| `refills`       | number                                                                                                    |
| `structuredSig` | [CreateOrderRequestPrescriptionsInnerStructuredSig](CreateOrderRequestPrescriptionsInnerStructuredSig.md) |

## Example

```typescript
import type { CreateOrderRequestPrescriptionsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  clinical: null,
  compounderId: null,
  daysSupply: null,
  dispensing: null,
  directions: null,
  medicationId: null,
  quantity: null,
  quantityUnit: null,
  refills: null,
  structuredSig: null,
} satisfies CreateOrderRequestPrescriptionsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestPrescriptionsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
