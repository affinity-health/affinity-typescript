import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CatalogItem } from "@affinity-health/sdk";
import {
  preparePatient,
  loadCatalog,
  loadPractices,
  previewOrder,
  saveDraft,
  reviewAllergies,
  signOrder,
  refreshOrder,
} from "../setup";

export const Route = createFileRoute("/")({ component: Example });
type Success<T extends (...args: any[]) => any> = Extract<
  Awaited<ReturnType<T>>,
  { ok: true }
>["value"];
type Run = {
  runId: string;
  practiceId?: string;
  items?: string;
  npi?: "1234567893" | "1111111112";
  setup?: Success<typeof preparePatient>;
  preview?: Success<typeof previewOrder>;
  draft?: Success<typeof saveDraft>;
  outcome?: Success<typeof signOrder>;
};
const storageKey = "affinity-sdk-test-run-v2";
const json = (value: unknown) => JSON.stringify(value, null, 2);
const emptyItems = () =>
  json({ prescriptions: [], otcItems: [], shipping: { selection: "lowest_cost" } });
const money = (cents: number | null) =>
  cents === null
    ? "Not yet quoted"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

function Example() {
  const [run, setRun] = useState<Run>();
  const [practices, setPractices] = useState<Success<typeof loadPractices>>();
  const [directoryMode, setDirectoryMode] = useState<"test" | "live">("test");
  const [catalog, setCatalog] = useState<Success<typeof loadCatalog>>();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(emptyItems);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState<string>();
  const [allergies, setAllergies] = useState(false);
  const [attested, setAttested] = useState(false);
  const [npi, setNpi] = useState<"1234567893" | "1111111112">("1234567893");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const restored: Run = saved ? JSON.parse(saved) : { runId: crypto.randomUUID() };
      setRun(restored);
      setItems(restored.items ?? emptyItems());
      setNpi(restored.npi ?? "1234567893");
    } catch {
      setRun({ runId: crypto.randomUUID() });
    }
  }, []);
  useEffect(() => {
    void act("Loading practices", () => loadPractices({ data: {} }), setPractices);
  }, []);
  function persist(next: Run) {
    setRun(next);
    try {
      localStorage.setItem(storageKey, json(next));
    } catch {
      setError("Browser storage is unavailable. Keep this page open to preserve retry keys.");
    }
  }
  async function act<T>(
    label: string,
    fn: () => Promise<{ ok: true; value: T } | { ok: false; error: string }>,
    accept: (value: T) => void,
  ) {
    setPending(label);
    setError(undefined);
    try {
      const result = await fn();
      if (result.ok) accept(result.value);
      else setError(result.error);
    } catch {
      setError("Connection interrupted. Retry the same action using its saved mutation key.");
    } finally {
      setPending(undefined);
    }
  }
  function edit(value: string) {
    setItems(value);
    setAttested(false);
    if (run) persist({ ...run, items: value, preview: undefined });
  }
  function add(item: CatalogItem) {
    try {
      const input = JSON.parse(items);
      if (item.catalogKind === "prescription")
        input.prescriptions.push({ medicationId: item.id, preset: "default" });
      else input.otcItems.push({ catalogItemId: item.id, quantity: 1 });
      edit(json(input));
    } catch {
      setError("Fix the item JSON before adding another item.");
    }
  }
  const busy = Boolean(pending);
  const draft = run?.draft;
  return (
    <main>
      <header>
        <p className="eyebrow">Affinity SDK · Test mode</p>
        <h1>From your EMR to an order.</h1>
        <p className="lede">
          Real requests to the deployed API with synthetic data. Orders go to the simulator, never a
          dispensing pharmacy.
        </p>
      </header>
      <p role="status" aria-live="polite">
        {pending ? `${pending}…` : ""}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <section>
        <h2>Platform practices</h2>
        <p>
          Loaded with <code>affinity.practices.list()</code>. Live practices are read-only here.
          Ordering stays in Test mode.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void act(
              "Loading practices",
              () => loadPractices({ data: { mode: directoryMode } }),
              setPractices,
            )
          }
        >
          Refresh practices
        </button>
        {(["test", "live"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            disabled={busy}
            aria-pressed={directoryMode === mode}
            onClick={() =>
              void act(
                "Loading practices",
                () => loadPractices({ data: { mode } }),
                (result) => {
                  setDirectoryMode(mode);
                  setPractices(result);
                },
              )
            }
          >
            {mode === "test" ? "Test practices" : "Live practices"}
          </button>
        ))}
        {practices && (
          <>
            <ul className="catalog">
              {practices.data.map((practice) => (
                <li key={practice.id}>
                  <div>
                    <strong>{practice.name}</strong>
                    <p>
                      {practice.liveEnabled ? "Live enabled" : "Live not enabled"} ·{" "}
                      {practice.livemode ? "Live data" : "Test data"}
                    </p>
                    <code>{practice.id}</code>
                  </div>
                  <button
                    type="button"
                    disabled={busy || !run || Boolean(run.setup) || practice.livemode}
                    aria-pressed={run?.practiceId === practice.id}
                    onClick={() => {
                      if (run) persist({ runId: crypto.randomUUID(), practiceId: practice.id });
                    }}
                  >
                    {practice.livemode
                      ? "Read only"
                      : run?.practiceId === practice.id
                        ? "Selected"
                        : "Use practice"}
                  </button>
                </li>
              ))}
            </ul>
            {practices.data.length === 0 && <p>No practices are visible in this mode.</p>}
            <p>Showing {practices.data.length} practices on this page.</p>
            <button
              type="button"
              disabled={busy || !practices.hasMore}
              onClick={() =>
                void act(
                  "Loading practices",
                  () =>
                    loadPractices({
                      data: { mode: directoryMode, startingAfter: practices.data.at(-1)?.id },
                    }),
                  setPractices,
                )
              }
            >
              Next practices
            </button>
          </>
        )}
        {run?.setup && (
          <p>Practice selection is locked for this run. Start a new Test run to switch.</p>
        )}
      </section>
      <section>
        <h2>1. Test patient</h2>
        <p>
          Synthetic SDK Patient · January 1, 1990
          <br />
          100 Test St, Austin, TX 78701
        </p>
        {!run?.setup ? (
          <button
            type="button"
            disabled={busy || !run?.practiceId || directoryMode !== "test"}
            onClick={() => {
              if (!run?.practiceId) return;
              persist(run);
              void act(
                "Preparing patient",
                () => preparePatient({ data: { runId: run.runId, practiceId: run.practiceId! } }),
                (setup) => persist({ ...run, setup }),
              );
            }}
          >
            Create synthetic patient
          </button>
        ) : (
          <>
            <p>
              {run.setup.practice.name}
              <br />
              <code>{run.setup.patient.id}</code>
            </p>
            <label className="check">
              <input
                type="checkbox"
                checked={allergies}
                disabled={busy || Boolean(draft)}
                onChange={(e) => setAllergies(e.target.checked)}
              />
              For this synthetic scenario, I reviewed the allergy history and confirm no known
              allergies.
            </label>
          </>
        )}
      </section>
      {run?.setup && !draft && (
        <section>
          <h2>2. Prescriptions and OTC items</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void act(
                "Loading catalog",
                () => loadCatalog({ data: { query, practiceId: run.setup!.practice.id } }),
                setCatalog,
              );
            }}
          >
            <label htmlFor="catalog-search">Catalog search</label>
            <input
              id="catalog-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Medication or supply name"
            />
            <button disabled={busy} type="submit">
              Load catalog
            </button>
          </form>
          {catalog && (
            <>
              <ul className="catalog">
                {catalog.data.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.strength} · {item.pharmacyName} · {item.catalogKind}
                        {item.coldShip ? " · Cold shipping" : ""}
                      </p>
                      <code>{item.id}</code>
                    </div>
                    <button
                      type="button"
                      disabled={
                        busy ||
                        !item.isOrderable ||
                        !["prescription", "otc"].includes(item.catalogKind)
                      }
                      onClick={() => add(item)}
                    >
                      {item.catalogKind === "prescription" ? "Add Rx" : "Add OTC"}
                    </button>
                  </li>
                ))}
              </ul>
              {catalog.data.length === 0 && <p>No matching catalog items.</p>}
              <p>Showing {catalog.data.length} items on this page.</p>
              <button
                type="button"
                disabled={busy || !catalog.hasMore}
                onClick={() =>
                  void act(
                    "Loading next page",
                    () =>
                      loadCatalog({
                        data: {
                          query,
                          practiceId: run.setup!.practice.id,
                          startingAfter: catalog.data.at(-1)?.id,
                        },
                      }),
                    setCatalog,
                  )
                }
              >
                Next page
              </button>
            </>
          )}
          <h3>
            <label htmlFor="items">SDK preview input</label>
          </h3>
          <p>
            Add items above. Edit JSON for custom SIGs, quantities, clinical fields, or
            per-prescription shipping. Use lowest_cost or fastest for automatic shipping.
          </p>
          <textarea
            id="items"
            spellCheck={false}
            rows={14}
            value={items}
            disabled={busy}
            onChange={(e) => edit(e.target.value)}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void act(
                "Calculating defaults and shipping",
                () =>
                  previewOrder({
                    data: { patientToken: run.setup!.patientToken, itemsJson: items },
                  }),
                (preview) => persist({ ...run, preview }),
              )
            }
          >
            Preview defaults and shipping
          </button>
          {run.preview && (
            <div>
              <h3>Preview: {run.preview.result.status}</h3>
              <p>Grouped shipping: {money(run.preview.result.totals.shippingTotalCents)}</p>
              <Json value={run.preview.result} />
              <button
                type="button"
                disabled={busy || !run.preview.previewToken || !allergies}
                onClick={() =>
                  void act(
                    "Saving allergy history and draft",
                    async () => {
                      const allergy = await reviewAllergies({
                        data: { token: run.setup!.patientToken, confirmed: true },
                      });
                      if (!allergy.ok) return allergy;
                      return saveDraft({ data: { token: run.preview!.previewToken! } });
                    },
                    (draft) => {
                      setAttested(false);
                      persist({ ...run, draft });
                    },
                  )
                }
              >
                Save unsigned draft
              </button>
            </div>
          )}
        </section>
      )}
      {draft && (
        <section>
          <h2>3. Review and sign</h2>
          <p>
            <code>{draft.order.id}</code> · {draft.order.status}
          </p>
          {draft.order.prescriptions.map((rx) => (
            <article key={rx.id}>
              <h3>{rx.medicationName}</h3>
              <p>{rx.directions}</p>
              <p>
                Quantity {String(rx.quantity)} {rx.quantityUnit} ·{" "}
                {String(rx.daysSupply ?? "Unspecified")} days · {rx.refills} refills · version{" "}
                {rx.version}
              </p>
            </article>
          ))}
          <Json value={draft.order} />
          <label htmlFor="npi">Test prescriber NPI</label>
          <select
            id="npi"
            value={npi}
            disabled={busy || Boolean(run?.outcome)}
            onChange={(e) => {
              const next = e.target.value as typeof npi;
              setNpi(next);
              persist({ ...run!, npi: next });
              setAttested(false);
            }}
          >
            <option value="1234567893">1234567893</option>
            <option value="1111111112">1111111112</option>
          </select>
          <label className="check">
            <input
              type="checkbox"
              checked={attested}
              disabled={busy}
              onChange={(e) => setAttested(e.target.checked)}
            />
            I reviewed this exact Test order, including each prescription, OTC item and shipping
            choice, and authorize simulated signing and submission for this Test prescriber.
          </label>
          <button
            type="button"
            disabled={busy || !attested || Boolean(run?.outcome)}
            onClick={() =>
              void act(
                "Signing and sending to simulator",
                () => signOrder({ data: { token: draft.reviewToken, npi, attested: true } }),
                (outcome) => persist({ ...run!, outcome }),
              )
            }
          >
            Sign and send Test order
          </button>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() =>
              void act(
                "Refreshing order",
                () => refreshOrder({ data: { token: draft.reviewToken } }),
                (next) => {
                  setAttested(false);
                  persist({ ...run!, draft: next });
                },
              )
            }
          >
            Refresh status / review
          </button>
          {run?.outcome && (
            <>
              <h3>Submission response</h3>
              <p>
                Queued submission is not pharmacy acceptance. Refresh to see simulator processing
                and fulfillment events.
              </p>
              <Json value={run.outcome} />
            </>
          )}
        </section>
      )}
      {run && (
        <button
          className="secondary"
          type="button"
          disabled={busy}
          onClick={() => {
            if (
              !window.confirm(
                "Start a new Test run? The current order stays in Affinity. Its local retry record will be replaced.",
              )
            )
              return;
            persist({ runId: crypto.randomUUID() });
            setAllergies(false);
            setAttested(false);
            setCatalog(undefined);
            setError(undefined);
            setItems(emptyItems());
          }}
        >
          Start a new Test run
        </button>
      )}
      <p className="note">
        The API key stays on the server. This shared-password example is for integration testing,
        not a production EMR identity system. NPI identifies the Test prescriber; it is not
        authentication.
      </p>
    </main>
  );
}
function Json({ value }: { value: unknown }) {
  return (
    <details open>
      <summary>Full API response</summary>
      <pre>{json(value)}</pre>
    </details>
  );
}
