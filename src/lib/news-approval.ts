// Compatibility exports for the earlier News-only integration. Approval is centralized.
export {
  isContentApprovalReady as isNewsApprovalReady,
  CONTENT_APPROVAL_UNAVAILABLE as NEWS_APPROVAL_UNAVAILABLE,
  verifyContentActor as verifyNewsActor,
  contentError as newsActionError,
  requireApprovalReady as requireNewsApproval,
} from "./content-approval";
