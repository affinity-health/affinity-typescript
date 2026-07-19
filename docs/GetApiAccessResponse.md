
# GetApiAccessResponse


## Properties

Name | Type
------------ | -------------
`apiKey` | [GetApiAccessResponseApiKey](GetApiAccessResponseApiKey.md)
`livemode` | boolean
`object` | string
`scopes` | Array&lt;string&gt;
`serviceAccount` | [GetApiAccessResponseServiceAccount](GetApiAccessResponseServiceAccount.md)

## Example

```typescript
import type { GetApiAccessResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "apiKey": null,
  "livemode": null,
  "object": null,
  "scopes": null,
  "serviceAccount": null,
} satisfies GetApiAccessResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetApiAccessResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


