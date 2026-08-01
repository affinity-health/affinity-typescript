# ListOrdersResponseDataInnerFulfillmentsInnerShipping

## Properties

| Name              | Type                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `destinationType` | string                                                                                                                      |
| `method`          | string                                                                                                                      |
| `option`          | [ListOrdersResponseDataInnerFulfillmentsInnerShippingOption](ListOrdersResponseDataInnerFulfillmentsInnerShippingOption.md) |

## Example

```typescript
import type { ListOrdersResponseDataInnerFulfillmentsInnerShipping } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  destinationType: null,
  method: null,
  option: null,
} satisfies ListOrdersResponseDataInnerFulfillmentsInnerShipping;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(
  exampleJSON,
) as ListOrdersResponseDataInnerFulfillmentsInnerShipping;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
