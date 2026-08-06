// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

export interface CursorListParams {
  endingBefore?: string;
  limit?: number;
  startingAfter?: string;
}

export interface CursorListResponse<Item extends { id: string }> {
  data: Item[];
  hasMore: boolean;
}

export type AutoPagingHandler<Item> = (item: Item) => boolean | void | Promise<boolean | void>;

export class CursorPagePromise<Item extends { id: string }, Page extends CursorListResponse<Item>>
  implements Promise<Page>, AsyncIterable<Item>
{
  readonly [Symbol.toStringTag] = "Promise";
  private firstPage?: Promise<Page>;

  constructor(
    private readonly params: CursorListParams,
    private readonly fetchPage: (params: CursorListParams) => Promise<Page>,
  ) {}

  then<TResult1 = Page, TResult2 = never>(
    onfulfilled?: ((value: Page) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.getFirstPage().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<Page | TResult> {
    return this.getFirstPage().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<Page> {
    return this.getFirstPage().finally(onfinally);
  }

  async autoPagingEach(handler: AutoPagingHandler<Item>): Promise<void> {
    for await (const item of this) {
      if ((await handler(item)) === false) return;
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<Item> {
    if (this.params.endingBefore) {
      throw new Error(
        "Automatic pagination does not support endingBefore; use startingAfter or omit both cursors",
      );
    }
    let params = { ...this.params };
    let page = await this.getFirstPage();

    while (true) {
      for (const item of page.data) yield item;
      if (!page.hasMore) return;
      const lastId = page.data.at(-1)?.id;
      if (!lastId) throw new Error("Affinity returned hasMore without a continuation item");
      params = { ...params, endingBefore: undefined, startingAfter: lastId };
      page = await this.fetchPage(params);
    }
  }

  private getFirstPage() {
    this.firstPage ??= this.fetchPage(this.params);
    return this.firstPage;
  }
}

export function cursorPage<
  Item extends { id: string },
  Page extends CursorListResponse<Item>,
  Params extends CursorListParams,
>(params: Params, fetchPage: (params: Params) => Promise<Page>) {
  return new CursorPagePromise<Item, Page>(params, (next) => fetchPage(next as Params));
}
