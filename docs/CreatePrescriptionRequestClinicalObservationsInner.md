# CreatePrescriptionRequestClinicalObservationsInner

## Properties

| Name      | Type   |
| --------- | ------ |
| `display` | string |
| `unit`    | string |
| `value`   | number |

## Example

```typescript
import type { CreatePrescriptionRequestClinicalObservationsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  display: null,
  unit: null,
  value: null,
} satisfies CreatePrescriptionRequestClinicalObservationsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePrescriptionRequestClinicalObservationsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
