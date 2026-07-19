
# GetWebhookEventResponse


## Properties

Name | Type
------------ | -------------
`createdAt` | string
`eventType` | string
`id` | string
`livemode` | boolean
`object` | string
`objectId` | string
`objectType` | string
`status` | string
`updatedAt` | string
`attempts` | [Array&lt;GetWebhookEventResponseAttemptsInner&gt;](GetWebhookEventResponseAttemptsInner.md)
`deliveries` | [Array&lt;GetWebhookEventResponseDeliveriesInner&gt;](GetWebhookEventResponseDeliveriesInner.md)

## Example

```typescript
import type { GetWebhookEventResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "createdAt": null,
  "eventType": null,
  "id": null,
  "livemode": null,
  "object": null,
  "objectId": null,
  "objectType": null,
  "status": null,
  "updatedAt": null,
  "attempts": null,
  "deliveries": null,
} satisfies GetWebhookEventResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetWebhookEventResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


