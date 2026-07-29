# DeleteWebhookEndpointResponse

## Properties

| Name                  | Type                |
| --------------------- | ------------------- |
| `apiVersion`          | string              |
| `consecutiveFailures` | number              |
| `createdAt`           | string              |
| `description`         | string              |
| `id`                  | string              |
| `livemode`            | boolean             |
| `object`              | string              |
| `payloadStyle`        | string              |
| `status`              | string              |
| `subscribedEvents`    | Array&lt;string&gt; |
| `updatedAt`           | string              |
| `url`                 | string              |

## Example

```typescript
import type { DeleteWebhookEndpointResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  apiVersion: null,
  consecutiveFailures: null,
  createdAt: null,
  description: null,
  id: null,
  livemode: null,
  object: null,
  payloadStyle: null,
  status: null,
  subscribedEvents: null,
  updatedAt: null,
  url: null,
} satisfies DeleteWebhookEndpointResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeleteWebhookEndpointResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
