"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatSize } from "@/utils/formatSize";
import { LuDatabaseZap } from "react-icons/lu";
import { setTrashFolders, setUsage } from "@/store/slice/usage";
import StatusCard from "@/components/view/dashboard/Usage/StatusCard";
import Wrapper from "@/components/view/dashboard/wrapper/Wrapper";
import { HiDotsVertical } from "react-icons/hi";
import { MdFolderOff } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuRefreshCw } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  useDeleteFolder,
  useTrashFolder,
} from "@/hooks/tanstack/folder-tanstack";
import { FolderIcon } from "@/components/ui/Svg";

const Storage = ({ className, data }) => {
  const dispatch = useDispatch();

  const { mutate } = useDeleteFolder();

  const { mutate: mutateTrash } = useTrashFolder();

  useEffect(() => {
    dispatch(setUsage(data?.data?.storage));
    dispatch(setTrashFolders(data?.data?.trashFolders));
  }, [data]);

  const { usage, trashFolders } = useSelector((state) => state.usage);

  const items = [
    {
      title: "Available Storage",
      value: formatSize(usage?.metaData?.storageLimit),
    },
    {
      title: "Usage Storage",
      value: formatSize(usage?.metaData?.usedStorage),
    },
    {
      title: "Total Files",
      value: usage?.metaData?.totalFiles,
    },
    {
      title: "Trash Storage",
      value: formatSize(usage?.metaData?.trashSize),
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        <Wrapper
          className={`${className} flex justify-between gap-2 flex-wrap md:p-4 p-2 w-full`}
        >
          <div className="flex flex-col gap-4 w-full">
            <span className="md:text-xl text-zinc-500 flex items-center gap-2">
              <LuDatabaseZap />
              Storage Usage
            </span>
            <div className="flex items-start justify-between w-full gap-4 flex-wrap">
              {items.map((item, i) => (
                <StatusCard key={i} title={item.title} status={item.value} />
              ))}
            </div>
          </div>
        </Wrapper>
        <Wrapper className="flex flex-col gap-4 md:p-4 p-2 w-full">
          <span className="md:text-xl text-zinc-500 flex items-center gap-2">
            <MdFolderOff />
            Trash Folder
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 lg:gap-4 gap-2">
            {trashFolders?.length > 0 ? (
              trashFolders?.map((tf) => (
                <div
                  key={tf._id}
                  className="flex flex-col gap-1.5 p-1.5 w-full h-36 border shadow rounded-md overflow-hidden"
                >
                  <div className="w-full h-[75%] bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded flex items-center justify-center">
                    <FolderIcon size={60} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer h-[25%] w-full flex items-center justify-between gap-2 p-2 bg-zinc-50 dark:bg-zinc-900 rounded">
                        <span className="flex-1 line-clamp-1 overflow-hidden text-sm text-start">
                          {tf.name}
                        </span>
                        <button className="cursor-pointer">
                          <HiDotsVertical />
                        </button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="m-2 w-60">
                      <DropdownMenuLabel>
                        <div className="flex items-end justify-between gap-8 font-medium ">
                          <span className="line-clamp-1 truncate">
                            {tf?.name}
                          </span>
                          <span className="text-xs text-zinc-500 shrink-0">
                            {formatSize(tf?.metaData?.size) || 0.0}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="group"
                          onSelect={(e) => {
                            e.preventDefault();
                            mutateTrash({ id: tf._id });
                          }}
                        >
                          <LuRefreshCw className="text-zinc-500 group-hover:text-blue-600" />{" "}
                          Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="group"
                          onSelect={(e) => {
                            e.preventDefault();
                            mutate({ id: tf._id });
                          }}
                        >
                          <RiDeleteBin6Line className="text-zinc-500 group-hover:text-red-500" />{" "}
                          Permanently Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center mt-2">
                <span className="text-xs font-medium italic text-zinc-500">
                  No trash Folders !
                </span>
              </div>
            )}
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Storage;
