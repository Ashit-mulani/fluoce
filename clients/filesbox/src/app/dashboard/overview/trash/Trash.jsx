"use client";

import { setTrashFiles } from "@/store/slice/trashFiles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuFiles } from "react-icons/lu";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { RiFilter2Fill } from "react-icons/ri";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { useBelow500 } from "@/hooks/use-mobile";
import { Columns3, Grid3x3, Table } from "lucide-react";
import FileCard from "@/components/view/FileCard";
import FileMenus from "@/components/view/dashboard/Usage/FileMenus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getFileIcon from "@/utils/fileType";

const Trash = ({ data }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTrashFiles(data?.data?.files));
  }, [data]);

  const { trashFiles } = useSelector((state) => state.trashFiles);

  const isBelow500 = useBelow500();

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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col justify-between z-10 h-28 top-13 sticky bg-white dark:bg-zinc-950 p-2 pb-4 border-b">
          <div className="flex items-center gap-4">
            <span className="md:text-xl text-zinc-500 flex items-center gap-2">
              <LuFiles />
              Trash Files
            </span>
          </div>
          <div className="w-full flex items-center justify-between gap-2">
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-zinc-700 dark:text-zinc-300"
              >
                <RiFilter2Fill /> Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-zinc-700 dark:text-zinc-300"
              >
                <HiOutlineAdjustmentsHorizontal /> Sort
              </Button>
            </ButtonGroup>
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
        {trashFiles && trashFiles.length > 0 ? (
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
              } border-l overflow-hidden`}
            >
              {trashFiles.map((file) => (
                <FileCard key={file?._id} file={file}>
                  <div
                    className={`flex items-center justify-between p-3 border-b border-r gap-2 hover:bg-zinc-500/4 cursor-pointer smooth`}
                  >
                    <div className="flex items-center gap-2 line-clamp-1 truncate">
                      <Avatar className="rounded bg-transparent">
                        <AvatarImage
                          className=" object-cover"
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
                  </div>
                </FileCard>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-20 text-zinc-500 text-sm">
            No files in this folder.
          </div>
        )}
      </div>
    </>
  );
};

export default Trash;
