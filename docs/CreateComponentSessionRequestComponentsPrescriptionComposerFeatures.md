# CreateComponentSessionRequestComponentsPrescriptionComposerFeatures

## Properties

| Name            | Type    |
| --------------- | ------- |
| `changePatient` | boolean |
| `createDraft`   | boolean |
| `sign`          | boolean |
| `viewHistory`   | boolean |

## Example

```typescript
import type { CreateComponentSessionRequestComponentsPrescriptionComposerFeatures } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  changePatient: null,
  createDraft: null,
  sign: null,
  viewHistory: null,
} satisfies CreateComponentSessionRequestComponentsPrescriptionComposerFeatures;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(
  exampleJSON,
) as CreateComponentSessionRequestComponentsPrescriptionComposerFeatures;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
