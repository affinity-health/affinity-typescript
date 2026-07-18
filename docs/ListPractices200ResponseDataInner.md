
# ListPractices200ResponseDataInner


## Properties

Name | Type
------------ | -------------
`address` | [ListPractices200ResponseDataInnerAddress](ListPractices200ResponseDataInnerAddress.md)
`contacts` | [ListPractices200ResponseDataInnerContacts](ListPractices200ResponseDataInnerContacts.md)
`created` | number
`externalId` | string
`id` | string
`legalName` | string
`name` | string
`object` | string
`prescribers` | [Array&lt;ListPractices200ResponseDataInnerPrescribersInner&gt;](ListPractices200ResponseDataInnerPrescribersInner.md)
`supportEmail` | string
`supportPhone` | string
`timezone` | string

## Example

```typescript
import type { ListPractices200ResponseDataInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "address": null,
  "contacts": null,
  "created": null,
  "externalId": null,
  "id": null,
  "legalName": null,
  "name": null,
  "object": null,
  "prescribers": null,
  "supportEmail": null,
  "supportPhone": null,
  "timezone": null,
} satisfies ListPractices200ResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPractices200ResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


