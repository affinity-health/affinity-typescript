# CreateRoutingDecisionResponseDestination

## Properties

| Name                | Type   |
| ------------------- | ------ |
| `epcsDestinationId` | string |
| `providerId`        | string |

## Example

```typescript
import type { CreateRoutingDecisionResponseDestination } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  epcsDestinationId: null,
  providerId: null,
} satisfies CreateRoutingDecisionResponseDestination;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateRoutingDecisionResponseDestination;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
