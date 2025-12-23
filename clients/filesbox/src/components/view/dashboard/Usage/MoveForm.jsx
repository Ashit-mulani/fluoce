import CDialog from "@/components/ui/CDialog";
import { useMoveFile } from "@/hooks/tanstack/file-tanstack";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import SelectFolder from "./SelectFolder";

const MoveForm = ({ trigger, folderId, file }) => {
  const dialogCloseRef = useRef();

  const { folders } = useSelector((state) => state.folders);

  const moveFileMutation = useMoveFile();
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleMove = async () => {
    if (
      !selectedFolder ||
      selectedFolder._id === folderId // don't move into same folder
    )
      return;
    moveFileMutation.mutate({
      folderId: folderId,
      fileId: file._id,
      data: { targetedFolderId: selectedFolder._id },
    });
    // Optionally close dialog on success
    dialogCloseRef.current?.();
  };

  return (
    <CDialog
      trigger={trigger}
      title="Move File"
      description={`Select a destination folder to move your file - ${
        file?.fileName || "untitled file"
      }`}
      btnSuccessChildren="Move"
      dialogCloseRef={dialogCloseRef}
      onSuccess={handleMove}
      btnSuccessDisabled={
        !selectedFolder ||
        selectedFolder._id === folderId ||
        moveFileMutation.isPending
      }
      isPending={moveFileMutation.isPending}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium ml-1">Folder</span>
        <SelectFolder
          folders={folders}
          value={selectedFolder?._id}
          onChange={(folderId) =>
            setSelectedFolder(folders.find((f) => f._id === folderId))
          }
          excludeFolderId={folderId} // Optional: prevent selection of current folder
        />
        {/* Optionally, show error */}
        {moveFileMutation.isError && (
          <span className="text-sm text-red-500 mt-1">
            {moveFileMutation.error?.message || "Failed to move file."}
          </span>
        )}
      </div>
    </CDialog>
  );
};

export default MoveForm;
