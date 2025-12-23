import React from "react";
import Wrapper from "../wrapper/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { TbFolders } from "react-icons/tb";
import { formatSize } from "@/utils/formatSize";
import { FolderIcon } from "@/components/ui/Svg";
import Link from "next/link";
import { addFolderAccess } from "@/store/slice/quickaccess";

const Folders = ({ className }) => {
  const { folders } = useSelector((state) => state.folders);

  const userId = useSelector((state) => state.user?.user?._id);

  const dispatch = useDispatch();

  return (
    <>
      <Wrapper className={`${className} text-sm`}>
        <div className="flex flex-col gap-4">
          <span className="md:text-xl text-zinc-500 flex items-center gap-2">
            <TbFolders />
            Folders
          </span>
          <div className="grid grid-cols-2 xl:grid-cols-3 md:gap-4 gap-2">
            {folders && folders.length > 0 ? (
              folders.map((f) => (
                <Link
                  href={`/dashboard/folder/${f?._id}`}
                  key={f?._id || f.name}
                  onClick={() => dispatch(addFolderAccess(f, userId))}
                  className="p-3 dark:bg-zinc-950 bg-white flex gap-2 items-center justify-between rounded-md border shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FolderIcon />
                    <span className="line-clamp-1 break-all">{f?.name}</span>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {formatSize(f?.metaData?.size) || 0.0}
                  </span>
                </Link>
              ))
            ) : (
              <div className="text-center col-span-2 xl:col-span-3 text-zinc-400 py-10 text-sm">
                No folders yet.
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default Folders;
