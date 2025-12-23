import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trashFiles: [],
};

const trashFilesSlice = createSlice({
  name: "trashFiles",
  initialState,
  reducers: {
    setTrashFiles: (state, action) => {
      state.trashFiles = action.payload ?? [];
    },
    addTrashFile: (state, action) => {
      const incoming = action.payload;
      const exists = state.trashFiles.some(
        (file) => file?._id === incoming?._id
      );
      if (!exists) {
        state.trashFiles.push(incoming);
      }
    },
    removeTrashFile: (state, action) => {
      const fileId = action.payload;
      state.trashFiles = state.trashFiles.filter((file) => file._id !== fileId);
    },
  },
});

export const { addTrashFile, removeTrashFile, setTrashFiles } =
  trashFilesSlice.actions;

export default trashFilesSlice.reducer;
