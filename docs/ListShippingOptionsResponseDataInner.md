
# ListShippingOptionsResponseDataInner


## Properties

Name | Type
------------ | -------------
`amountCents` | number
`carrier` | string
`currency` | string
`estimatedDaysMax` | number
`estimatedDaysMin` | number
`id` | string
`label` | string
`markupCents` | number
`serviceLevel` | string
`temperature` | string
`totalCents` | number

## Example

```typescript
import type { ListShippingOptionsResponseDataInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "amountCents": null,
  "carrier": null,
  "currency": null,
  "estimatedDaysMax": null,
  "estimatedDaysMin": null,
  "id": null,
  "label": null,
  "markupCents": null,
  "serviceLevel": null,
  "temperature": null,
  "totalCents": null,
} satisfies ListShippingOptionsResponseDataInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListShippingOptionsResponseDataInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


