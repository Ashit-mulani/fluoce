"use client";

import React from "react";
import { Button } from "./button";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import { useAuth } from "@/provider/auth-provider";
import { Spinner } from "./spinner";

const DashboardBtn = ({ className, name, children }) => {
  return (
    <Link href="/dashboard">
      <Button className={`${className} smooth rounded-full shadow-md`}>
        {name}
        <FiArrowUpRight />
        {children}
      </Button>
    </Link>
  );
};

export default DashboardBtn;
