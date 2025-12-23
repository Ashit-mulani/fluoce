import React, { useEffect, useRef } from "react";
import CDialog from "@/components/ui/CDialog";
import { Input } from "@/components/ui/input";
import {
  useCreateFolder,
  useUpdateFolder,
} from "@/hooks/tanstack/folder-tanstack";
import { useForm, useWatch } from "react-hook-form";

function FolderForm({ trigger, folder }) {
  const mutation = folder ? useUpdateFolder() : useCreateFolder();

  const { mutate, isPending, isError, error, data } = mutation;

  const dialogCloseRef = useRef();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: folder?.name || "",
    },
  });

  const name = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    if (folder) {
      reset({ name: folder?.name || "" });
    }
  }, [folder, reset]);

  const onSubmit = (data) => {
    if (folder?._id) {
      if (dialogCloseRef.current) dialogCloseRef.current();
      mutate({ id: folder?._id, data: { name: data.name } });
    } else {
      mutate(
        { name: data.name },
        {
          onSuccess: () => {
            if (dialogCloseRef.current) dialogCloseRef.current();
          },
        }
      );
    }
  };

  return (
    <CDialog
      trigger={trigger}
      title={folder ? "Rename Folder" : "New Folder"}
      description={
        folder
          ? "Enter a new name for this folder"
          : "Create a new folder in your workspace"
      }
      btnSuccessChildren={folder ? "Update" : "Create"}
      disabled={
        isPending || (folder?.name && folder?.name.trim() === name?.trim())
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
        <span className="text-sm font-medium ml-1">
          {folder ? "New Folder Name" : "Folder Name"}
        </span>
        <Input
          {...register("name", {
            required: "Folder name is required",
            minLength: { value: 1, message: "Folder name is required" },
          })}
          placeholder={folder ? "Enter new folder name" : "Enter folder name"}
          aria-invalid={!!errors.name}
          autoFocus
          type="text"
        />
        {errors.name && (
          <span className="text-xs text-red-500 ml-1">
            {errors.name.message}
          </span>
        )}
        {isError && error?.message && (
          <span className="text-xs text-red-500 ml-1">{error.message}</span>
        )}
      </form>
    </CDialog>
  );
}

export default FolderForm;
