import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
};

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload ?? [];
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter(
        (folder) => folder._id !== action.payload
      );
    },
    updateFolderData: (state, action) => {
      const idx = state.folders.findIndex(
        (folder) => folder._id === action.payload._id
      );
      if (idx !== -1) {
        state.folders[idx] = {
          ...state.folders[idx],
          ...action.payload,
        };
      }
    },
  },
});

export const { setFolders, addFolder, removeFolder, updateFolderData } =
  foldersSlice.actions;

export default foldersSlice.reducer;
