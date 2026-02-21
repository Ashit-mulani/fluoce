import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CBtn from "./CBtn";

const CAlertDialog = ({
  children,
  onSuccess,
  title,
  description,
  onSuccessChild,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="gap-8 rounded-4xl border-0 bg-zinc-50 dark:bg-zinc-900">
        <AlertDialogHeader className="items-start">
          <AlertDialogTitle className="text-2xl font-normal">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-start">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <CBtn type="button" onClick={() => setOpen(false)}>
            Cancel
          </CBtn>
          <CBtn
            type="button"
            onClick={() => {
              if (onSuccess) onSuccess();
              setOpen(false);
            }}
          >
            {onSuccessChild}
          </CBtn>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CAlertDialog;
