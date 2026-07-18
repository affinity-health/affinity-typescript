
# CreatePractice200Response


## Properties

Name | Type
------------ | -------------
`address` | [CreatePractice200ResponseAddress](CreatePractice200ResponseAddress.md)
`contacts` | [CreatePractice200ResponseContacts](CreatePractice200ResponseContacts.md)
`created` | number
`externalId` | string
`id` | string
`legalName` | string
`name` | string
`object` | string
`prescribers` | [Array&lt;CreatePracticeRequestPrescribersInner&gt;](CreatePracticeRequestPrescribersInner.md)
`supportEmail` | string
`supportPhone` | string
`timezone` | string

## Example

```typescript
import type { CreatePractice200Response } from '@affinity-health/sdk'

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
} satisfies CreatePractice200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePractice200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


