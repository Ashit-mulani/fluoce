import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activity: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setActivity: (state, action) => {
      state.activity = action.payload || [];
    },
    addActivity: (state, action) => {
      state.activity.unshift(action.payload);
    },
  },
});

export const { setActivity, addActivity } = activitySlice.actions;

export default activitySlice.reducer;
