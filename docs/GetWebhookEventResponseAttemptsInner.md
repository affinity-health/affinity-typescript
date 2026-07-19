
# GetWebhookEventResponseAttemptsInner


## Properties

Name | Type
------------ | -------------
`attemptedAt` | string
`errorMessage` | string
`id` | string
`responseBody` | string
`responseStatus` | number
`success` | boolean

## Example

```typescript
import type { GetWebhookEventResponseAttemptsInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "attemptedAt": null,
  "errorMessage": null,
  "id": null,
  "responseBody": null,
  "responseStatus": null,
  "success": null,
} satisfies GetWebhookEventResponseAttemptsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetWebhookEventResponseAttemptsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


