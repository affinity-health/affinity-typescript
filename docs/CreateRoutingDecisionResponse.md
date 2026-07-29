# CreateRoutingDecisionResponse

## Properties

| Name                      | Type                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `controlledSubstance`     | boolean                                                                                 |
| `destination`             | [CreateRoutingDecisionResponseDestination](CreateRoutingDecisionResponseDestination.md) |
| `expiresAt`               | string                                                                                  |
| `livemode`                | boolean                                                                                 |
| `object`                  | string                                                                                  |
| `prescriptionPayloadHash` | string                                                                                  |

## Example

```typescript
import type { CreateRoutingDecisionResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  controlledSubstance: null,
  destination: null,
  expiresAt: null,
  livemode: null,
  object: null,
  prescriptionPayloadHash: null,
} satisfies CreateRoutingDecisionResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateRoutingDecisionResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
