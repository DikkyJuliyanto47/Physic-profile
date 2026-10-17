import {
  assertEditable,
  transition,
  type ContentActor,
  type ContentState,
} from "./content-workflow";

export function contentListScope(actor: ContentActor) {
  return actor.role === "SUPER_ADMIN" ? {} : { authorId: actor.id };
}

function allowed(check: () => unknown) {
  try {
    check();
    return true;
  } catch {
    return false;
  }
}

export function contentPermissions(actor: ContentActor, state: ContentState) {
  const superAdmin = actor.role === "SUPER_ADMIN";
  return {
    superAdmin,
    canEdit: allowed(() => assertEditable(actor, state)),
    // ADMIN deletion is a proposal; canonical deletion is always reviewed.
    canDelete:
      superAdmin || (actor.role === "ADMIN" && actor.id === state.authorId),
    canReview: allowed(() => transition(actor, state, "approve")),
  };
}
