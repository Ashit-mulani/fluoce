"use client";

import Wrapper from "@/components/view/dashboard/wrapper/Wrapper";
import { setSharedFiles, setSharedWithMe } from "@/store/slice/sharedFile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuFileSymlink } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TbWorldDownload } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BiCopy } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import { useDeleteShare } from "@/hooks/tanstack/share-tanstack";
import { useRouter } from "next/navigation";
import CBtn from "@/components/ui/CBtn";

const Shared = ({ data }) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [showAllShared, setShowAllShared] = useState(false);

  useEffect(() => {
    dispatch(setSharedFiles(data?.data?.shared));
    dispatch(setSharedWithMe(data?.data?.sharedWithMe));
  }, [data]);

  const { mutate } = useDeleteShare();

  const { shared, sharedWithMe } = useSelector((state) => state.sharedFiles);

  const sharedToShow =
    showAllShared || !shared?.length ? shared : shared.slice(0, 5);

  return (
    <>
      <Wrapper className="p-2 md:p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-zinc-500 md:text-xl">
              <LuFileSymlink /> Shared Files
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-500/10">
                  <TableHead className="text-xs font-medium text-zinc-500">
                    File Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">
                    MIME Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">
                    Link Is Public
                  </TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">
                    Shared With
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-zinc-500">
                    Link
                  </TableHead>
                  <TableHead className="px-6 text-xs font-medium text-zinc-500">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedToShow?.length ? (
                  sharedToShow.map((sf) => (
                    <TableRow
                      key={sf?._id || sf.fileName}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div
                          className="max-w-[150px] truncate"
                          title={sf?.fileName || "untitled File"}
                        >
                          {sf?.fileName && sf.fileName.length > 20
                            ? `${sf.fileName.slice(0, 16)}...`
                            : sf?.fileName || "untitled File"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[150px] truncate text-zinc-600 dark:text-zinc-400"
                          title={sf?.mimeType || ""}
                        >
                          {sf?.mimeType && sf.mimeType.length > 25
                            ? `${sf.mimeType.slice(0, 21)}...`
                            : sf?.mimeType || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sf?.isForAll ? (
                          <span className="text-blue-600">Yes</span>
                        ) : (
                          <span className="text-zinc-500">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <ShowMoreEmails sharedWith={sf?.sharedWith} />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="smooth rounded-full font-normal text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-300 dark:hover:bg-blue-500/30 dark:hover:text-blue-300"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${process.env.NEXT_PUBLIC_FILESBOX_URL}/preview/shared/${sf?._id}`
                            );
                            toast.success("Link Copied !", {
                              position: "top-center",
                            });
                          }}
                        >
                          Share Link <BiCopy />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity smooth rounded-full hover:bg-red-500/10 hover:text-red-500 hover:dark:bg-red-400/10"
                          onClick={() => mutate(sf?._id)}
                        >
                          <RiDeleteBin6Line /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-zinc-400"
                    >
                      No shared files found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div>
              {shared && shared.length > 5 && !showAllShared && (
                <CBtn variant="ghost" onClick={() => setShowAllShared(true)}>
                  View All
                </CBtn>
              )}
              {shared && shared.length > 5 && showAllShared && (
                <CBtn variant="ghost" onClick={() => setShowAllShared(false)}>
                  Show Less
                </CBtn>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
      <Wrapper className="p-2 md:p-4">
        <div className="flex flex-col gap-4">
          <span className="flex items-center gap-2 text-zinc-500 md:text-xl">
            <TbWorldDownload /> Shared For You
          </span>
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-500/10">
                <TableHead className="text-xs font-medium text-zinc-500">
                  File Name
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  MIME Type
                </TableHead>
                <TableHead className="text-xs font-medium text-zinc-500">
                  Owner
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sharedWithMe?.length ? (
                sharedWithMe.map((sf) => (
                  <TableRow
                    key={sf?._id || sf?.fileName}
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/preview/shared/${sf?._id}?ref=internal`);
                    }}
                  >
                    <TableCell>
                      <div
                        className="max-w-[140px] truncate"
                        title={sf?.fileName || "untitled File"}
                      >
                        {sf?.fileName && sf.fileName.length > 20
                          ? `${sf.fileName.slice(0, 16)}...`
                          : sf?.fileName || "untitled File"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[120px] truncate text-zinc-600 dark:text-zinc-400"
                        title={sf?.mimeType || ""}
                      >
                        {sf?.mimeType && sf.mimeType.length > 25
                          ? `${sf.mimeType.slice(0, 21)}...`
                          : sf?.mimeType || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sf.ownerInfo ? (
                        <>
                          <div className="flex flex-col">
                            <span
                              className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-400"
                              title={sf.ownerInfo.name}
                            >
                              {sf.ownerInfo.name}
                            </span>
                            <span
                              className="truncate text-xs text-zinc-400 dark:text-zinc-600"
                              title={sf.ownerInfo.email}
                            >
                              {sf.ownerInfo.email}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-zinc-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-zinc-400">
                    No shared files found for you.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Wrapper>
    </>
  );
};

export default Shared;

export function ShowMoreEmails({ sharedWith }) {
  let emails = [];
  if (Array.isArray(sharedWith) && sharedWith.length) {
    if (
      typeof sharedWith[0] === "object" &&
      sharedWith[0] !== null &&
      "email" in sharedWith[0]
    ) {
      emails = sharedWith.map((item) => item.email);
    } else {
      emails = sharedWith;
    }
  }

  if (!emails.length) {
    return <span className="text-xs text-zinc-400">—</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="cursor-pointer rounded bg-zinc-500/10 px-2 py-0.5 text-xs"
          type="button"
          title={emails.join(", ")}
        >
          {emails.length === 1 ? (
            emails[0]
          ) : (
            <>
              {emails[0]}
              {emails.length > 1 && (
                <span className="text-blue-500">
                  {` +${emails.length - 1} more`}
                </span>
              )}
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="text-xs font-bold text-zinc-500">
          Shared With
        </DropdownMenuLabel>
        {emails.map((email) => (
          <DropdownMenuItem key={email}>
            <span className="text-xs text-zinc-700 dark:text-zinc-200">
              {email}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
