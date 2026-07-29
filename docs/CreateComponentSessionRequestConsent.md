# CreateComponentSessionRequestConsent

## Properties

| Name                       | Type    |
| -------------------------- | ------- |
| `authorizedProviderAccess` | boolean |
| `minimumNecessaryPhi`      | boolean |
| `recordedAt`               | Date    |

## Example

```typescript
import type { CreateComponentSessionRequestConsent } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  authorizedProviderAccess: null,
  minimumNecessaryPhi: null,
  recordedAt: null,
} satisfies CreateComponentSessionRequestConsent;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateComponentSessionRequestConsent;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
