
# ListOrders200ResponseOrdersInner


## Properties

Name | Type
------------ | -------------
`cancellationReason` | string
`carrier` | string
`catalogItemId` | string
`compounderId` | string
`createdAt` | string
`currency` | string
`deliveredAt` | string
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
`practiceId` | string
`prescriberName` | string
`prescriberNpi` | string
`quantity` | number
`quoteCents` | number
`replacesOrderId` | string
`routing` | [ListOrders200ResponseOrdersInnerRouting](ListOrders200ResponseOrdersInnerRouting.md)
`shippedAt` | string
`strength` | string
`trackingNumber` | string
`updatedAt` | string

## Example

```typescript
import type { ListOrders200ResponseOrdersInner } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "cancellationReason": null,
  "carrier": null,
  "catalogItemId": null,
  "compounderId": null,
  "createdAt": null,
  "currency": null,
  "deliveredAt": null,
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
  "practiceId": null,
  "prescriberName": null,
  "prescriberNpi": null,
  "quantity": null,
  "quoteCents": null,
  "replacesOrderId": null,
  "routing": null,
  "shippedAt": null,
  "strength": null,
  "trackingNumber": null,
  "updatedAt": null,
} satisfies ListOrders200ResponseOrdersInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListOrders200ResponseOrdersInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


