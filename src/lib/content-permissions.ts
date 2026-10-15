import { assertEditable, transition } from "./content-workflow";
import type { ContentActor, ContentState, ReviewOperation } from "./content-workflow";
import { publishedContent } from "./content-visibility";

export function contentListScope(actor: ContentActor) {
  return actor.role === "SUPER_ADMIN" ? {} : {
    AND: [{ OR: [{ authorId: actor.id }, { ...publishedContent }] }],
  };
}

function allowed(check: () => unknown) {
  try {
    check();
    return true;
  } catch {
    return false;
  }
}

export function contentPermissions(actor: ContentActor | null, state?: ContentState) {
  const superAdmin = actor?.role === "SUPER_ADMIN";
  const canCreate = superAdmin || actor?.role === "ADMIN";
  const canEdit = Boolean(actor && state && allowed(() => assertEditable(actor, state)));
  const can = (operation: ReviewOperation) => Boolean(
    actor && state && allowed(() => transition(actor, state, operation)),
  );
  return {
    superAdmin, canCreate, canEdit, canDelete: canEdit,
    canView: Boolean(actor && state && (superAdmin || state.authorId === actor.id)),
    canSubmit: can("submit"), canReview: can("approve"),
  };
}
