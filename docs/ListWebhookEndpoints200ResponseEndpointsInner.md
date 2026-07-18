
# ListWebhookEndpoints200ResponseEndpointsInner


## Properties

Name | Type
------------ | -------------
`createdAt` | string
`enabledEvents` | Array&lt;string&gt;
`id` | string
`livemode` | boolean
`updatedAt` | string
`url` | string

## Example

```typescript
import type { ListWebhookEndpoints200ResponseEndpointsInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "createdAt": null,
  "enabledEvents": null,
  "id": null,
  "livemode": null,
  "updatedAt": null,
  "url": null,
} satisfies ListWebhookEndpoints200ResponseEndpointsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListWebhookEndpoints200ResponseEndpointsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


