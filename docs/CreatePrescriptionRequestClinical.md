# CreatePrescriptionRequestClinical

## Properties

| Name                 | Type                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `compoundingReason`  | [CreatePrescriptionRequestClinicalCompoundingReason](CreatePrescriptionRequestClinicalCompoundingReason.md)              |
| `currentMedications` | Array&lt;string&gt;                                                                                                      |
| `diagnosis`          | [CreatePrescriptionRequestClinicalDiagnosis](CreatePrescriptionRequestClinicalDiagnosis.md)                              |
| `observations`       | [Array&lt;CreatePrescriptionRequestClinicalObservationsInner&gt;](CreatePrescriptionRequestClinicalObservationsInner.md) |

## Example

```typescript
import type { CreatePrescriptionRequestClinical } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  compoundingReason: null,
  currentMedications: null,
  diagnosis: null,
  observations: null,
} satisfies CreatePrescriptionRequestClinical;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePrescriptionRequestClinical;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
