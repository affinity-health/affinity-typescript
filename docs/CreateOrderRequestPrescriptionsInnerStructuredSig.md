# CreateOrderRequestPrescriptionsInnerStructuredSig

## Properties

| Name                | Type    |
| ------------------- | ------- |
| `dose`              | string  |
| `doseUnit`          | string  |
| `duration`          | string  |
| `frequency`         | string  |
| `indication`        | string  |
| `maxDailyUse`       | string  |
| `prn`               | boolean |
| `route`             | string  |
| `titrationSchedule` | string  |

## Example

```typescript
import type { CreateOrderRequestPrescriptionsInnerStructuredSig } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  dose: null,
  doseUnit: null,
  duration: null,
  frequency: null,
  indication: null,
  maxDailyUse: null,
  prn: null,
  route: null,
  titrationSchedule: null,
} satisfies CreateOrderRequestPrescriptionsInnerStructuredSig;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOrderRequestPrescriptionsInnerStructuredSig;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
