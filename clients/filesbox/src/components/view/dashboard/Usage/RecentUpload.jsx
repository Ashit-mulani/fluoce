import React from "react";
import Wrapper from "../wrapper/Wrapper";
import FileCard from "../../FileCard";
import { useDispatch, useSelector } from "react-redux";
import { formatSize } from "@/utils/formatSize";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getFileIcon from "@/utils/fileType";
import { LuUpload } from "react-icons/lu";
import { addFileAccess } from "@/store/slice/quickaccess";

const RecentUpload = ({ className }) => {
  const { recentUploads } = useSelector((state) => state.recentUploads);

  const userId = useSelector((state) => state.user?.user?._id);

  const dispatch = useDispatch();

  return (
    <>
      <Wrapper
        className={`${className} flex flex-col break-all md:p-4 p-2 text-sm `}
      >
        <div className="flex flex-col gap-4">
          <span className="md:text-xl text-zinc-500 flex items-center gap-2">
            <LuUpload />
            <span className="line-clamp-1 break-all"> Recent Uploads</span>
          </span>
          <div className="flex flex-col gap-2">
            {recentUploads && recentUploads.length > 0 ? (
              recentUploads.map((file) => (
                <FileCard key={file?._id || file?.fileName} file={file}>
                  <div
                    onClick={() => dispatch(addFileAccess(file, userId))}
                    className="flex items-center gap-2 group cursor-pointer smooth p-2 border shadow-xs rounded-md"
                  >
                    <Avatar className="rounded bg-zinc-50 dark:bg-zinc-900 size-12">
                      <AvatarImage
                        className="rounded"
                        src={file?.thumbnailUrl}
                      />
                      <AvatarFallback className="rounded text-xl bg-zinc-50 dark:bg-zinc-900">
                        {getFileIcon(file?.metaData?.mimeType)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-start text-[13px] line-clamp-1">
                        {file?.fileName || "untitled file"}
                      </span>
                      <span className="text-start line-clamp-1 text-[12px] text-zinc-400 dark:text-zinc-600">
                        {file?.metaData?.mimeType}
                      </span>
                      <span className="text-start line-clamp-1 text-[10px] text-zinc-500">
                        {formatSize(file?.metaData?.size) || "unknown size"}
                      </span>
                    </div>
                  </div>
                </FileCard>
              ))
            ) : (
              <div className="text-center text-zinc-400 py-10 text-sm">
                No recent uploads yet.
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default RecentUpload;
