import { createSelector } from "reselect";

export const selectFilesForFolder = (folderId) =>
  createSelector([(state) => state.files], (files) => files[folderId] ?? []);
