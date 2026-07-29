# CreateOrderRequestAnyOfPatient

## Properties

| Name                | Type                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| `address`           | [CreateOrderRequestAnyOfPatientAddress](CreateOrderRequestAnyOfPatientAddress.md) |
| `dateOfBirth`       | Date                                                                              |
| `email`             | string                                                                            |
| `externalPatientId` | string                                                                            |
| `name`              | string                                                                            |
| `phone`             | string                                                                            |
| `state`             | string                                                                            |

## Example

```typescript
import type { CreateOrderRequestAnyOfPatient } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  address: null,
  dateOfBirth: null,
  email: null,
  externalPatientId: null,
  name: null,
  phone: null,
  state: null,
} satisfies CreateOrderRequestAnyOfPatient;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOfPatient;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
