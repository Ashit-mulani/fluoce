import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatSize } from "@/utils/formatSize";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegStar, FaRegTrashCan, FaStar } from "react-icons/fa6";
import { LuFileSymlink, LuRefreshCw } from "react-icons/lu";
import { IoMdMove } from "react-icons/io";
import { RiDeleteBin6Line, RiEdit2Fill } from "react-icons/ri";
import { IoMdOpen } from "react-icons/io";
import FileForm from "@/components/view/dashboard/Usage/FileForm";
import {
  useDeleteFile,
  useToggleTrashOrFavoriteFile,
} from "@/hooks/tanstack/file-tanstack";
import { removeFileAccess } from "@/store/slice/quickaccess";
import { useDispatch, useSelector } from "react-redux";
import ShareForm from "./ShareForm";
import MoveForm from "./MoveForm";
import { RiFullscreenFill } from "react-icons/ri";
import FileCard from "../../FileCard";

const FileMenus = ({ open, file, onClick }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);

  const { mutate, isError, error } = useToggleTrashOrFavoriteFile();

  const { mutate: mutateDelete } = useDeleteFile();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file?._id || !file?.folderId) return;
    mutate({
      folderId: file.folderId,
      fileId: file._id,
      data: { isFavorite: !(file?.isFavorite || false) },
    });
  };

  const handleTrashClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file?._id || !file?.folderId) return;
    dispatch(removeFileAccess(file, userId));
    mutate({
      folderId: file.folderId,
      fileId: file._id,
      data: { isTrash: !file?.isTrash },
    });
  };

  const handleOpenInNewTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (file) {
      window.open(
        `/preview/tab/${file?.folderId}/${file?._id}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) return;
    mutateDelete({
      folderId: file?.folderId,
      fileId: file?._id,
    });
  };

  const fileFirstMenu = [
    {
      name: "Favorite",
      icon: file?.isFavorite ? (
        <FaStar className="text-yellow-500 group-hover:text-yellow-600" />
      ) : (
        <FaRegStar className="group-hover:text-yellow-600" />
      ),
      onClick: handleFavoriteClick,
    },
  ];

  const fileSecondMenu = [
    {
      name: "Open in New Tab",
      icon: <IoMdOpen className="group-hover:text-blue-600" />,
      onClick: handleOpenInNewTab,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          tabIndex={0}
          role="button"
          aria-label="Open menu"
        >
          <BsThreeDotsVertical />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={onClick} align="start" className="m-2 w-60">
        <DropdownMenuLabel className="line-clamp-1 flex flex-col items-start justify-between gap-0.5">
          <span className="line-clamp-1 break-all">{file?.fileName}</span>
          <div className="flex w-full items-center justify-between gap-6 text-xs text-zinc-500">
            <span className="line-clamp-1 break-all">
              {file?.metaData?.mimeType}
            </span>
            <span className="] shrink-0">
              {formatSize(file?.metaData?.size) || 0.0}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {file?.isTrash ? (
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={handleTrashClick}
              className="group text-zinc-500"
            >
              <LuRefreshCw className="group-hover:text-blue-600" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDelete}
              className="group text-zinc-500"
            >
              <RiDeleteBin6Line className="group-hover:text-red-500" />
              Permanently Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuGroup>
              <FileForm
                file={file}
                folderId={file?.folderId}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="group gap-3 text-zinc-500"
                  >
                    <RiEdit2Fill className="group-hover:text-slate-600" />
                    Rename
                  </DropdownMenuItem>
                }
              />

              {fileFirstMenu?.map((s) => (
                <DropdownMenuItem
                  key={s?.name}
                  className="group gap-3 text-zinc-500"
                  onSelect={s.onClick}
                >
                  {s?.icon}
                  {s?.name}
                </DropdownMenuItem>
              ))}
              <MoveForm
                file={file}
                folderId={file?.folderId}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="group gap-3 text-zinc-500"
                  >
                    <IoMdMove className="group-hover:text-orange-600" />
                    Move
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {!open && (
              <FileCard
                file={file}
                className="w-full"
                children={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="group gap-3 text-zinc-500"
                  >
                    <RiFullscreenFill className="group-hover:text-green-600" />
                    Open File
                  </DropdownMenuItem>
                }
              />
            )}
            <DropdownMenuGroup>
              <ShareForm
                folderId={file?.folderId}
                file={file}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="group gap-3 text-zinc-500"
                  >
                    <LuFileSymlink className="group-hover:text-purple-600" />
                    Share File
                  </DropdownMenuItem>
                }
              />
              {fileSecondMenu?.map((s) => (
                <DropdownMenuItem
                  key={s?.name}
                  className="group gap-3 text-zinc-500"
                  onSelect={s.onClick}
                >
                  {s?.icon}
                  {s?.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="group gap-3 text-zinc-500"
                onSelect={handleTrashClick}
              >
                <FaRegTrashCan className="group-hover:text-red-600" />
                Move To Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        {isError && error?.message && (
          <div className="px-3 py-1 text-sm break-words text-red-500">
            {error.message}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileMenus;
