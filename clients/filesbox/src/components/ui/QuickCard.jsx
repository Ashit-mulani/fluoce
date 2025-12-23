import React from "react";
import { FileIcon, FolderIcon } from "./Svg";
import { formatSize } from "@/utils/formatSize";
import Link from "next/link";
import FileCard from "../view/FileCard";
import getFileIcon from "@/utils/fileType";

export const QuickFolderCard = ({ folder }) => {
  return (
    <Link
      href={`/dashboard/folder/${folder?._id}`}
      className="flex h-40 cursor-pointer flex-col gap-1.5 overflow-hidden rounded-lg border p-1.5"
    >
      <div className="flex min-h-[80%] w-full items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900">
        <FolderIcon size={100} />
      </div>
      <div className="items-centerjustify-between flex min-h-[20%] w-full gap-2 rounded px-2 py-1 text-sm">
        <span className="line-clamp-1 flex-1 overflow-hidden font-medium break-all">
          {folder?.name}
        </span>
        <span className="mt-0.5 shrink-0 text-xs font-medium text-zinc-500">
          {formatSize(folder?.metaData?.size) || 0.0}
        </span>
      </div>
    </Link>
  );
};

export const QuickFileCard = ({ file }) => {
  return (
    <FileCard file={file}>
      <div className="flex h-40 cursor-pointer flex-col gap-1.5 overflow-hidden rounded-lg border p-1.5">
        <div className="flex min-h-[80%] w-full items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900">
          {getFileIcon(file?.metaData?.mimeType, "", 60) || (
            <FileIcon size={60} />
          )}
        </div>
        <div className="flex min-h-[20%] w-full items-center justify-between gap-2 rounded px-2 py-1 text-sm">
          <span className="line-clamp-1 items-start overflow-hidden font-medium break-all">
            {file?.fileName || "untitled file"}
          </span>
          <span className="mt-0.5 shrink-0 text-xs font-medium text-zinc-500">
            {formatSize(file?.metaData?.size) || 0.0}
          </span>
        </div>
      </div>
    </FileCard>
  );
};
