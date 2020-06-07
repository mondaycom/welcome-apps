import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export const BIGBRAIN_KINDS = {
  FILE_ADDED: "online_docs_viewer_file_added",
  FILE_EDITED: "online_docs_viewer_file_edited",
  FILE_DELETED: "online_docs_viewer_file_deleted",
  FILE_CLICKED: "online_docs_viewer_file_clicked",
  COLLAPSE_CLICKED: "online_docs_viewer_collapse_clicked",
  FILE_MENU_CLICKED: "online_docs_viewer_file_menu_clicked",
  ADD_FILE_CLICKED: "online_docs_viewer_add_file_clicked",
};

export const bigBrainTrack = (kind, data = {}) => {
  monday.execute("track", { name: kind, data });
};
