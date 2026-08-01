# CreateOrderRequest

## Properties

| Name                | Type                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `patientId`         | string                                                                                       |
| `practiceId`        | string                                                                                       |
| `prescriptions`     | [Array&lt;CreateOrderRequestPrescriptionsInner&gt;](CreateOrderRequestPrescriptionsInner.md) |
| `providerMappingId` | string                                                                                       |

## Example

```typescript
import type { CreateOrderRequest } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  patientId: null,
  practiceId: null,
  prescriptions: null,
  providerMappingId: null,
} satisfies CreateOrderRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
