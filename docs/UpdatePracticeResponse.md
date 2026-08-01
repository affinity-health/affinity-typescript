# UpdatePracticeResponse

## Properties

| Name               | Type                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `address`          | [ListPracticesResponseDataInnerAddress](ListPracticesResponseDataInnerAddress.md)                |
| `contacts`         | [ListPracticesResponseDataInnerContacts](ListPracticesResponseDataInnerContacts.md)              |
| `createdAt`        | Date                                                                                             |
| `externalId`       | string                                                                                           |
| `id`               | string                                                                                           |
| `legalName`        | string                                                                                           |
| `livemode`         | boolean                                                                                          |
| `metadata`         | { [key: string]: any; }                                                                          |
| `name`             | string                                                                                           |
| `object`           | string                                                                                           |
| `prescribers`      | [Array&lt;CreatePracticeResponsePrescribersInner&gt;](CreatePracticeResponsePrescribersInner.md) |
| `productionAccess` | string                                                                                           |
| `supportEmail`     | string                                                                                           |
| `supportPhone`     | string                                                                                           |
| `timezone`         | string                                                                                           |

## Example

```typescript
import type { UpdatePracticeResponse } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  address: null,
  contacts: null,
  createdAt: null,
  externalId: null,
  id: null,
  legalName: null,
  livemode: null,
  metadata: null,
  name: null,
  object: null,
  prescribers: null,
  productionAccess: null,
  supportEmail: null,
  supportPhone: null,
  timezone: null,
} satisfies UpdatePracticeResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePracticeResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
