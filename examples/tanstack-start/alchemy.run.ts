import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";

// This public SDK demo has its own stack. It does not own any Affinity product resources.
// Retain .alchemy state on this deployment machine. Never deploy from a second empty state.
export default Alchemy.Stack(
  "affinity-sdk-example",
  {
    providers: Cloudflare.providers(),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const site = yield* Cloudflare.Website.Vite("EmrExample", {
      name: "affinity-sdk-emr-example",
      rootDir: ".",
      compatibility: { flags: ["nodejs_compat", "nodejs_compat_populate_process_env"] },
      env: {
        AFFINITY_EXAMPLE_API_KEY: Config.redacted("AFFINITY_EXAMPLE_API_KEY").pipe(
          Config.withDefault(Redacted.make("")),
        ),
        AFFINITY_EXAMPLE_PRACTICE_ID: Config.string("AFFINITY_EXAMPLE_PRACTICE_ID").pipe(
          Config.withDefault(""),
        ),
        AFFINITY_EXAMPLE_PASSWORD: Config.redacted("AFFINITY_EXAMPLE_PASSWORD").pipe(
          Config.withDefault(Redacted.make("")),
        ),
      },
    });
    return { url: site.url };
  }),
);
