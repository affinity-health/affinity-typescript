
# CreateOrderRequestAnyOf1


## Properties

Name | Type
------------ | -------------
`practiceId` | string
`externalOrderId` | string
`pharmacyOrganizationId` | string
`prescriptionId` | string
`prescriptionVersionId` | string
`registeredLocationId` | string
`shippingAddress` | [CreateOrderRequestAnyOfPatientAddress](CreateOrderRequestAnyOfPatientAddress.md)

## Example

```typescript
import type { CreateOrderRequestAnyOf1 } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "practiceId": null,
  "externalOrderId": null,
  "pharmacyOrganizationId": null,
  "prescriptionId": null,
  "prescriptionVersionId": null,
  "registeredLocationId": null,
  "shippingAddress": null,
} satisfies CreateOrderRequestAnyOf1

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestAnyOf1
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


