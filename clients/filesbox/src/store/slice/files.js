import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {},
  reducers: {
    setFilesForFolder: (state, action) => {
      const { folderId, files } = action.payload;
      state[folderId] = files ?? [];
    },
    addFileToFolder: (state, action) => {
      const { folderId, file } = action.payload;
      if (!folderId) return;
      if (!state[folderId]) {
        state[folderId] = [];
      }
      state[folderId].unshift(file);
    },
    removeFileFromFolder: (state, action) => {
      const { folderId, fileId } = action.payload;
      if (!folderId) return;
      if (state[folderId]) {
        state[folderId] = state[folderId].filter((file) => file._id !== fileId);
      }
    },
    updateFileInFolder: (state, action) => {
      const { folderId, file } = action.payload;
      if (!folderId) return;
      if (state[folderId]) {
        const idx = state[folderId].findIndex((f) => f._id === file._id);
        if (idx !== -1) {
          state[folderId][idx] = {
            ...state[folderId][idx],
            ...file,
          };
        }
      }
    },
    clearFilesForFolder: (state, action) => {
      const { folderId } = action.payload;
      delete state[folderId];
    },
  },
});

export const {
  setFilesForFolder,
  addFileToFolder,
  removeFileFromFolder,
  updateFileInFolder,
  clearFilesForFolder,
} = filesSlice.actions;

export default filesSlice.reducer;
