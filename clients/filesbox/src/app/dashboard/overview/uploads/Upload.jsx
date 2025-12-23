"use client";

import { uploadDB } from "@/lib/db/uploadDB";
import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { useSelector } from "react-redux";
import { PiUploadSimpleBold } from "react-icons/pi";
import getFileIcon from "@/utils/fileType";
import { formatSize } from "@/utils/formatSize";
import { formatSectionDate } from "@/utils/formatSectionDate";
import { Spinner } from "@/components/ui/spinner";

// Modified groupByDate to return entries array: [{section, items, sortKey}]
function groupByDate(items) {
  // We'll keep a record with the section name and one with the first item's date for sorting
  const res = {};
  items?.forEach((item) => {
    const group = formatSectionDate(item.createdAt);
    if (!res[group])
      res[group] = { section: group, items: [], sortKey: item.createdAt };
    res[group].items.push(item);
    // Update sortKey if this item is newer
    if (item.createdAt > res[group].sortKey) {
      res[group].sortKey = item.createdAt;
    }
  });
  // Convert to array & sort so newest section (by date) is first
  return Object.values(res).sort((a, b) => b.sortKey - a.sortKey);
}

function StatusBadge({ status }) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-[3px] text-xs text-amber-500">
          Pending
        </span>
      );
    case "ready":
      return (
        <span className="inline-flex items-center rounded-full bg-cyan-500/15 px-3 py-[3px] text-xs text-cyan-500">
          Ready
        </span>
      );
    case "uploading":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 p-0.5 px-1 text-xs text-blue-500">
          <Spinner /> uploading
        </span>
      );

    case "saving":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 p-0.5 px-1 text-xs text-blue-500">
          <Spinner /> saving
        </span>
      );
    case "success":
      return (
        <span className="inline-flex items-center rounded-full bg-green-500/15 px-3 py-[3px] text-xs text-green-600">
          Completed
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/15 px-3 py-[3px] text-xs text-red-500">
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-500/15 px-3 py-[3px] text-xs text-neutral-500">
          {status || "none"}
        </span>
      );
  }
}

export default function Upload() {
  const userId = useSelector((state) => state.user.user?._id);

  const tasks = useLiveQuery(
    () => uploadDB.uploads.where("userId").equals(userId).toArray(),
    [userId]
  );

  async function clearUpload(tempId) {
    await uploadDB.uploads.delete(tempId);
  }

  // Sorted sections with newest first
  const sectionEntries = groupByDate(tasks);

  return (
    <div className="mt-6 flex w-full justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <span className="line-clamp-1 flex items-center gap-2 truncate text-zinc-500 md:text-xl">
            <PiUploadSimpleBold className="shrink-0" />
            Upload Activity
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="mt-1 text-sm font-medium text-zinc-500">
              Review your recent uploads and track their status. You can clear
              it.
            </p>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600">
              This shows your recent uploads from this device — it may not be
              perfect.
            </span>
          </div>
        </div>
        {sectionEntries.length === 0 && (
          <div className="py-10 text-center text-sm text-zinc-400">
            No Upload activity found.
          </div>
        )}
        {sectionEntries.map((sectionObj) => (
          <div key={sectionObj.section} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {sectionObj.section}
            </h2>
            <div className="space-y-1">
              {sectionObj.items
                .sort((a, b) => b?.createdAt - a?.createdAt) // Still newest first within section
                .map((item) => (
                  <div
                    key={item?.tempId}
                    className="flex items-center justify-between gap-4 px-2 py-2"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <i className="shrink-0 text-zinc-600 dark:text-zinc-400">
                        {getFileIcon(item?.mimeType, "text-2xl", 20)}
                      </i>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                          {item?.fileName}
                        </span>
                        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-zinc-500">
                          <span className="shrink-0">
                            {item.size ? formatSize(item.size) : "—"}
                          </span>
                          <span className="truncate">{item?.mimeType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <StatusBadge status={item?.status} />
                      <button
                        className="inline-flex cursor-pointer items-center rounded-full bg-zinc-500/15 px-3 py-[3px] text-xs text-neutral-500 hover:text-red-500"
                        onClick={() => clearUpload(item?.tempId)}
                      >
                        clear
                      </button>
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
