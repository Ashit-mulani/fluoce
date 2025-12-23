"use client";

import { setActivity } from "@/store/slice/activity";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuFileSymlink } from "react-icons/lu";
import { LuActivity } from "react-icons/lu";
import { FolderIcon } from "@/components/ui/Svg";
import { FaFileLines } from "react-icons/fa6";
import { formatSectionDate } from "@/utils/formatSectionDate";

const ACTIVITY_ICONS = {
  created_file: <FaFileLines size={21} className="text-blue-500" />,
  updated_file: <FaFileLines size={21} className="text-blue-500" />,
  created_folder: <FolderIcon size={22} />,
  updated_folder: <FolderIcon size={22} />,
  shared: <LuFileSymlink size={21} className="text-purple-500" />,
};

const ACTIVITY_LABEL = {
  created_file: "Created File",
  updated_file: "Updated File",
  created_folder: "Created Folder",
  updated_folder: "Updated Folder",
  shared: "Shared File",
};

const groupByDate = (items) => {
  const groups = {};

  items?.forEach((item) => {
    const group = formatSectionDate(item.time);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  });

  return groups;
};

export default function Activity({ data }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivity(data.data.activityData));
  }, [data]);

  const { activity } = useSelector((state) => state.activity);

  const grouped = groupByDate(activity);

  return (
    <div className="w-full flex justify-center mt-6 px-4">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <span className="md:text-xl text-zinc-500 flex items-center gap-2 shrink-0 line-clamp-1 truncate">
            <LuActivity className="shrink-0 " />
            Activity
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Review your recent activity and track changes or actions made in
              your files, folders and shares.
            </p>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
              This is only some activity — it may not be perfect.
            </span>
          </div>
        </div>
        {Object.keys(grouped).length === 0 && (
          <div className="text-center text-zinc-400 py-10 text-sm">
            No activity found.
          </div>
        )}
        {Object.keys(grouped).map((section) => (
          <div key={section} className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-3">
              {section}
            </h2>
            <div className="space-y-1">
              {grouped[section].map((item) => (
                <div
                  key={`${item.id}_${item.time}`}
                  className="flex items-center justify-between px-2 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{ACTIVITY_ICONS[item.type]}</div>
                    <div className="flex flex-col">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {ACTIVITY_LABEL[item.type]}
                      </span>
                      <span className="text-xs text-zinc-500">{item.name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {new Date(item.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
