"use client";

import { RiDonutChartFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuUserRound } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { FiLogOut } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiSearchLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useLogout } from "@/hooks/tanstack/auth-tanstack";
import { filesboxUrl } from "@/utils/const";
import { useBelow500 } from "@/hooks/use-mobile";
import { IoMdAdd } from "react-icons/io";
import { VscNewFile } from "react-icons/vsc";
import { VscNewFolder } from "react-icons/vsc";
import FolderForm from "../Usage/FolderForm";
import UploadForm from "../Usage/UploadForm";
import { useUploadingState } from "@/hooks/useUploadingState";
import { Spinner } from "@/components/ui/spinner";
import CBtn from "@/components/ui/CBtn";

const AppTopbar = () => {
  const path = usePathname();

  const isBelow500 = useBelow500();

  const isUploading = useUploadingState();

  const { user } = useSelector((state) => state.user);

  const { mutate } = useLogout();

  const topButtonData = [
    {
      name: "DashBoard",
      icon: (inUse) => (
        <RiDonutChartFill className={inUse ? "text-blue-600" : ""} />
      ),
      inUse: path === "/dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="group text-xs">
              <IoMdAdd className="smooth group-hover:rotate-90" />
              {!isBelow500 && <span>New</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-2 p-2">
            <UploadForm
              trigger={
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 p-2 font-medium"
                  onSelect={(e) => e.preventDefault()}
                >
                  <VscNewFile strokeWidth={0.5} />
                  <span>Upload File</span>
                </DropdownMenuItem>
              }
            />
            <FolderForm
              trigger={
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 p-2 font-medium"
                  onSelect={(e) => e.preventDefault()}
                >
                  <VscNewFolder strokeWidth={0.5} />
                  <span>New Folder</span>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {topButtonData.map((m) => (
          <Link key={m.name} href={m.href}>
            <Button size={isBelow500 ? "sm" : ""} variant="ghost">
              <span
                className={`${
                  !m.inUse && "text-zinc-500"
                } flex items-center gap-2`}
              >
                {m.icon(m.inUse)}
                {m.name}
              </span>
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-1">
          {isUploading && (
            <Link href={"/dashboard/overview/uploads"}>
              <Button
                variant="ghost"
                className="smooth rounded-full text-blue-600 hover:bg-blue-500/10 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-300"
              >
                <Spinner /> {!isBelow500 && "Uploading . . ."}
              </Button>
            </Link>
          )}
          <AnimatedThemeToggler className="opacity rounded-full" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar className="size-7 cursor-pointer rounded-full">
              <AvatarImage
                className="h-full w-full rounded-full border-2 border-neutral-500/20 object-cover"
                src={user?.profilePhoto}
              />
              <AvatarFallback>
                {user?.name.slice(0, 1).toUpperCase() || (
                  <LuUserRound className="opacity" />
                )}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-2">
            <DropdownMenuLabel>
              {user ? (
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs font-light text-zinc-500">
                    {user?.email}
                  </span>
                </div>
              ) : (
                "My Account"
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => mutate({ domain: filesboxUrl })}
              className="justify-between"
            >
              Logout <FiLogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppTopbar;
