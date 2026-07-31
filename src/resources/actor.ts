// Code generated from spec/affinity.openapi.json by scripts/generate-facade.ts. DO NOT EDIT.

export type AffinityActorType = "system" | "user";

export interface AffinityActor {
  id: string;
  type: AffinityActorType;
}

export function validateAffinityActor(actor: AffinityActor): AffinityActor {
  const id = actor.id.trim();
  if (!id || id.length > 200) {
    throw new Error("Affinity actor ID must contain 1 to 200 characters");
  }
  if (actor.type !== "user" && actor.type !== "system") {
    throw new Error("Affinity actor type must be user or system");
  }
  return { id, type: actor.type };
}

export function requireAffinityActor(actor: AffinityActor | undefined) {
  if (!actor) {
    throw new Error(
      "Patient and order requests require actor attribution; call affinity.withActor(...) first",
    );
  }
  return actor;
}
