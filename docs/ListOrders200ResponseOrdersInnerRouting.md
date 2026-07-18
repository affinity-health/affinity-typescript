
# ListOrders200ResponseOrdersInnerRouting


## Properties

Name | Type
------------ | -------------
`blockedReasons` | Array&lt;string&gt;
`candidateCompounderIds` | Array&lt;string&gt;
`coldShip` | boolean
`selectedCompounderId` | string

## Example

```typescript
import type { ListOrders200ResponseOrdersInnerRouting } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "blockedReasons": null,
  "candidateCompounderIds": null,
  "coldShip": null,
  "selectedCompounderId": null,
} satisfies ListOrders200ResponseOrdersInnerRouting

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListOrders200ResponseOrdersInnerRouting
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


