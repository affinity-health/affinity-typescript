# CancelOrderResponse

## Properties

| Name                | Type                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `createdAt`         | string                                                                                                         |
| `fulfillments`      | [Array&lt;ListOrdersResponseDataInnerFulfillmentsInner&gt;](ListOrdersResponseDataInnerFulfillmentsInner.md)   |
| `id`                | string                                                                                                         |
| `livemode`          | boolean                                                                                                        |
| `object`            | string                                                                                                         |
| `patientExternalId` | string                                                                                                         |
| `patientId`         | string                                                                                                         |
| `patientName`       | string                                                                                                         |
| `patientState`      | string                                                                                                         |
| `practiceId`        | string                                                                                                         |
| `prescriberName`    | string                                                                                                         |
| `prescriberNpi`     | string                                                                                                         |
| `prescriptions`     | [Array&lt;ListOrdersResponseDataInnerPrescriptionsInner&gt;](ListOrdersResponseDataInnerPrescriptionsInner.md) |
| `status`            | string                                                                                                         |
| `updatedAt`         | string                                                                                                         |

## Example

```typescript
import type { CancelOrderResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  fulfillments: null,
  id: null,
  livemode: null,
  object: null,
  patientExternalId: null,
  patientId: null,
  patientName: null,
  patientState: null,
  practiceId: null,
  prescriberName: null,
  prescriberNpi: null,
  prescriptions: null,
  status: null,
  updatedAt: null,
} satisfies CancelOrderResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CancelOrderResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
