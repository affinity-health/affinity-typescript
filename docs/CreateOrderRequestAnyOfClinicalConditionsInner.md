
# CreateOrderRequestAnyOfClinicalConditionsInner


## Properties

Name | Type
------------ | -------------
`code` | string
`codeSystem` | string
`display` | string
`source` | string

## Example

```typescript
import type { CreateOrderRequestAnyOfClinicalConditionsInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "codeSystem": null,
  "display": null,
  "source": null,
} satisfies CreateOrderRequestAnyOfClinicalConditionsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOfClinicalConditionsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


