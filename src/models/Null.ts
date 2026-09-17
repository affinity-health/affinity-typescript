// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

export type Null = null;
export function NullFromJSON(value: unknown): Null {
  return NullFromJSONTyped(value, false);
}
export function NullFromJSONTyped(value: unknown, _ignoreDiscriminator: boolean): Null {
  if (value !== null) throw new TypeError("Expected null");
  return null;
}
export function NullToJSON(value: Null): null {
  return value;
}
export function NullToJSONTyped(value: Null, _ignoreDiscriminator: boolean = false): null {
  return value;
}
