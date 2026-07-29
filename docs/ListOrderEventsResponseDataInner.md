# ListOrderEventsResponseDataInner

## Properties

| Name        | Type                    |
| ----------- | ----------------------- |
| `createdAt` | string                  |
| `eventType` | string                  |
| `id`        | string                  |
| `message`   | string                  |
| `metadata`  | { [key: string]: any; } |
| `object`    | string                  |

## Example

```typescript
import type { ListOrderEventsResponseDataInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  eventType: null,
  id: null,
  message: null,
  metadata: null,
  object: null,
} satisfies ListOrderEventsResponseDataInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListOrderEventsResponseDataInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
