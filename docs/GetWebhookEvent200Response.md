
# GetWebhookEvent200Response


## Properties

Name | Type
------------ | -------------
`attempts` | [Array&lt;GetWebhookEvent200ResponseAttemptsInner&gt;](GetWebhookEvent200ResponseAttemptsInner.md)
`deliveries` | [Array&lt;GetWebhookEvent200ResponseDeliveriesInner&gt;](GetWebhookEvent200ResponseDeliveriesInner.md)
`event` | [GetWebhookEvent200ResponseEvent](GetWebhookEvent200ResponseEvent.md)

## Example

```typescript
import type { GetWebhookEvent200Response } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "attempts": null,
  "deliveries": null,
  "event": null,
} satisfies GetWebhookEvent200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetWebhookEvent200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


