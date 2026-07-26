
# CreatePracticeRoleResponse


## Properties

Name | Type
------------ | -------------
`description` | string
`id` | string
`name` | string
`object` | string
`permissions` | Array&lt;string&gt;
`_protected` | boolean

## Example

```typescript
import type { CreatePracticeRoleResponse } from '@affinity-health/sdk'

// TODO: Update the object below with actual values
const example = {
  "description": null,
  "id": null,
  "name": null,
  "object": null,
  "permissions": null,
  "_protected": null,
} satisfies CreatePracticeRoleResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePracticeRoleResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


