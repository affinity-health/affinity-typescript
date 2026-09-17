/** Normalize JSON Schema null unions for the TypeScript generator's OpenAPI 3.0 reader.
 * The pinned 3.1 contract remains unchanged; only the temporary generator input is converted.
 */
export function generatorContract(value: unknown): any {
  if (Array.isArray(value)) return value.map(generatorContract);
  if (!value || typeof value !== "object") return value;
  const input = value as Record<string, any>;
  const output = Object.fromEntries(
    Object.entries(input).map(([key, child]) => [key, generatorContract(child)]),
  );
  if (Array.isArray(output.examples)) {
    output.example = output.examples[0];
    delete output.examples;
  }
  // These constraints have no equivalent in generated TypeScript object-key types.
  if (output.propertyNames) {
    output["x-json-schema-propertyNames"] = output.propertyNames;
    delete output.propertyNames;
  }
  if (output.prefixItems) {
    output["x-json-schema-prefixItems"] = output.prefixItems;
    output.items =
      output.prefixItems.length === 1 ? output.prefixItems[0] : { anyOf: output.prefixItems };
    delete output.prefixItems;
  }
  if (output.openapi) output.openapi = "3.0.3";
  for (const union of ["anyOf", "oneOf"] as const) {
    if (!Array.isArray(output[union])) continue;
    const members = output[union].flatMap((member: any) => member[union] ?? [member]);
    const nonNull = members.filter((member: any) => member.type !== "null");
    const unique = [
      ...new Map(nonNull.map((member: any) => [JSON.stringify(member), member])).values(),
    ] as any[];
    if (nonNull.length !== members.length) output.nullable = true;
    if (unique.length === 1) {
      delete output[union];
      Object.assign(output, unique[0], output.nullable ? { nullable: true } : {});
    } else output[union] = unique;
  }
  if (typeof output.exclusiveMinimum === "number") {
    output.minimum = output.exclusiveMinimum;
    output.exclusiveMinimum = true;
  }
  if (typeof output.exclusiveMaximum === "number") {
    output.maximum = output.exclusiveMaximum;
    output.exclusiveMaximum = true;
  }
  if (
    ["integer", "number", "string", "boolean"].includes(output.type) &&
    output.allOf?.every((member: any) => !member.$ref && !member.type)
  ) {
    const constraints = output.allOf;
    delete output.allOf;
    for (const constraint of constraints) Object.assign(output, constraint);
  }
  if (output.const !== undefined) {
    output.enum = [output.const];
    delete output.const;
  }
  // Disjoint literal tags describe an exclusive union. Preserve the alternatives
  // instead of letting typescript-fetch merge incompatible object properties.
  if (output.anyOf?.length > 1) {
    const members = output.anyOf as any[];
    const tag = Object.keys(members[0]?.properties ?? {}).find((key) => {
      const values = members.map((member) => member.properties?.[key]?.enum);
      return (
        members.every((member) => member.required?.includes(key)) &&
        values.every((value) => value?.length === 1) &&
        new Set(values.map((value) => value[0])).size === members.length
      );
    });
    if (tag) {
      output.oneOf = members;
      delete output.anyOf;
    }
  }
  return output;
}

if (import.meta.main) {
  await Bun.write(
    process.argv[3]!,
    JSON.stringify(generatorContract(await Bun.file(process.argv[2]!).json()), null, 2),
  );
}
