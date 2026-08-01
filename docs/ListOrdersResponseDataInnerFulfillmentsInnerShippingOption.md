# ListOrdersResponseDataInnerFulfillmentsInnerShippingOption

## Properties

| Name           | Type   |
| -------------- | ------ |
| `amountCents`  | number |
| `currency`     | string |
| `label`        | string |
| `markupCents`  | number |
| `serviceLevel` | string |
| `temperature`  | string |
| `totalCents`   | number |

## Example

```typescript
import type { ListOrdersResponseDataInnerFulfillmentsInnerShippingOption } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  amountCents: null,
  currency: null,
  label: null,
  markupCents: null,
  serviceLevel: null,
  temperature: null,
  totalCents: null,
} satisfies ListOrdersResponseDataInnerFulfillmentsInnerShippingOption;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(
  exampleJSON,
) as ListOrdersResponseDataInnerFulfillmentsInnerShippingOption;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
