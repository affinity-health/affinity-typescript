
# GetPlatformOrganization200Response


## Properties

Name | Type
------------ | -------------
`account` | [GetPlatformOrganization200ResponseAccount](GetPlatformOrganization200ResponseAccount.md)
`membership` | [GetPlatformOrganization200ResponseMembership](GetPlatformOrganization200ResponseMembership.md)
`user` | [GetPlatformOrganization200ResponseUser](GetPlatformOrganization200ResponseUser.md)

## Example

```typescript
import type { GetPlatformOrganization200Response } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "account": null,
  "membership": null,
  "user": null,
} satisfies GetPlatformOrganization200Response

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetPlatformOrganization200Response
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


