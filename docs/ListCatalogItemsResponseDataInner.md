
# ListCatalogItemsResponseDataInner


## Properties

Name | Type
------------ | -------------
`allowedStates` | Array&lt;string&gt;
`catalogKind` | string
`coldShip` | boolean
`compounderId` | string
`compounderName` | string
`description` | string
`dosageForm` | string
`facilityType` | string
`id` | string
`isOrderable` | boolean
`livemode` | boolean
`name` | string
`object` | string
`patientSpecificRequired` | boolean
`pricing` | [ListCatalogItemsResponseDataInnerPricing](ListCatalogItemsResponseDataInnerPricing.md)
`restrictedStates` | Array&lt;string&gt;
`route` | string
`strength` | string

## Example

```typescript
import type { ListCatalogItemsResponseDataInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "allowedStates": null,
  "catalogKind": null,
  "coldShip": null,
  "compounderId": null,
  "compounderName": null,
  "description": null,
  "dosageForm": null,
  "facilityType": null,
  "id": null,
  "isOrderable": null,
  "livemode": null,
  "name": null,
  "object": null,
  "patientSpecificRequired": null,
  "pricing": null,
  "restrictedStates": null,
  "route": null,
  "strength": null,
} satisfies ListCatalogItemsResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListCatalogItemsResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


