# GetPatientResponse

## Properties

| Name          | Type                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| `address`     | [ListPatientsResponseDataInnerAddress](ListPatientsResponseDataInnerAddress.md) |
| `allergies`   | string                                                                          |
| `createdAt`   | Date                                                                            |
| `dateOfBirth` | Date                                                                            |
| `email`       | string                                                                          |
| `externalId`  | string                                                                          |
| `gender`      | string                                                                          |
| `id`          | string                                                                          |
| `livemode`    | boolean                                                                         |
| `metadata`    | { [key: string]: any; }                                                         |
| `name`        | [ListPatientsResponseDataInnerName](ListPatientsResponseDataInnerName.md)       |
| `object`      | string                                                                          |
| `phone`       | string                                                                          |
| `practiceId`  | string                                                                          |
| `status`      | string                                                                          |
| `updatedAt`   | Date                                                                            |

## Example

```typescript
import type { GetPatientResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  address: null,
  allergies: null,
  createdAt: null,
  dateOfBirth: null,
  email: null,
  externalId: null,
  gender: null,
  id: null,
  livemode: null,
  metadata: null,
  name: null,
  object: null,
  phone: null,
  practiceId: null,
  status: null,
  updatedAt: null,
} satisfies GetPatientResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetPatientResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
