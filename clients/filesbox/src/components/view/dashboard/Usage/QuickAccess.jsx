"use client";

import { useEffect } from "react";
import Wrapper from "../wrapper/Wrapper";
import AccessCard from "./AccessCart";
import { FiInbox } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import { AiFillThunderbolt } from "react-icons/ai";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loadQuickAccess } from "@/store/slice/quickaccess";
import { QuickFileCard, QuickFolderCard } from "@/components/ui/QuickCard";
import FolderForm from "./FolderForm";
import UploadForm from "./UploadForm";

const QuickAccess = ({ className }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?._id);

  useEffect(() => {
    if (userId) {
      dispatch(loadQuickAccess({ userId }));
    }
  }, [dispatch, userId]);

  const { folders, files } = useSelector((state) => state.quickAccess);

  return (
    <>
      <Wrapper className={`${className} text-sm `}>
        <div className="flex flex-col gap-4">
          <span className="md:text-xl text-zinc-500 flex items-center gap-2">
            <AiFillThunderbolt /> Quick Access
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2">
            <UploadForm
              trigger={
                <AccessCard
                  name={"Upload Files"}
                  icon={<VscNewFile strokeWidth={0.2} />}
                />
              }
            />
            <FolderForm
              trigger={
                <AccessCard
                  name={"Create Folder"}
                  icon={<VscNewFolder strokeWidth={0.2} />}
                />
              }
            />
            <Link href={"/dashboard/overview/storage"}>
              <AccessCard name={"Storage"} icon={<FiInbox />} />
            </Link>
            <Link href={"/dashboard/overview/upgrade"}>
              <AccessCard name={"Upgrade"} icon={<MdWorkspacePremium />} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2">
            {folders?.map((f) => (
              <QuickFolderCard key={f?._id || f?.name} folder={f} />
            ))}
            {files?.map((f) => (
              <QuickFileCard key={f?._id || f?.fileName} file={f} />
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default QuickAccess;
