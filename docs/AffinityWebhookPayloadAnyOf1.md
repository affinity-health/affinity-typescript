# AffinityWebhookPayloadAnyOf1

## Properties

| Name             | Type                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `apiVersion`     | string                                                                                      |
| `created`        | number                                                                                      |
| `id`             | string                                                                                      |
| `livemode`       | boolean                                                                                     |
| `object`         | string                                                                                      |
| `organizationId` | [AffinityWebhookPayloadAnyOf1OrganizationId](AffinityWebhookPayloadAnyOf1OrganizationId.md) |
| `requestId`      | string                                                                                      |
| `data`           | [AffinityWebhookPayloadAnyOf1Data](AffinityWebhookPayloadAnyOf1Data.md)                     |
| `type`           | string                                                                                      |

## Example

```typescript
import type { AffinityWebhookPayloadAnyOf1 } from "@affinity-health/sdk";

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
} satisfies AffinityWebhookPayloadAnyOf1;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AffinityWebhookPayloadAnyOf1;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
