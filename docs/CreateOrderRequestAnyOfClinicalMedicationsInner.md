
# CreateOrderRequestAnyOfClinicalMedicationsInner


## Properties

Name | Type
------------ | -------------
`display` | string
`ndc` | string
`rxNormCui` | string
`source` | string

## Example

```typescript
import type { CreateOrderRequestAnyOfClinicalMedicationsInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "display": null,
  "ndc": null,
  "rxNormCui": null,
  "source": null,
} satisfies CreateOrderRequestAnyOfClinicalMedicationsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOfClinicalMedicationsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


