
# CreateOrderRequest


## Properties

Name | Type
------------ | -------------
`catalogItemId` | string
`practiceId` | string
`directions` | string
`externalOrderId` | string
`patient` | [CreateOrderRequestAnyOfPatient](CreateOrderRequestAnyOfPatient.md)
`prescriber` | [CreateOrderRequestAnyOfPrescriber](CreateOrderRequestAnyOfPrescriber.md)
`prescription` | [CreateOrderRequestAnyOfPrescription](CreateOrderRequestAnyOfPrescription.md)
`quantity` | number
`replacesOrderId` | string
`pharmacyOrganizationId` | string
`prescriptionId` | string
`prescriptionVersionId` | string
`registeredLocationId` | string
`shippingAddress` | [CreateOrderRequestAnyOfPatientAddress](CreateOrderRequestAnyOfPatientAddress.md)

## Example

```typescript
import type { CreateOrderRequest } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "catalogItemId": null,
  "practiceId": null,
  "directions": null,
  "externalOrderId": null,
  "patient": null,
  "prescriber": null,
  "prescription": null,
  "quantity": null,
  "replacesOrderId": null,
  "pharmacyOrganizationId": null,
  "prescriptionId": null,
  "prescriptionVersionId": null,
  "registeredLocationId": null,
  "shippingAddress": null,
} satisfies CreateOrderRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


