# ListPracticesResponseDataInnerContacts

## Properties

| Name         | Type                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `compliance` | [ListPracticesResponseDataInnerContactsCompliance](ListPracticesResponseDataInnerContactsCompliance.md) |
| `primary`    | [ListPracticesResponseDataInnerContactsCompliance](ListPracticesResponseDataInnerContactsCompliance.md) |

## Example

```typescript
import type { ListPracticesResponseDataInnerContacts } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  compliance: null,
  primary: null,
} satisfies ListPracticesResponseDataInnerContacts;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPracticesResponseDataInnerContacts;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
