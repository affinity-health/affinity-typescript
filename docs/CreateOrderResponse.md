# CreateOrderResponse

## Properties

| Name                | Type                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `createdAt`         | Date                                                                                           |
| `id`                | string                                                                                         |
| `livemode`          | boolean                                                                                        |
| `object`            | string                                                                                         |
| `patientId`         | string                                                                                         |
| `practiceId`        | string                                                                                         |
| `prescriptions`     | [Array&lt;CreateOrderResponsePrescriptionsInner&gt;](CreateOrderResponsePrescriptionsInner.md) |
| `providerMappingId` | string                                                                                         |
| `status`            | string                                                                                         |

## Example

```typescript
import type { CreateOrderResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  id: null,
  livemode: null,
  object: null,
  patientId: null,
  practiceId: null,
  prescriptions: null,
  providerMappingId: null,
  status: null,
} satisfies CreateOrderResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
