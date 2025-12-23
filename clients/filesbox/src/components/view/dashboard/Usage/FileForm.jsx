import React, { useEffect, useRef } from "react";
import CDialog from "@/components/ui/CDialog";
import { Input } from "@/components/ui/input";
import { useUpdateFile } from "@/hooks/tanstack/file-tanstack";
import { useForm, useWatch } from "react-hook-form";

function FileForm({ trigger, file, folderId }) {
  const updateFileMutation = useUpdateFile();
  const { mutate, isPending, isError, error } = updateFileMutation;

  const dialogCloseRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fileName: file?.fileName || "",
    },
  });

  const fileName = useWatch({
    control,
    name: "fileName",
  });

  useEffect(() => {
    if (file) {
      reset({ fileName: file?.fileName || "" });
    }
  }, [file, reset]);

  const onSubmit = (data) => {
    if (file?._id && folderId) {
      if (dialogCloseRef.current) dialogCloseRef.current();
      mutate({
        folderId,
        fileId: file._id,
        data: { fileName: data?.fileName },
      });
    }
  };

  return (
    <CDialog
      trigger={trigger}
      title={"Rename File"}
      description={"Enter a new name for this file"}
      btnSuccessChildren={"Update"}
      disabled={
        isPending ||
        (file?.fileName && file?.fileName.trim() === fileName?.trim())
      }
      isLoading={isPending}
      onSuccess={handleSubmit(onSubmit)}
      dialogCloseRef={dialogCloseRef}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-1"
        autoComplete="off"
      >
        <span className="text-sm font-medium ml-1">New File Name</span>
        <Input
          {...register("fileName", {
            required: "File name is required",
            minLength: { value: 1, message: "File name is required" },
          })}
          placeholder="Enter new file name"
          aria-invalid={!!errors.fileName}
          autoFocus
          type="text"
        />
        {errors.fileName && (
          <span className="text-xs text-red-500 ml-1">
            {errors.fileName.message}
          </span>
        )}
        {isError && error?.message && (
          <span className="text-xs text-red-500 ml-1">{error.message}</span>
        )}
      </form>
    </CDialog>
  );
}

export default FileForm;
