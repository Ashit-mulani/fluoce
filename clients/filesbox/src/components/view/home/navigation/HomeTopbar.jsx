"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { FaGithub, FaBars } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import NameLogo from "@/components/ui/NameLogo";
import { RiCloseLargeLine } from "react-icons/ri";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useEffect, useState } from "react";
import DashboardBtn from "@/components/ui/DashboardBtn";
import Link from "next/link";
import { useBelow850 } from "@/hooks/use-mobile";

const ActionBtn = () => {
  "use client";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="opacity smooth rounded-full"
        onClick={() => {
          window.open(
            "https://github.com/Ashit-mulani/fluoce",
            "_blank",
            "noopener noreferrer"
          );
        }}
      >
        <FaGithub />
      </Button>
      <AnimatedThemeToggler className="opacity smooth cursor-pointer rounded-full" />
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full">
            Sing Up
          </Button>
        </Link>
        <DashboardBtn name="Dashboard" />
      </div>
    </div>
  );
};

const Menus = ({ className }) => {
  const menuList = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList className={className}>
        {menuList.map((m) => (
          <NavigationMenuItem key={m.name}>
            <NavigationMenuLink className="smooth opacity bg-transparent">
              {m.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const MenuSection = ({ onClose }) => {
  return (
    <div
      className="animate-slideIn fixed inset-0 flex flex-col items-center justify-center overflow-y-auto bg-white p-4 px-2 pb-10 dark:bg-zinc-900"
      style={{
        transition: "transform 0.4s cubic-bezier(0.77,0,0.175,1), opacity 0.3s",
      }}
    >
      <Button
        onClick={onClose}
        variant="ghost"
        className="mb-4 self-end rounded-full"
      >
        <RiCloseLargeLine />
      </Button>
      <Menus className="flex flex-col items-center justify-center gap-4" />
      <ActionBtn />
    </div>
  );
};

const HomeTopbar = () => {
  const isMobile = useBelow850();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  if (typeof isMobile === "undefined") {
    return (
      <div className="fixed top-0 left-0 z-30 flex w-full items-center justify-between border-b-2 border-zinc-500/10 bg-white p-2 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-4">
            <NameLogo />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 z-30 flex w-full items-center justify-between border-b-2 border-zinc-500/10 bg-white p-2 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-4">
          <NameLogo />
          {!isMobile && <Menus />}
        </div>
        {!isMobile ? (
          <ActionBtn />
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            aria-label="Open menu"
            onClick={() => setShowMenu(true)}
          >
            <FaBars size={21} />
          </Button>
        )}
        {isMobile && showMenu && (
          <MenuSection onClose={() => setShowMenu(false)} />
        )}
      </div>
      <style>{`
          .animate-slideIn {
            animation: menu-slide-in 0.4s cubic-bezier(0.77,0,0.175,1);
          }
          @keyframes menu-slide-in {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
    </div>
  );
};

export default HomeTopbar;
