import React from "react";
import { Logo } from "./Logo";

const FormHeader = () => {
  return (
    <div className="flex gap-2 items-center">
      <Logo thickness={2} size={28} className="shrink-0" />
      <h1 className="font-medium SSN text-xl">Welcome to Fluoce</h1>
    </div>
  );
};

export default FormHeader;
