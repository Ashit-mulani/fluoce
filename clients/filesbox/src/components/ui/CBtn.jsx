import { Button } from "./button";
import { cn } from "@/lib/utils";

const CBtn = ({ onClick, children, disabled, className }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      type="button"
      variant="ghost"
      className={cn(
        "smooth rounded-full p-5 text-blue-600 hover:bg-blue-500/10 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-300",
        className
      )}
    >
      {children}
    </Button>
  );
};

export default CBtn;
