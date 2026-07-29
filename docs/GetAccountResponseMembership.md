# GetAccountResponseMembership

## Properties

| Name          | Type                |
| ------------- | ------------------- |
| `permissions` | Array&lt;string&gt; |
| `role`        | string              |
| `roleName`    | string              |
| `status`      | string              |

## Example

```typescript
import type { GetAccountResponseMembership } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  permissions: null,
  role: null,
  roleName: null,
  status: null,
} satisfies GetAccountResponseMembership;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetAccountResponseMembership;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
