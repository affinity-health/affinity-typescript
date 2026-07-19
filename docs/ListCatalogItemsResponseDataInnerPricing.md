
# ListCatalogItemsResponseDataInnerPricing


## Properties

Name | Type
------------ | -------------
`currency` | string
`medicationSubtotalCents` | number
`orderTotalCents` | number
`serviceFeeCents` | number
`serviceFeePercent` | number

## Example

```typescript
import type { ListCatalogItemsResponseDataInnerPricing } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "currency": null,
  "medicationSubtotalCents": null,
  "orderTotalCents": null,
  "serviceFeeCents": null,
  "serviceFeePercent": null,
} satisfies ListCatalogItemsResponseDataInnerPricing

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListCatalogItemsResponseDataInnerPricing
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


