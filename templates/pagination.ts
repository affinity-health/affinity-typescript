export type Cursor = { startingAfter?: string | null; endingBefore?: string | null };
type Page = { data: Array<{ id: string }>; hasMore: boolean };

/** Await one page, or iterate records across pages without changing the list call. */
export type ApiListPromise<P extends Page> = Promise<P> &
  AsyncIterable<P["data"][number]> & {
    autoPagingToArray(options: { limit: number }): Promise<P["data"]>;
  };

export function paginate<P extends Page>(
  fetchPage: (cursor: Cursor) => Promise<P>,
  cursor: Cursor,
): ApiListPromise<P> {
  const first = fetchPage(cursor);
  async function* iterate() {
    let page = await first;
    let previous = cursor.endingBefore ?? cursor.startingAfter;
    for (;;) {
      yield* cursor.endingBefore ? [...page.data].reverse() : page.data;
      if (!page.hasMore) return;
      const next = cursor.endingBefore ? page.data[0]?.id : page.data.at(-1)?.id;
      if (!next || next === previous) throw new Error("Pagination did not advance its cursor");
      previous = next;
      page = await fetchPage(
        cursor.endingBefore ? { endingBefore: next } : { startingAfter: next },
      );
    }
  }
  return Object.assign(first, {
    [Symbol.asyncIterator]: iterate,
    async autoPagingToArray({ limit }: { limit: number }): Promise<P["data"]> {
      if (!Number.isInteger(limit) || limit < 1)
        throw new Error("Pagination limit must be a positive integer");
      const data: P["data"] = [];
      for await (const item of iterate()) {
        data.push(item);
        if (data.length >= limit) break;
      }
      return data;
    },
  });
}
