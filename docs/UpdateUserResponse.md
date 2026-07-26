
# UpdateUserResponse


## Properties

Name | Type
------------ | -------------
`createdAt` | Date
`email` | string
`externalId` | string
`id` | string
`livemode` | boolean
`metadata` | { [key: string]: any; }
`name` | string
`object` | string
`status` | string
`updatedAt` | Date

## Example

```typescript
import type { UpdateUserResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "createdAt": null,
  "email": null,
  "externalId": null,
  "id": null,
  "livemode": null,
  "metadata": null,
  "name": null,
  "object": null,
  "status": null,
  "updatedAt": null,
} satisfies UpdateUserResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateUserResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


