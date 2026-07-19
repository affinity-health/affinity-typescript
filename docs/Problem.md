
# Problem


## Properties

Name | Type
------------ | -------------
`code` | string
`detail` | string
`errors` | [Array&lt;ProblemError&gt;](ProblemError.md)
`instance` | string
`requestId` | string
`status` | number
`title` | string
`type` | string

## Example

```typescript
import type { Problem } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "detail": null,
  "errors": null,
  "instance": null,
  "requestId": null,
  "status": null,
  "title": null,
  "type": null,
} satisfies Problem

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Problem
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


