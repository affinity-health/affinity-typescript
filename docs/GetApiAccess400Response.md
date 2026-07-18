
# GetApiAccess400Response


## Properties

Name | Type
------------ | -------------
`code` | string
`data` | any
`detail` | string
`instance` | string
`requestId` | string
`status` | number
`title` | string
`traceId` | string
`type` | string

## Example

```typescript
import type { GetApiAccess400Response } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "data": null,
  "detail": null,
  "instance": null,
  "requestId": null,
  "status": null,
  "title": null,
  "traceId": null,
  "type": null,
} satisfies GetApiAccess400Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetApiAccess400Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


