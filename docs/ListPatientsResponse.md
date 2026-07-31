# ListPatientsResponse

## Properties

| Name      | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `data`    | [Array&lt;ListPatientsResponseDataInner&gt;](ListPatientsResponseDataInner.md) |
| `hasMore` | boolean                                                                        |
| `object`  | string                                                                         |
| `url`     | string                                                                         |

## Example

```typescript
import type { ListPatientsResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  data: null,
  hasMore: null,
  object: null,
  url: null,
} satisfies ListPatientsResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPatientsResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
