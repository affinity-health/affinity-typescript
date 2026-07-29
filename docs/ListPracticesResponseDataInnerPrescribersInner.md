# ListPracticesResponseDataInnerPrescribersInner

## Properties

| Name            | Type                |
| --------------- | ------------------- |
| `credentials`   | string              |
| `licenseStates` | Array&lt;string&gt; |
| `name`          | string              |
| `npi`           | string              |

## Example

```typescript
import type { ListPracticesResponseDataInnerPrescribersInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  credentials: null,
  licenseStates: null,
  name: null,
  npi: null,
} satisfies ListPracticesResponseDataInnerPrescribersInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPracticesResponseDataInnerPrescribersInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
