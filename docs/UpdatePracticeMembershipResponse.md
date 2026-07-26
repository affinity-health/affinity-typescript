
# UpdatePracticeMembershipResponse


## Properties

Name | Type
------------ | -------------
`acceptedAt` | Date
`id` | string
`object` | string
`practiceId` | string
`roleId` | string
`status` | string
`termsVersion` | string
`userId` | string

## Example

```typescript
import type { UpdatePracticeMembershipResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "acceptedAt": null,
  "id": null,
  "object": null,
  "practiceId": null,
  "roleId": null,
  "status": null,
  "termsVersion": null,
  "userId": null,
} satisfies UpdatePracticeMembershipResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePracticeMembershipResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


