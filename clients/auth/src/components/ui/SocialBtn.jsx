import React from "react";
import { Button } from "./button";

const SocialBtn = ({ icon, name, onClick, isLoding }) => {
  return (
    <Button
      disabled={isLoding}
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 p-5.5 w-full font-medium"
    >
      {icon}
      {name}
    </Button>
  );
};

export default SocialBtn;
