
# GetApiAccess200Response


## Properties

Name | Type
------------ | -------------
`apiKey` | [GetApiAccess200ResponseApiKey](GetApiAccess200ResponseApiKey.md)
`livemode` | boolean
`object` | string
`scopes` | Array&lt;string | null&gt;
`serviceAccount` | [GetApiAccess200ResponseServiceAccount](GetApiAccess200ResponseServiceAccount.md)

## Example

```typescript
import type { GetApiAccess200Response } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "apiKey": null,
  "livemode": null,
  "object": null,
  "scopes": null,
  "serviceAccount": null,
} satisfies GetApiAccess200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetApiAccess200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


