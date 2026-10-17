/** Deprecated operations remain pinned for history, but are not callable in this SDK. */
export function sdkContract<T extends { paths?: Record<string, unknown> }>(spec: T): T {
  return {
    ...spec,
    paths: Object.fromEntries(
      Object.entries(spec.paths ?? {}).flatMap(([path, operations]) => {
        const current = Object.fromEntries(
          Object.entries(operations as Record<string, { deprecated?: boolean }>).filter(
            ([, operation]) => !operation?.deprecated,
          ),
        );
        return Object.keys(current).length ? [[path, current]] : [];
      }),
    ),
  };
}
