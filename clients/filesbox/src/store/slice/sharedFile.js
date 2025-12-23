import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shared: [],
  sharedWithMe: [],
};

const sharedFilesSlice = createSlice({
  name: "sharedFiles",
  initialState,
  reducers: {
    setSharedFiles: (state, action) => {
      state.shared = action.payload ?? [];
    },
    addSharedFile: (state, action) => {
      const incoming = action.payload;
      const exists = state.shared.some(
        (shared) => shared?._id === incoming?._id
      );
      if (!exists) {
        state.shared.push(incoming);
      }
    },
    removeSharedFile: (state, action) => {
      const sharedId = action.payload;
      state.shared = state.shared.filter((shared) => shared._id !== sharedId);
    },
    setSharedWithMe: (state, action) => {
      state.sharedWithMe = action.payload ?? [];
    },
  },
});

export const {
  setSharedFiles,
  addSharedFile,
  removeSharedFile,
  setSharedWithMe,
} = sharedFilesSlice.actions;

export default sharedFilesSlice.reducer;
