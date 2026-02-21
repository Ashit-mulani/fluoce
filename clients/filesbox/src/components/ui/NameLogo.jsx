import Link from "next/link";
import React from "react";
import { Logo } from "./Logo";

const NameLogo = ({ }) => {
  return (
    <div className="flex items-center">
      <Link href={"/"} className="flex gap-2 p-2 items-center">
        <Logo thickness={2.5} size={26} className="shrink-0" />
        <h1 className="SSN text-xl font-semibold">Cloud Fluoce</h1>
      </Link>
    </div>
  );
};

export default NameLogo;
