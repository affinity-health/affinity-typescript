import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createTestPractice } from "../setup";

export const Route = createFileRoute("/")({ component: Example });

type Setup = Awaited<ReturnType<typeof createTestPractice>>;

function Example() {
  const [result, setResult] = useState<Setup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function create() {
    setPending(true);
    setError(null);
    try {
      setResult(await createTestPractice());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the Test practice.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <p className="eyebrow">Affinity TypeScript SDK</p>
      <h1>Create a complete Test practice.</h1>
      <p className="lede">
        This server-side example creates a synthetic practice, provider user, role, membership, and
        verified provider mapping with Test NPI <code>1234567893</code>.
      </p>
      <button disabled={pending} onClick={create} type="button">
        {pending ? "Creating…" : "Create Test practice"}
      </button>
      {error ? <p className="error">{error}</p> : null}
      {result ? (
        <section>
          <strong>Ready to prescribe in Test mode</strong>
          <dl>
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
      <p className="note">
        The API key stays on the server. This example refuses Live-mode keys. Signing still uses the
        normal provider-held Affinity PIN.
      </p>
    </main>
  );
}
