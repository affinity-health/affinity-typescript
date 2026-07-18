
# ListCatalogItems200ResponseItemsInner


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
`name` | string
`patientSpecificRequired` | boolean
`restrictedStates` | Array&lt;string&gt;
`route` | string
`strength` | string

## Example

```typescript
import type { ListCatalogItems200ResponseItemsInner } from '@affinity-health/sdk'

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
  "name": null,
  "patientSpecificRequired": null,
  "restrictedStates": null,
  "route": null,
  "strength": null,
} satisfies ListCatalogItems200ResponseItemsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListCatalogItems200ResponseItemsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


