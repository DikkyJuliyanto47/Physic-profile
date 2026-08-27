export { createUniversity, updateUniversity, deleteUniversity } from "./university";
export { createNews, updateNews, deleteNews, toggleNewsStatus } from "./news";
export { createEvent, updateEvent, deleteEvent, toggleEventStatus } from "./event";
export { createMember, updateMember, deleteMember, toggleMemberActive } from "./member";
export { createDocument, updateDocument, deleteDocument, toggleDocumentVisibility } from "./document";
export {
  createGallery,
  updateGallery,
  deleteGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "./gallery";
export { createPublication, updatePublication, deletePublication } from "./publication";
export {
  createManagementPeriod,
  updateManagementPeriod,
  deleteManagementPeriod,
  setActiveManagementPeriod,
  createManagementPosition,
  updateManagementPosition,
  deleteManagementPosition,
} from "./management";
export { markAsRead, markAsUnread, deleteMessage } from "./message";
