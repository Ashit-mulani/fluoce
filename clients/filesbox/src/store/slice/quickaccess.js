import { createSlice } from "@reduxjs/toolkit";

const MAX_ITEMS = 2;

/**
 * Load from localStorage using a key with userId appended.
 * @param {string} key
 * @param {string} userId
 */
const load = (key, userId) => {
  if (typeof window === "undefined") return [];
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`${key}_${userId}`)) || [];
  } catch {
    return [];
  }
};

/**
 * Save to localStorage using a key with userId appended.
 * @param {string} key
 * @param {any} value
 * @param {string} userId
 */
const save = (key, value, userId) => {
  if (typeof window === "undefined") return;
  if (!userId) return;
  localStorage.setItem(`${key}_${userId}`, JSON.stringify(value));
};

const initialState = {
  folders: [],
  files: [],
};

const getId = (item) => item._id || item.id;

const quickAccessSlice = createSlice({
  name: "quickAccess",
  initialState,
  reducers: {
    // Accept userId as payload for loading with user context
    loadQuickAccess: (state, action) => {
      if (typeof window === "undefined") return;
      const userId = action?.payload?.userId;
      state.folders = load("quickAccess_folders", userId);
      state.files = load("quickAccess_files", userId);
    },
    // Accept userId in payload for saving with user context
    addFolderAccess: {
      prepare: (folder, userId) => ({
        payload: { folder, userId },
      }),
      reducer: (state, action) => {
        const { folder, userId } = action.payload;
        let filtered = state.folders.filter((f) => getId(f) !== getId(folder));
        filtered.unshift(folder);
        if (filtered.length > MAX_ITEMS) {
          filtered = filtered.slice(0, MAX_ITEMS);
        }
        state.folders = filtered;
        save("quickAccess_folders", state.folders, userId);
      },
    },
    addFileAccess: {
      prepare: (file, userId) => ({
        payload: { file, userId },
      }),
      reducer: (state, action) => {
        const { file, userId } = action.payload;
        let filtered = state.files.filter((f) => getId(f) !== getId(file));
        filtered.unshift(file);
        if (filtered.length > MAX_ITEMS) {
          filtered = filtered.slice(0, MAX_ITEMS);
        }
        state.files = filtered;
        save("quickAccess_files", state.files, userId);
      },
    },
    removeFolderAccess: {
      prepare: (folder, userId) => ({
        payload: { folder, userId },
      }),
      reducer: (state, action) => {
        const { folder, userId } = action.payload;
        let filtered = state.folders.filter((f) => getId(f) !== getId(folder));
        state.folders = filtered;
        save("quickAccess_folders", state.folders, userId);
      },
    },
    removeFileAccess: {
      prepare: (file, userId) => ({
        payload: { file, userId },
      }),
      reducer: (state, action) => {
        const { file, userId } = action.payload;
        let filtered = state.files.filter((f) => getId(f) !== getId(file));
        state.files = filtered;
        save("quickAccess_files", state.files, userId);
      },
    },
  },
});

export const {
  loadQuickAccess,
  addFolderAccess,
  addFileAccess,
  removeFolderAccess,
  removeFileAccess,
} = quickAccessSlice.actions;

export default quickAccessSlice.reducer;
