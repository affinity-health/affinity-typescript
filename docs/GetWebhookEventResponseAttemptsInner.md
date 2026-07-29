# GetWebhookEventResponseAttemptsInner

## Properties

| Name             | Type   |
| ---------------- | ------ |
| `attemptNumber`  | number |
| `completedAt`    | string |
| `durationMs`     | number |
| `errorCode`      | string |
| `errorMessage`   | string |
| `id`             | string |
| `requestedAt`    | string |
| `responseStatus` | number |
| `trigger`        | string |

## Example

```typescript
import type { GetWebhookEventResponseAttemptsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  attemptNumber: null,
  completedAt: null,
  durationMs: null,
  errorCode: null,
  errorMessage: null,
  id: null,
  requestedAt: null,
  responseStatus: null,
  trigger: null,
} satisfies GetWebhookEventResponseAttemptsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetWebhookEventResponseAttemptsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
