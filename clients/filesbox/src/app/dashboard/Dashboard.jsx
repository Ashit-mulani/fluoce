"use client";

import Folders from "@/components/view/dashboard/Usage/Folders";
import QuickAccess from "@/components/view/dashboard/Usage/QuickAccess";
import RecentUpload from "@/components/view/dashboard/Usage/RecentUpload";

const Dashboard = () => {
  return (
    <>
      <div className="flex md:flex-nowrap flex-wrap">
        <div className="flex flex-col md:w-[70%] w-full">
          <QuickAccess className="p-2 md:p-4" />
          <Folders className=" w-full md:p-4 p-2" />
        </div>
        <RecentUpload className="w-full md:w-[30%]" />
      </div>
    </>
  );
};

export default Dashboard;
