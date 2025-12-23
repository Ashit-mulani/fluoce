import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import CBtn from "./CBtn";
import { Spinner } from "./spinner";

const CDialog = ({
  trigger,
  dialogCloseRef,
  title,
  description,
  children,
  disabled,
  onSuccess,
  isLoading,
  btnCloseChildren = "Cancle",
  btnSuccessChildren = "Done",
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!dialogCloseRef) return;
    dialogCloseRef.current = () => setOpen(false);
    return () => {
      if (dialogCloseRef.current) dialogCloseRef.current = null;
    };
  }, [dialogCloseRef]);

  const handleOpenChange = useCallback(
    (v) => {
      setOpen(v);
    },
    [setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-4xl border-0 dark:bg-zinc-900 bg-zinc-50 gap-8"
      >
        <DialogHeader className="items-start">
          <DialogTitle className="text-2xl font-normal">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-start">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter>
          <div className="flex items-end justify-end">
            <DialogClose disabled={isLoading} asChild>
              <CBtn>{btnCloseChildren}</CBtn>
            </DialogClose>
            <CBtn onClick={onSuccess} disabled={disabled || isLoading}>
              {isLoading ? (
                <>
                  <Spinner /> {btnSuccessChildren}
                </>
              ) : (
                btnSuccessChildren
              )}
            </CBtn>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CDialog;
