import React from "react";

const StatusCard = ({ title, status }) => {
  return (
    <div className="flex flex-col gap-3 items-start">
      <span className=" text-xs text-neutral-500">{title}</span>
      <div className="md:text-xl font-black dark:text-zinc-300 text-zinc-700">
        {status}
      </div>
    </div>
  );
};

export default StatusCard;
