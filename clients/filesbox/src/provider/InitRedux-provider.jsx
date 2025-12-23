"use client";

import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setFolders } from "@/store/slice/folders";
import { setRecentUploads } from "@/store/slice/recentuploads";
import store from "@/store/store";
import { setUsage } from "@/store/slice/usage";

export default function InitReduxProvider({ children, dashboardData }) {
  return (
    <Provider store={store}>
      <InitRedux data={dashboardData} />
      {children}
    </Provider>
  );
}

function InitRedux({ data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.data?.dashboardData) {
      dispatch(setFolders(data.data.dashboardData.folders));
      dispatch(setRecentUploads(data.data.dashboardData.recentUpload));
      dispatch(setUsage(data.data.dashboardData.storage));
    }
  }, [data]);

  return null;
}
