# ListCompoundersResponseDataInner

## Properties

| Name               | Type                |
| ------------------ | ------------------- |
| `catalogItemCount` | number              |
| `facilityType`     | string              |
| `livemode`         | boolean             |
| `name`             | string              |
| `object`           | string              |
| `restrictedStates` | Array&lt;string&gt; |
| `supportedStates`  | Array&lt;string&gt; |

## Example

```typescript
import type { ListCompoundersResponseDataInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  catalogItemCount: null,
  facilityType: null,
  livemode: null,
  name: null,
  object: null,
  restrictedStates: null,
  supportedStates: null,
} satisfies ListCompoundersResponseDataInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListCompoundersResponseDataInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
