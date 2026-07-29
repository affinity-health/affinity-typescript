# AffinityWebhookPayloadAnyOf1DataObject

## Properties

| Name              | Type   |
| ----------------- | ------ |
| `carrier`         | string |
| `deliveredAt`     | Date   |
| `externalOrderId` | string |
| `id`              | string |
| `object`          | string |
| `practiceId`      | string |
| `shippedAt`       | Date   |
| `status`          | string |
| `trackingNumber`  | string |
| `updatedAt`       | Date   |

## Example

```typescript
import type { AffinityWebhookPayloadAnyOf1DataObject } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  carrier: null,
  deliveredAt: null,
  externalOrderId: null,
  id: null,
  object: null,
  practiceId: null,
  shippedAt: null,
  status: null,
  trackingNumber: null,
  updatedAt: null,
} satisfies AffinityWebhookPayloadAnyOf1DataObject;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AffinityWebhookPayloadAnyOf1DataObject;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
