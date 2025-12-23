import { FileUpload } from "@/components/ui/file-upload";
import React, { useRef, useState } from "react";
import SelectFolder from "./SelectFolder";
import { useSelector } from "react-redux";
import CDialog from "@/components/ui/CDialog";
import { useGetSignedUrls } from "@/hooks/tanstack/file-tanstack";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { uploadDB } from "@/lib/db/uploadDB";
import { uploadManager } from "@/lib/UploadToR2";

const MAX_FILES = 5;

const UploadForm = ({ trigger }) => {
  const dialogRef = useRef();

  const { folders } = useSelector((state) => state.folders);

  const userId = useSelector((state) => state.user.user?._id);

  const [files, setFiles] = useState([]);

  const [selectedFolderId, setSelectedFolderId] = useState("");

  const {
    mutate: getSignedUrls,
    isPending,
    isError,
    error,
  } = useGetSignedUrls({
    onSuccess: async (res) => {
      const { signedUrls, folderId } = res;
      for (const s of signedUrls) {
        await uploadDB.uploads.update(s.tempId, {
          signedUrl: s.signedUrl,
          objectKey: s.objectKey,
          mimeType: s.mimeType,
          safeName: s.safeName,
          status: "ready",
          folderId,
          expiresAt: Date.now() + 8 * 60 * 1000,
        });
      }
      if (dialogRef.current) dialogRef.current();
      setFiles([]);
      setSelectedFolderId("");
      uploadManager.start(userId);
    },
  });

  const handleGetSignedUrls = async () => {
    if (!selectedFolderId || files.length === 0) return;
    if (files.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} files at a time.`, {
        position: "top-center",
      });
      return;
    }

    const uploadFiles = [];

    for (const file of files) {
      if (!file) continue;

      if (typeof file.size !== "number" || file.size === 0) {
        toast.error(`File size is required for "${file.name}"`, {
          position: "top-center",
        });
        continue;
      }
      const tempId = nanoid();

      uploadFiles.push({
        tempId,
        fileName: file.name,
        size: file.size,
      });

      await uploadDB.uploads
        .put({
          tempId,
          userId,
          file,
          size: file.size,
          fileName: file.name,
          folderId: selectedFolderId,
          signedUrl: null,
          objectKey: null,
          safeName: null,
          mimeType: file.type,
          status: "pending",
          expiresAt: null,
          createdAt: Date.now(),
          progress: 0,
        })
        .catch((err) => {
          toast.error(`Could not queue "${file.name}" for upload`, {
            position: "top-center",
          });
        });
    }

    if (uploadFiles.length === 0) {
      toast.error("No valid files selected for upload.", {
        position: "top-center",
      });
      return;
    }

    getSignedUrls({
      folderId: selectedFolderId,
      data: { files: uploadFiles },
    });
  };

  return (
    <CDialog
      dialogCloseRef={dialogRef}
      trigger={trigger}
      title="Upload File"
      description={`Drag or drop your files here or click to upload. (Max ${MAX_FILES} files at once)`}
      btnSuccessChildren="Upload"
      onSuccess={handleGetSignedUrls}
      isLoading={isPending}
    >
      <FileUpload files={files} setFiles={setFiles} />

      <div className="flex flex-col">
        <span className="m-1 text-sm font-medium">Folder</span>
        <SelectFolder
          folders={folders}
          value={selectedFolderId}
          onChange={setSelectedFolderId}
        />
      </div>
      {isError && <div className="text-xs text-red-500">{error.message}</div>}
    </CDialog>
  );
};

export default UploadForm;
