import { IoClose } from "react-icons/io5";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { FilePreview } from "./FilePreview";
import { formatSize } from "@/utils/formatSize";
import { usePreviewUrl } from "@/hooks/tanstack/file-tanstack";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import DownloadButton from "@/components/ui/download";
import FileMenus from "./dashboard/Usage/FileMenus";

const FileCard = ({ children, file, className }) => {
  if (!file) {
    return null;
  }

  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = usePreviewUrl(file?.folderId, file?._id, {
    enabled: open,
  });

  return (
    <>
      <Drawer open={open} onOpenChange={(v) => setOpen(v)}>
        <DrawerTrigger className={className}>{children}</DrawerTrigger>
        <DrawerContent className="drawer">
          <div className="flex items-center justify-between">
            <DrawerClose className="absolute right-2 top-2 z-50 cursor-pointer">
              <IoClose className="text-3xl text-zinc-500" />
            </DrawerClose>
            <DrawerHeader className="p-2 flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2">
                <DownloadButton
                  url={data?.previewUrl || null}
                  fileName={file?.fileName}
                  full={false}
                />
                <div className="p-2 flex-wrap flex-col">
                  <DrawerTitle className="line-clamp-1 break-all text-start ">
                    {file?.fileName || "Unnamed file"}
                  </DrawerTitle>
                  <DrawerDescription className=" text-zinc-500 text-xs mt-0.5 flex gap-1 flex-wrap">
                    <span className="line-clamp-1 break-all text-start">
                      {file?.metaData?.mimeType}
                    </span>
                    <span className="text-start">
                      {formatSize(file?.metaData?.size) || "unknown size"}
                    </span>
                  </DrawerDescription>
                </div>
              </div>
              <FileMenus open={open} file={file} />
            </DrawerHeader>
          </div>
          <div className="flex-1 overflow-auto custom-scroll">
            {error ? (
              <div className="p-4 text-center text-red-500">
                Failed to load File, try later.
              </div>
            ) : isLoading ? (
              <div className="p-4 text-center text-zinc-500">
                <Spinner /> Loading preview . . . .
              </div>
            ) : (
              <FilePreview
                mimeType={file?.metaData?.mimeType}
                url={data?.previewUrl || null}
                fileName={file?.fileName}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FileCard;
