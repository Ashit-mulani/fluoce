import React from "react";
import { cn } from "@/lib/utils";

const Wrapper = ({ className, children }) => {
  return (
    <div className={cn("w-full rounded-lg overflow-hidden", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
