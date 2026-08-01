# CreatePrescriptionRequest

## Properties

| Name                | Type                                                                                |
| ------------------- | ----------------------------------------------------------------------------------- |
| `clinical`          | [CreatePrescriptionRequestClinical](CreatePrescriptionRequestClinical.md)           |
| `compounderId`      | string                                                                              |
| `daysSupply`        | number                                                                              |
| `dispensing`        | [CreatePrescriptionRequestDispensing](CreatePrescriptionRequestDispensing.md)       |
| `directions`        | string                                                                              |
| `medicationId`      | string                                                                              |
| `patientId`         | string                                                                              |
| `practiceId`        | string                                                                              |
| `providerMappingId` | string                                                                              |
| `quantity`          | number                                                                              |
| `quantityUnit`      | string                                                                              |
| `refills`           | number                                                                              |
| `structuredSig`     | [CreatePrescriptionRequestStructuredSig](CreatePrescriptionRequestStructuredSig.md) |

## Example

```typescript
import type { CreatePrescriptionRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  clinical: null,
  compounderId: null,
  daysSupply: null,
  dispensing: null,
  directions: null,
  medicationId: null,
  patientId: null,
  practiceId: null,
  providerMappingId: null,
  quantity: null,
  quantityUnit: null,
  refills: null,
  structuredSig: null,
} satisfies CreatePrescriptionRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePrescriptionRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
