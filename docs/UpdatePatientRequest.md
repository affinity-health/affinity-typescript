# UpdatePatientRequest

## Properties

| Name          | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| `address`     | [CreatePatientRequestAddress](CreatePatientRequestAddress.md) |
| `allergies`   | string                                                        |
| `dateOfBirth` | Date                                                          |
| `email`       | string                                                        |
| `gender`      | string                                                        |
| `metadata`    | { [key: string]: any; }                                       |
| `name`        | [UpdatePatientRequestName](UpdatePatientRequestName.md)       |
| `phone`       | string                                                        |
| `status`      | string                                                        |

## Example

```typescript
import type { UpdatePatientRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  address: null,
  allergies: null,
  dateOfBirth: null,
  email: null,
  gender: null,
  metadata: null,
  name: null,
  phone: null,
  status: null,
} satisfies UpdatePatientRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePatientRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
