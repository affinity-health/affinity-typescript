# GetPracticePaymentProfileResponsePaymentMethodsInner

## Properties

| Name        | Type    |
| ----------- | ------- |
| `brand`     | string  |
| `expMonth`  | number  |
| `expYear`   | number  |
| `id`        | string  |
| `isPrimary` | boolean |
| `last4`     | string  |
| `type`      | string  |

## Example

```typescript
import type { GetPracticePaymentProfileResponsePaymentMethodsInner } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  brand: null,
  expMonth: null,
  expYear: null,
  id: null,
  isPrimary: null,
  last4: null,
  type: null,
} satisfies GetPracticePaymentProfileResponsePaymentMethodsInner;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(
  exampleJSON,
) as GetPracticePaymentProfileResponsePaymentMethodsInner;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
