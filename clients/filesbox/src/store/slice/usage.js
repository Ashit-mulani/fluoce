import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  usage: null,
  trashFolders: [],
};

const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {
    setUsage: (state, action) => {
      state.usage = action.payload;
    },
    setTrashFolders: (state, action) => {
      state.trashFolders = action.payload;
    },
    addTrashFolder: (state, action) => {
      const folder = action.payload;
      if (!state.trashFolders.find((f) => f._id === folder._id)) {
        state.trashFolders.push(folder);
      }
    },
    removeTrashFolder: (state, action) => {
      const folderId = action.payload;
      state.trashFolders = state.trashFolders.filter((f) => f._id !== folderId);
    },
  },
});

export const { setUsage, setTrashFolders, addTrashFolder, removeTrashFolder } =
  usageSlice.actions;

export default usageSlice.reducer;
