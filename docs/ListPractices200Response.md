
# ListPractices200Response


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;ListPractices200ResponseDataInner&gt;](ListPractices200ResponseDataInner.md)
`hasMore` | boolean
`object` | string

## Example

```typescript
import type { ListPractices200Response } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "hasMore": null,
  "object": null,
} satisfies ListPractices200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ListPractices200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


