# UpdatePatientRequestName

## Properties

| Name        | Type   |
| ----------- | ------ |
| `first`     | string |
| `last`      | string |
| `middle`    | string |
| `preferred` | string |

## Example

```typescript
import type { UpdatePatientRequestName } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  first: null,
  last: null,
  middle: null,
  preferred: null,
} satisfies UpdatePatientRequestName;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePatientRequestName;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
