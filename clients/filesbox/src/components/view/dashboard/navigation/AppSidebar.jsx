"use client";

import NameLogo from "@/components/ui/NameLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { IoSettingsOutline } from "react-icons/io5";
import { FolderIcon } from "@/components/ui/Svg";
import { LuDatabaseZap } from "react-icons/lu";
import { LuFileSymlink } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import Link from "next/link";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { TbActivityHeartbeat } from "react-icons/tb";
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
import { formatSize } from "@/utils/formatSize";
import { MdWorkspacePremium } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { FaRegCreditCard } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { addFolderAccess, removeFolderAccess } from "@/store/slice/quickaccess";
import FolderForm from "../Usage/FolderForm";
import { useTrashFolder } from "@/hooks/tanstack/folder-tanstack";
import { PiUploadSimpleBold } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";

export default function AppSidebar() {
  const path = usePathname();

  const router = useRouter();

  const dispatch = useDispatch();

  const { mutate } = useTrashFolder();

  const { folders } = useSelector((state) => state.folders);

  const userId = useSelector((state) => state.user?.user?._id);

  const sideMenu = [
    {
      name: "Storage",
      icon: (inUse) => (
        <LuDatabaseZap className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/overview/storage",
      inUse: path.includes("storage"),
      onClick: () => {},
    },
    {
      name: "Shared Files",
      icon: (inUse) => (
        <LuFileSymlink className={inUse ? "text-purple-600" : ""} />
      ),
      path: "/dashboard/overview/shared",
      inUse: path.includes("shared"),
      onClick: () => {},
    },
    {
      name: "Trash Files",
      icon: (inUse) => (
        <FaRegTrashCan className={inUse ? "text-red-600" : ""} />
      ),
      path: "/dashboard/overview/trash",
      inUse: path.includes("trash"),
      onClick: () => {},
    },
    {
      name: "Uploads",
      icon: (inUse) => (
        <PiUploadSimpleBold className={inUse ? "text-amber-500" : ""} />
      ),
      path: "/dashboard/overview/uploads",
      inUse: path.includes("uploads"),
      onClick: () => {},
    },
    {
      name: "Upgrade",
      icon: (inUse) => (
        <MdWorkspacePremium className={inUse ? "text-green-600" : ""} />
      ),
      path: "/dashboard/overview/upgrade",
      inUse: path.includes("upgrade"),
      onClick: () => {},
    },
  ];

  const SettingsAndHelp = [
    {
      name: "Activity",
      icon: (inUse) => (
        <TbActivityHeartbeat className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/settingsandhelp/activity",
      inUse: path.includes("activity"),
      onClick: () => {},
    },
    {
      name: "Your Subscriptions",
      icon: (inUse) => (
        <FaRegCreditCard className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/settingsandhelp/subscriptions",
      inUse: path.includes("subscriptions"),
      onClick: () => {},
    },
    {
      name: "Send feedback",
      icon: (inUse) => (
        <MdOutlineFeedback className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/settingsandhelp/sendfeedback",
      inUse: path.includes("sendfeedback"),
      onClick: () => {},
    },
    {
      name: "Need help",
      icon: (inUse) => (
        <TbHelpSquareRoundedFilled className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/settingsandhelp/helps",
      inUse: path.includes("helps"),
      onClick: () => {},
    },
    {
      name: "Terms of Use | Privacy Policy",
      icon: (inUse) => (
        <MdOutlinePrivacyTip className={inUse ? "text-blue-600" : ""} />
      ),
      path: "/dashboard/settingsandhelp/termsandpolicy",
      inUse: path.includes("termsandpolicy"),
      onClick: () => {},
    },
  ];

  const handleMoveToTrash = (folder) => {
    dispatch(removeFolderAccess(folder, userId));
    if (path.includes(folder._id)) {
      router.back();
    }
    mutate({ id: folder._id });
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <NameLogo />
        </SidebarHeader>
        <SidebarContent className="custom-scroll">
          <SidebarGroup>
            <SidebarGroupLabel>OverView</SidebarGroupLabel>
            <SidebarMenu>
              {sideMenu?.map((s) => (
                <Link key={s?.path || s?.name} href={s?.path}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={`${
                        s?.inUse
                          ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:bg-neutral-200 dark:hover:text-neutral-800"
                          : "text-zinc-500"
                      }  cursor-pointer`}
                    >
                      {s?.icon(s.inUse)} {s?.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <SidebarMenu>
              {Array.isArray(folders) && folders.length > 0 ? (
                folders.map((folder) => (
                  <SidebarMenuItem
                    key={folder?._id}
                    className="group"
                    onClick={() => dispatch(addFolderAccess(folder, userId))}
                  >
                    <Link href={`/dashboard/folder/${folder?._id}`}>
                      <SidebarMenuButton
                        className={`${
                          path.includes(folder?._id)
                            ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:bg-neutral-200 dark:hover:text-neutral-800"
                            : "text-zinc-500"
                        } cursor-pointer`}
                      >
                        <FolderIcon />
                        <span className="line-clamp-1 break-all flex-1">
                          {folder?.name}
                        </span>
                      </SidebarMenuButton>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          className={`${
                            path.includes(folder?._id) &&
                            "dark:text-zinc-900 text-zinc-100 hover:text-white"
                          } px-3 opacity-0 group-hover:opacity-50 hover:opacity-100 mr-1 cursor-pointer hover:bg-blue-500/15`}
                        >
                          <HiOutlineDotsVertical />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="m-2 w-60">
                        <DropdownMenuLabel>
                          <div className="flex items-end justify-between gap-8 font-medium ">
                            <span className="line-clamp-1 truncate">
                              {folder?.name}
                            </span>
                            <span className="text-xs text-zinc-500 shrink-0">
                              {formatSize(folder?.metaData?.size) || 0.0}
                            </span>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <FolderForm
                            trigger={
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-zinc-500 gap-3 group"
                              >
                                <RiEdit2Fill className="group-hover:text-slate-600" />
                                Rename
                              </DropdownMenuItem>
                            }
                            folder={folder}
                          />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveToTrash(folder);
                            }}
                            className="text-zinc-500 gap-3 group"
                          >
                            <FaRegTrashCan className="group-hover:text-red-600" />
                            Move to Trash
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              ) : (
                <FolderForm
                  trigger={
                    <SidebarMenuItem className="text-xs font-medium text-zinc-500">
                      <SidebarMenuButton>
                        <IoMdAdd /> Create Folder
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  }
                />
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={`${
                    path.includes("settingsandhelp")
                      ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 dark:hover:bg-neutral-200 dark:hover:text-neutral-800"
                      : "text-zinc-500"
                  } cursor-pointer`}
                >
                  <IoSettingsOutline />
                  Settings and help
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="m-2 ml-16">
              <DropdownMenuGroup>
                {SettingsAndHelp?.map((sh) => (
                  <Link href={sh?.path} key={sh?.path || sh?.name}>
                    <DropdownMenuItem
                      className={`${
                        !sh?.inUse && "text-zinc-500"
                      } p-2 font-medium`}
                    >
                      {sh?.icon(sh?.inUse)}
                      {sh?.name}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
