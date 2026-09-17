# CreateOrderRequest

## Properties

| Name                | Type                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `practiceId`        | string                                                                                                      |
| `userId`            | string                                                                                                      |
| `externalOrderId`   | string                                                                                                      |
| `metadata`          | [{ [key: string]: ListOrdersResponseDataInnerMetadataValue; }](ListOrdersResponseDataInnerMetadataValue.md) |
| `patientId`         | string                                                                                                      |
| `patient`           | [CreateOrderRequestPatient](CreateOrderRequestPatient.md)                                                   |
| `shippingAddressId` | string                                                                                                      |
| `prescriptions`     | [Array&lt;CreateOrderRequestPrescriptionsInner&gt;](CreateOrderRequestPrescriptionsInner.md)                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
