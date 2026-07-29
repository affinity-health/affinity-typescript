# GetAccountResponseAccount

## Properties

| Name                | Type                |
| ------------------- | ------------------- |
| `allowedOrigins`    | Array&lt;string&gt; |
| `allowedReturnUrls` | Array&lt;string&gt; |
| `displayName`       | string              |
| `id`                | string              |
| `object`            | string              |
| `slug`              | string              |
| `status`            | string              |
| `supportEmail`      | string              |
| `websiteUrl`        | string              |

## Example

```typescript
import type { GetAccountResponseAccount } from "@affinity-health/sdk";

// TODO: Update the object below with actual values
const example = {
  allowedOrigins: null,
  allowedReturnUrls: null,
  displayName: null,
  id: null,
  object: null,
  slug: null,
  status: null,
  supportEmail: null,
  websiteUrl: null,
} satisfies GetAccountResponseAccount;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GetAccountResponseAccount;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
