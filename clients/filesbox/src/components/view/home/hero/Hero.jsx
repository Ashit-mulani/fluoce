"use client";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import DashboardBtn from "@/components/ui/DashboardBtn";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative flex w-full flex-col items-start justify-start overflow-hidden p-4">
      <BackgroundRippleEffect />
      <div className="mt-16 flex w-full flex-col items-start md:mt-50 md:items-center">
        <h2 className="relative mx-auto max-w-4xl text-start text-4xl font-bold text-neutral-700 md:text-center md:text-5xl lg:text-7xl dark:text-neutral-300">
          Store, Share and Organize Your Files in the Cloud
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-start text-neutral-800 md:text-center dark:text-neutral-500">
          Manage, store, and share your files from one organized cloud space.
          Built to keep your workflow simple and your files accessible whenever
          you need them.
        </p>
        <div className="mt-5 flex items-center gap-2">
          <Link href="/dashboard/overview/upgrade">
            <Button className="smooth h-9 cursor-pointer border-neutral-200 bg-white px-4 py-2 text-black has-[>svg]:px-3 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
              Filesbox Pro
            </Button>
          </Link>
          <DashboardBtn
            className="relative gap-3 overflow-hidden"
            name="Get Start"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
