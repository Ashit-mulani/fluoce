"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon } from "@/components/ui/Svg";
import FileCard from "@/components/view/FileCard";
import { useBelow500 } from "@/hooks/use-mobile";
import { setFilesForFolder } from "@/store/slice/files";
import { selectFilesForFolder } from "@/utils/fileSelector";
import getFileIcon from "@/utils/fileType";
import { formatSize } from "@/utils/formatSize";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiFilter2Fill } from "react-icons/ri";
import { HiStar } from "react-icons/hi2";
import { HiOutlineUpload } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiEdit2Fill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { ButtonGroup } from "@/components/ui/button-group";
import { Table, Grid3x3, Columns3 } from "lucide-react";
import FileMenus from "@/components/view/dashboard/Usage/FileMenus";
import { addFileAccess, removeFolderAccess } from "@/store/slice/quickaccess";
import FolderForm from "@/components/view/dashboard/Usage/FolderForm";
import { useTrashFolder } from "@/hooks/tanstack/folder-tanstack";
import { useRouter } from "next/navigation";
import UploadForm from "@/components/view/dashboard/Usage/UploadForm";
import { MdCalendarMonth, MdToday } from "react-icons/md";
import { TbCalendarWeekFilled } from "react-icons/tb";
import { IoMdDoneAll } from "react-icons/io";
import { isSameDay, isSameWeek, isSameMonth } from "date-fns";

