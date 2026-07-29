# ListPracticeMembershipsResponse

## Properties

| Name     | Type                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| `data`   | [Array&lt;ListPracticeMembershipsResponseDataInner&gt;](ListPracticeMembershipsResponseDataInner.md) |
| `object` | string                                                                                               |
| `url`    | string                                                                                               |

## Example

```typescript
import type { ListPracticeMembershipsResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  data: null,
  object: null,
  url: null,
} satisfies ListPracticeMembershipsResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPracticeMembershipsResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
