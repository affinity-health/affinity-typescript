# CreatePrescriptionResponse

## Properties

| Name                | Type    |
| ------------------- | ------- |
| `createdAt`         | Date    |
| `directions`        | string  |
| `id`                | string  |
| `livemode`          | boolean |
| `medicationId`      | string  |
| `medicationName`    | string  |
| `object`            | string  |
| `patientId`         | string  |
| `practiceId`        | string  |
| `providerMappingId` | string  |
| `quantity`          | number  |
| `refills`           | number  |
| `status`            | string  |

## Example

```typescript
import type { CreatePrescriptionResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  directions: null,
  id: null,
  livemode: null,
  medicationId: null,
  medicationName: null,
  object: null,
  patientId: null,
  practiceId: null,
  providerMappingId: null,
  quantity: null,
  refills: null,
  status: null,
} satisfies CreatePrescriptionResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePrescriptionResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