const Folder = ({ data, folderId }) => {
  const dispatch = useDispatch();

  const isBelow500 = useBelow500();

  const { mutate } = useTrashFolder();

  const getInitialLayout = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("files_layout");
      if (saved !== null) return Number(saved);
    }
    return isBelow500 ? 2 : 3;
  };

  const [layout, setLayoutState] = useState(getInitialLayout);

  const setLayout = (val) => {
    setLayoutState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("files_layout", val);
    }
  };

  useEffect(() => {
    dispatch(setFilesForFolder({ folderId, files: data?.data?.files }));
  }, [data, folderId]);

  const [filter, setFilter] = useState("");

  const folderFiles = useSelector(selectFilesForFolder(folderId));
  const { folders } = useSelector((state) => state.folders);
  const userId = useSelector((state) => state.user?.user?._id);
  const openFolder = folders?.find((folder) => folder?._id === folderId);

  const router = useRouter();

  const handleMoveToTrash = () => {
    router.back();
    if (openFolder?._id) {
      dispatch(removeFolderAccess(openFolder, userId));
      mutate({ id: openFolder?._id });
    }
  };

  const isFileToday = (file) => {
    if (!file?.createdAt) return false;
    try {
      return isSameDay(new Date(file.createdAt), new Date());
    } catch {
      return false;
    }
  };

  const isFileThisWeek = (file) => {
    if (!file?.createdAt) return false;
    try {
      return isSameWeek(new Date(file.createdAt), new Date());
    } catch {
      return false;
    }
  };

  const isFileThisMonth = (file) => {
    if (!file?.createdAt) return false;
    try {
      return isSameMonth(new Date(file.createdAt), new Date());
    } catch {
      return false;
    }
  };

  const filteredFiles = useMemo(() => {
    if (!folderFiles) return [];
    if (filter === "favorite") {
      return folderFiles.filter((file) => !!file?.isFavorite);
    } else if (filter === "today") {
      return folderFiles.filter((file) => isFileToday(file));
    } else if (filter === "week") {
      return folderFiles.filter((file) => isFileThisWeek(file));
    } else if (filter === "month") {
      return folderFiles.filter((file) => isFileThisMonth(file));
    }
    return folderFiles;
  }, [folderFiles, filter]);

  const isFilterActive = !!filter;

  return (
    <>
      <div className="flex flex-col">
        <div className="sticky top-13 z-10 flex h-28 flex-col justify-between border-b bg-white p-2 pb-4 dark:bg-zinc-950">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="line-clamp-1 flex w-full max-w-full items-center gap-2 overflow-hidden text-ellipsis">
                <FolderIcon size={30} />
                <span className="line-clamp-1 break-all">
                  {openFolder?.name}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <BsThreeDotsVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2 w-60">
                  <DropdownMenuLabel>
                    <div className="flex items-end justify-between gap-8 font-medium">
                      <span className="line-clamp-1 truncate">
                        {openFolder?.name}
                      </span>
                      <span className="shrink-0 text-xs text-zinc-500">
                        {formatSize(openFolder?.metaData?.size) || 0.0}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <FolderForm
                      trigger={
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="group gap-3 text-zinc-500"
                        >
                          <RiEdit2Fill className="group-hover:text-slate-600" />{" "}
                          Rename
                        </DropdownMenuItem>
                      }
                      folder={openFolder}
                    />
                    <DropdownMenuItem
                      className="group gap-3 text-zinc-500"
                      onSelect={handleMoveToTrash}
                    >
                      <FaRegTrashCan className="group-hover:text-red-600" />
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <UploadForm
              trigger={
                <Button
                  className="text-[13px] text-zinc-700 dark:text-zinc-300"
                  variant="outline"
                  size={isBelow500 ? "icon" : "sm"}
                >
                  <HiOutlineUpload /> {!isBelow500 && "Upload File"}
                </Button>
              }
            />
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <RiFilter2Fill /> Filter
                      {isFilterActive && (
                        <span className="absolute -top-0.5 -right-0.5 block h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="m-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-neutral-500">
                      Filters
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setFilter((prev) => "");
                      }}
                      className={filter === "" ? "bg-blue-500/15" : undefined}
                    >
                      <IoMdDoneAll />
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setFilter((prev) =>
                          prev === "favorite" ? "" : "favorite"
                        );
                      }}
                      className={
                        filter === "favorite" ? "bg-blue-500/15" : undefined
                      }
                    >
                      <HiStar />
                      Favorite
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setFilter((prev) => (prev === "today" ? "" : "today"));
                      }}
                      className={
                        filter === "today" ? "bg-blue-500/15" : undefined
                      }
                    >
                      <MdToday />
                      Today's Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setFilter((prev) => (prev === "week" ? "" : "week"));
                      }}
                      className={
                        filter === "week" ? "bg-blue-500/15" : undefined
                      }
                    >
                      <TbCalendarWeekFilled />
                      This week's Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setFilter((prev) => (prev === "month" ? "" : "month"));
                      }}
                      className={
                        filter === "month" ? "bg-blue-500/15" : undefined
                      }
                    >
                      <MdCalendarMonth />
                      This Month's Upload
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-700 dark:text-zinc-300"
                  onClick={() => setFilter("")}
                >
                  Clear
                </Button>
              )}
            </div>
            <ButtonGroup>
              <Button
                disabled={isBelow500}
                onClick={() => {
                  if (layout !== 3) {
                    setLayout(3);
                  }
                }}
                variant={layout == 3 ? "" : "outline"}
                size="sm"
                className={`text-sm ${
                  layout == 3
                    ? "text-zinc-100 dark:text-zinc-900"
                    : "text-zinc-700 dark:text-zinc-300"
                } smooth`}
              >
                <Grid3x3 />
              </Button>
              <Button
                onClick={() => {
                  if (layout !== 2) {
                    setLayout(2);
                  }
                }}
                variant={layout == 2 ? "" : "outline"}
                size="sm"
                className={`text-sm ${
                  layout == 2
                    ? "text-zinc-100 dark:text-zinc-900"
                    : "text-zinc-700 dark:text-zinc-300"
                } smooth`}
              >
                <Table />
              </Button>
              <Button
                onClick={() => {
                  if (layout !== 1) {
                    setLayout(1);
                  }
                }}
                variant={layout == 1 ? "" : "outline"}
                size="sm"
                className={`text-sm ${
                  layout == 1
                    ? "text-zinc-100 dark:text-zinc-900"
                    : "text-zinc-700 dark:text-zinc-300"
                } smooth`}
              >
                <Columns3 className="rotate-90" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
        {filteredFiles && filteredFiles.length > 0 ? (
          <div className="w-full flex-1 pb-2">
            <div
              className={`grid ${
                isBelow500
                  ? layout === 1
                    ? "grid-cols-1"
                    : "grid-cols-2"
                  : layout === 1
                    ? "grid-cols-1"
                    : layout === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
              } overflow-hidden border-l`}
            >
              {filteredFiles
                ?.filter((file, idx, arr) => {
                  if (!file || !file._id) return false;
                  return arr.findIndex((f) => f && f._id === file._id) === idx;
                })
                .map((file) => (
                  <FileCard key={file?._id} file={file}>
                    <motion.div
                      onClick={() => dispatch(addFileAccess(file, userId))}
                      className={`smooth flex cursor-pointer items-center justify-between gap-2 border-r border-b p-3 hover:bg-zinc-500/4`}
                    >
                      <div className="line-clamp-1 flex items-center gap-2 truncate">
                        <Avatar className="rounded bg-transparent">
                          <AvatarImage
                            className="object-cover"
                            src={file?.thumbnailUrl}
                          />
                          <AvatarFallback className="rounded bg-transparent">
                            {getFileIcon(
                              file?.metaData?.mimeType,
                              "shrink-0 text-zinc-500",
                              18
                            ) || <FileIcon size={20} />}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {file?.fileName}
                        </span>
                      </div>
                      <FileMenus
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        file={file}
                      />
                    </motion.div>
                  </FileCard>
                ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 text-center text-sm text-zinc-500">
            No files in this folder.
          </div>
        )}
      </div>
    </>
  );
};

export default Folder;
