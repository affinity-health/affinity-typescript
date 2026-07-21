
# CreateOrderRequest


## Properties

Name | Type
------------ | -------------
`catalogItemId` | string
`clinical` | [CreateOrderRequestAnyOfClinical](CreateOrderRequestAnyOfClinical.md)
`practiceId` | string
`directions` | string
`externalOrderId` | string
`patient` | [CreateOrderRequestAnyOfPatient](CreateOrderRequestAnyOfPatient.md)
`prescriber` | [CreateOrderRequestAnyOfPrescriber](CreateOrderRequestAnyOfPrescriber.md)
`prescription` | [CreateOrderRequestAnyOfPrescription](CreateOrderRequestAnyOfPrescription.md)
`quantity` | number
`replacesOrderId` | string
`shippingMethod` | string
`routingDecisionId` | string
`prescriptionId` | string
`prescriptionVersionId` | string
`registeredLocationId` | string
`shippingAddress` | [CreateOrderRequestAnyOfPatientAddress](CreateOrderRequestAnyOfPatientAddress.md)
`shippingDestination` | [CreateOrderRequestAnyOf1ShippingDestination](CreateOrderRequestAnyOf1ShippingDestination.md)
`shippingOptionId` | string
`epcsHandoff` | [CreateOrderRequestAnyOf1EpcsHandoff](CreateOrderRequestAnyOf1EpcsHandoff.md)

## Example

```typescript
import type { CreateOrderRequest } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "catalogItemId": null,
  "clinical": null,
  "practiceId": null,
  "directions": null,
  "externalOrderId": null,
  "patient": null,
  "prescriber": null,
  "prescription": null,
  "quantity": null,
  "replacesOrderId": null,
  "shippingMethod": null,
  "routingDecisionId": null,
  "prescriptionId": null,
  "prescriptionVersionId": null,
  "registeredLocationId": null,
  "shippingAddress": null,
  "shippingDestination": null,
  "shippingOptionId": null,
  "epcsHandoff": null,
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


