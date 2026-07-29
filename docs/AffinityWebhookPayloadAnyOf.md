# AffinityWebhookPayloadAnyOf

## Properties

| Name             | Type                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `apiVersion`     | string                                                                                    |
| `created`        | number                                                                                    |
| `id`             | string                                                                                    |
| `livemode`       | boolean                                                                                   |
| `object`         | string                                                                                    |
| `organizationId` | [AffinityWebhookPayloadAnyOfOrganizationId](AffinityWebhookPayloadAnyOfOrganizationId.md) |
| `requestId`      | string                                                                                    |
| `data`           | [AffinityWebhookPayloadAnyOfData](AffinityWebhookPayloadAnyOfData.md)                     |
| `type`           | string                                                                                    |

## Example

```typescript
import type { AffinityWebhookPayloadAnyOf } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  apiVersion: null,
  created: null,
  id: null,
  livemode: null,
  object: null,
  organizationId: null,
  requestId: null,
  data: null,
  type: null,
} satisfies AffinityWebhookPayloadAnyOf;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AffinityWebhookPayloadAnyOf;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
