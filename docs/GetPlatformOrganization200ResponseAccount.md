
# GetPlatformOrganization200ResponseAccount


## Properties

Name | Type
------------ | -------------
`alertEmails` | Array&lt;string&gt;
`alertIntegrationIssues` | boolean
`alertNewOrders` | boolean
`alertStatusChanges` | boolean
`displayName` | string
`id` | string
`organizationId` | string
`slug` | string
`supportEmail` | string
`websiteUrl` | string

## Example

```typescript
import type { GetPlatformOrganization200ResponseAccount } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "alertEmails": null,
  "alertIntegrationIssues": null,
  "alertNewOrders": null,
  "alertStatusChanges": null,
  "displayName": null,
  "id": null,
  "organizationId": null,
  "slug": null,
  "supportEmail": null,
  "websiteUrl": null,
} satisfies GetPlatformOrganization200ResponseAccount

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetPlatformOrganization200ResponseAccount
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


