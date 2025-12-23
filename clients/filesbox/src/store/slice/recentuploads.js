import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recentUploads: [],
};

const recentUploadsSlice = createSlice({
  name: "recentUploads",
  initialState,
  reducers: {
    setRecentUploads: (state, action) => {
      state.recentUploads = action?.payload?.slice(0, 8);
    },

    addRecentUpload: (state, action) => {
      const newUpload = action.payload;

      state.recentUploads.unshift(newUpload);

      if (state.recentUploads.length > 8) {
        state.recentUploads.pop();
      }
    },
    updateRecentUpload: (state, action) => {
      const updatedFile = action.payload;
      const index = state.recentUploads.findIndex(
        (file) => file._id === updatedFile._id
      );
      if (index !== -1) {
        state.recentUploads[index] = {
          ...state.recentUploads[index],
          ...updatedFile,
        };
      }
    },
    removeRecentUpload: (state, action) => {
      const fileId = action.payload;
      state.recentUploads = state.recentUploads.filter(
        (file) => file._id !== fileId
      );
    },
  },
});

export const {
  setRecentUploads,
  addRecentUpload,
  updateRecentUpload,
  removeRecentUpload,
} = recentUploadsSlice.actions;

export default recentUploadsSlice.reducer;
