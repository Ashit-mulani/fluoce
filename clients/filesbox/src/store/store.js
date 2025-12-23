import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user.js";
import usageSlice from "./slice/usage.js";
import recentUploadsSlice from "./slice/recentuploads.js";
import quickAccessSlice from "./slice/quickaccess.js";
import foldersSlice from "./slice/folders.js";
import activitySlice from "./slice/activity.js";
import filesSlice from "./slice/files.js";
import trashFilesSlice from "./slice/trashFiles.js";
import sharedFilesSlice from "./slice/sharedFile.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    usage: usageSlice,
    recentUploads: recentUploadsSlice,
    folders: foldersSlice,
    quickAccess: quickAccessSlice,
    activity: activitySlice,
    files: filesSlice,
    trashFiles: trashFilesSlice,
    sharedFiles: sharedFilesSlice,
  },
});

export default store;
