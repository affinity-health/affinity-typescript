import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Affinity } from "@affinity-health/sdk";
import { loadMedications, loadPractices } from "../setup";

export const Route = createFileRoute("/")({ component: Example });

function Example() {
  const [practices, setPractices] = useState<Affinity.PracticeList>();
  const [medications, setMedications] = useState<Affinity.MedicationList>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  async function act<T>(
    action: () => Promise<{ ok: true; value: T } | { ok: false; error: string }>,
    accept: (value: T) => void,
  ) {
    setPending(true);
    setError(undefined);
    try {
      const result = await action();
      if (result.ok) accept(result.value);
      else setError(result.error);
    } catch {
      setError("Connection interrupted. Try again.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main>
      <header>
        <p className="eyebrow">Affinity SDK · Test mode</p>
        <h1>Explore Test practices and medications.</h1>
        <p className="lede">
          Patient details are supplied through an order. This example performs reads only.
        </p>
      </header>
      <p role="status" aria-live="polite">
        {pending ? "Loading…" : ""}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <section>
        <h2>Platform practices</h2>
        <button
          type="button"
          disabled={pending}
          onClick={() => void act(() => loadPractices({ data: {} }), setPractices)}
        >
          Load practices
        </button>
        {practices && (
          <>
            <ul className="catalog">
              {practices.data.map((practice) => (
                <li key={practice.id}>
                  <div>
                    <strong>{practice.name}</strong>
                    <p>{practice.liveEnabled ? "Live enabled" : "Live not enabled"}</p>
                    <code>{practice.id}</code>
                  </div>
                </li>
              ))}
            </ul>
            <p>Showing {practices.data.length} practices on this page.</p>
            <button
              type="button"
              disabled={pending || !practices.hasMore || !practices.nextCursor}
              onClick={() =>
                void act(
                  () => loadPractices({ data: { startingAfter: practices.nextCursor! } }),
                  setPractices,
                )
              }
            >
              Next practices
            </button>
          </>
        )}
      </section>
      <section>
        <h2>Medications</h2>
        <button
          type="button"
          disabled={pending}
          onClick={() => void act(() => loadMedications({ data: {} }), setMedications)}
        >
          Load medications
        </button>
        {medications && (
          <>
            <ul className="catalog">
              {medications.data.map((medication) => (
                <li key={medication.id}>
                  <div>
                    <strong>{medication.name}</strong>
                    <p>
                      {[medication.strength, medication.form, medication.pharmacy.name]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <code>{medication.id}</code>
                    <details>
                      <summary>Medication requirements and shipping</summary>
                      <pre>{JSON.stringify(medication, null, 2)}</pre>
                    </details>
                  </div>
                </li>
              ))}
            </ul>
            {medications.data.length === 0 && <p>No medications.</p>}
            <button
              type="button"
              disabled={pending || !medications.hasMore || !medications.nextCursor}
              onClick={() =>
                void act(
                  () => loadMedications({ data: { startingAfter: medications.nextCursor! } }),
                  setMedications,
                )
              }
            >
              Next medications
            </button>
          </>
        )}
      </section>
      <p className="note">
        The API key stays on the server. This private Test demo uses a shared access password.
      </p>
    </main>
  );
}
