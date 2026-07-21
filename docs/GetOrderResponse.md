
# GetOrderResponse


## Properties

Name | Type
------------ | -------------
`cancellationReason` | string
`carrier` | string
`catalogItemId` | string
`practiceId` | string
`compounderId` | string
`createdAt` | string
`currency` | string
`directions` | string
`dosageForm` | string
`externalOrderId` | string
`externalSubmissionAttempted` | boolean
`externalSubmissionBlockedReason` | string
`id` | string
`livemode` | boolean
`medicationName` | string
`patientExternalId` | string
`patientName` | string
`patientState` | string
`prescriberName` | string
`prescriberNpi` | string
`quantity` | number
`quoteCents` | number
`object` | string
`replacesOrderId` | string
`routing` | [ListOrdersResponseDataInnerRouting](ListOrdersResponseDataInnerRouting.md)
`status` | string
`strength` | string
`trackingNumber` | string
`shippedAt` | string
`deliveredAt` | string
`estimatedDeliveryAt` | string
`shipping` | [ListOrdersResponseDataInnerShipping](ListOrdersResponseDataInnerShipping.md)
`trackingUrl` | string
`updatedAt` | string

## Example

```typescript
import type { GetOrderResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "cancellationReason": null,
  "carrier": null,
  "catalogItemId": null,
  "practiceId": null,
  "compounderId": null,
  "createdAt": null,
  "currency": null,
  "directions": null,
  "dosageForm": null,
  "externalOrderId": null,
  "externalSubmissionAttempted": null,
  "externalSubmissionBlockedReason": null,
  "id": null,
  "livemode": null,
  "medicationName": null,
  "patientExternalId": null,
  "patientName": null,
  "patientState": null,
  "prescriberName": null,
  "prescriberNpi": null,
  "quantity": null,
  "quoteCents": null,
  "object": null,
  "replacesOrderId": null,
  "routing": null,
  "status": null,
  "strength": null,
  "trackingNumber": null,
  "shippedAt": null,
  "deliveredAt": null,
  "estimatedDeliveryAt": null,
  "shipping": null,
  "trackingUrl": null,
  "updatedAt": null,
} satisfies GetOrderResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetOrderResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


