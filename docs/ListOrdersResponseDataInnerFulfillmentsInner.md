# ListOrdersResponseDataInnerFulfillmentsInner

## Properties

| Name                  | Type                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `carrier`             | string                                                                                                          |
| `compounderId`        | string                                                                                                          |
| `createdAt`           | string                                                                                                          |
| `id`                  | string                                                                                                          |
| `prescriptionId`      | string                                                                                                          |
| `status`              | string                                                                                                          |
| `trackingNumber`      | string                                                                                                          |
| `shippedAt`           | string                                                                                                          |
| `deliveredAt`         | string                                                                                                          |
| `estimatedDeliveryAt` | string                                                                                                          |
| `shipping`            | [ListOrdersResponseDataInnerFulfillmentsInnerShipping](ListOrdersResponseDataInnerFulfillmentsInnerShipping.md) |
| `trackingUrl`         | string                                                                                                          |
| `updatedAt`           | string                                                                                                          |

## Example

```typescript
import type { ListOrdersResponseDataInnerFulfillmentsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  carrier: null,
  compounderId: null,
  createdAt: null,
  id: null,
  prescriptionId: null,
  status: null,
  trackingNumber: null,
  shippedAt: null,
  deliveredAt: null,
  estimatedDeliveryAt: null,
  shipping: null,
  trackingUrl: null,
  updatedAt: null,
} satisfies ListOrdersResponseDataInnerFulfillmentsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListOrdersResponseDataInnerFulfillmentsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
