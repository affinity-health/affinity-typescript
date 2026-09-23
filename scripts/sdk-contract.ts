/** Temporarily omit session creation from SDK generation; preserve the pinned API contract. */
export function sdkContract<T extends { paths?: Record<string, unknown> }>(spec: T): T {
  return {
    ...spec,
    paths: Object.fromEntries(
      Object.entries(spec.paths ?? {}).filter(
        ([path]) => path !== "/v1/hosted-sessions" && path !== "/v1/component-sessions",
      ),
    ),
  };
}
