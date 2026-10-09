/**
 * Temporarily omit session creation from SDK generation, and omit deprecated operations so the
 * SDK adds no methods that only fail; preserve the pinned API contract.
 */
export function sdkContract<T extends { paths?: Record<string, unknown> }>(spec: T): T {
  return {
    ...spec,
    paths: Object.fromEntries(
      Object.entries(spec.paths ?? {}).flatMap(([path, operations]) => {
        if (path === "/v1/hosted-sessions" || path === "/v1/component-sessions") return [];
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
