import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPreviewUrl,
  updateFile,
  toggelTrashOrFavoriteFile,
  moveFile,
  getSignedUrls,
  createFiles,
  deleteFiles,
} from "../api/file-api";
import {
  addFileToFolder,
  removeFileFromFolder,
  setFilesForFolder,
  updateFileInFolder,
} from "@/store/slice/files";
import { setUsage } from "@/store/slice/usage";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store/store";
import {
  addRecentUpload,
  removeRecentUpload,
  setRecentUploads,
  updateRecentUpload,
} from "@/store/slice/recentuploads";
import {
  addTrashFile,
  removeTrashFile,
  setTrashFiles,
} from "@/store/slice/trashFiles";
import { updateFolderData } from "@/store/slice/folders";

export const usePreviewUrl = (folderId, fileId, options = {}) => {
  return useQuery({
    queryKey: ["previewUrl", folderId, fileId],
    queryFn: async () => {
      const res = await getPreviewUrl(folderId, fileId);
      return res?.data ?? {};
    },
    refetchOnWindowFocus: true,
    retry: 2,
    enabled: (options?.enabled ?? true) && Boolean(folderId) && Boolean(fileId),
    staleTime: 1000 * 60 * 25,
  });
};

export const useUpdateFile = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ folderId, fileId, data }) => {
      const res = await updateFile(folderId, fileId, data);
      return res?.data?.file ?? res;
    },
    onMutate: async ({ folderId, fileId, data }) => {
      const previousFiles = structuredClone(
        store.getState().files[folderId] ?? []
      );
      dispatch(
        updateFileInFolder({
          folderId,
          file: { _id: fileId, ...data },
        })
      );
      dispatch(updateRecentUpload({ _id: fileId, ...data }));
      return { previousFiles, folderId };
    },
    onError: (err, variables, context) => {
      if (context?.previousFiles && context.folderId) {
        dispatch(
          setFilesForFolder({
            folderId: context.folderId,
            files: context.previousFiles,
          })
        );
      }
    },
    onSuccess: (updatedFile, variables) => {
      dispatch(
        updateFileInFolder({
          folderId: variables.folderId,
          file: updatedFile,
        })
      );
    },
  });
};

export const useToggleTrashOrFavoriteFile = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ folderId, fileId, data }) => {
      const res = await toggelTrashOrFavoriteFile(folderId, fileId, data);
      return res?.data
        ? { file: res.data.file, updatedStorage: res.data.updatedStorage }
        : res;
    },
    onMutate: async ({ folderId, fileId, data }) => {
      const previousFiles = structuredClone(
        store.getState().files[folderId] ?? []
      );
      const previousTrashFiles = structuredClone(
        store.getState().trashFiles.trashFiles ?? []
      );
      const prevFile = previousFiles.find((f) => f._id === fileId) ||
        previousTrashFiles.find((f) => f._id === fileId) || {
          _id: fileId,
          ...data,
        };

      if (typeof data.isTrash !== "undefined") {
        if (data.isTrash) {
          dispatch(removeFileFromFolder({ folderId, fileId }));
          dispatch(addTrashFile(prevFile));
        } else {
          dispatch(removeTrashFile(prevFile._id));
          dispatch(addFileToFolder({ folderId, file: prevFile }));
        }
      } else {
        dispatch(
          updateFileInFolder({
            folderId,
            file: { _id: fileId, ...data },
          })
        );
      }
      dispatch(updateRecentUpload({ _id: fileId, ...data }));
      return { previousFiles, previousTrashFiles, folderId, fileId };
    },
    onError: (err, variables, context) => {
      if (context?.previousFiles && context.folderId) {
        dispatch(
          setFilesForFolder({
            folderId: context.folderId,
            files: context.previousFiles,
          })
        );
      }
      if (context?.previousTrashFiles) {
        dispatch({
          type: "trashFiles/setTrashFiles",
          payload: context.previousTrashFiles,
        });
      }
    },
    onSuccess: (result, variables) => {
      const updatedFile = result?.file;
      const updatedStorage = result?.updatedStorage;
      if (updatedStorage) {
        dispatch(setUsage(updatedStorage));
      }
      if (typeof variables?.data?.isTrash !== "undefined") {
        if (variables?.data?.isTrash) {
          dispatch(
            removeFileFromFolder({
              folderId: variables.folderId,
              fileId: variables.fileId,
            })
          );
          dispatch(addTrashFile(updatedFile));
        } else {
          dispatch(
            addFileToFolder({ folderId: variables.folderId, file: updatedFile })
          );
          dispatch(removeTrashFile(updatedFile?._id));
        }
      } else {
        dispatch(
          updateFileInFolder({
            folderId: variables.folderId,
            file: updatedFile,
          })
        );
      }
    },
  });
};

export const useMoveFile = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ folderId, fileId, data }) => {
      const res = await moveFile(folderId, fileId, data);
      return res?.data;
    },
    onMutate: async ({ folderId, fileId, data }) => {
      const prevFilesFrom = structuredClone(
        store.getState().files[folderId] ?? []
      );
      const prevFilesTo = structuredClone(
        store.getState().files[data.targetedFolderId] ?? []
      );
      dispatch(removeFileFromFolder({ folderId, fileId }));

      const file = prevFilesFrom.find((f) => f._id === fileId);
      if (file) {
        dispatch(
          addFileToFolder({
            folderId: data.targetedFolderId,
            file,
          })
        );
      }
      const prevFolders = structuredClone(
        store.getState().folders.folders ?? []
      );

      return {
        prevFilesFrom,
        prevFilesTo,
        prevFolders,
        fromId: folderId,
        toId: data.targetedFolderId,
        fileId,
      };
    },
    onError: (err, variables, context) => {
      if (context?.fromId) {
        dispatch(
          setFilesForFolder({
            folderId: context.fromId,
            files: context.prevFilesFrom || [],
          })
        );
      }
      if (context?.toId) {
        dispatch(
          setFilesForFolder({
            folderId: context.toId,
            files: context.prevFilesTo || [],
          })
        );
      }
      if (context?.prevFolders) {
        dispatch({
          type: "folders/setFolders",
          payload: context.prevFolders,
        });
      }
    },
    onSuccess: (data, variables, context) => {
      dispatch(
        removeFileFromFolder({
          folderId: context.fromId,
          fileId: context.fileId,
        })
      );
      if (data && data.file && context.toId) {
        dispatch(
          addFileToFolder({
            folderId: context.toId,
            file: data.file,
          })
        );
      }
      if (data && data.moveFromFolder && data.moveInFolder) {
        dispatch({
          type: "folders/updateFolderData",
          payload: data.moveFromFolder,
        });
        dispatch({
          type: "folders/updateFolderData",
          payload: data.moveInFolder,
        });
      }
    },
  });
};

export const useGetSignedUrls = (options) => {
  return useMutation({
    mutationFn: async ({ folderId, data }) => {
      if (!folderId) throw new Error("FolderId not found");
      const res = await getSignedUrls(folderId, data);
      return res.data;
    },
    ...options,
  });
};

// export const useCreateFiles = () => {
//   const dispatch = useDispatch();

//   return useMutation({
//     mutationFn: async ({ folderId, data }) => {
//       if (!folderId) throw new Error("No folderId");
//       const res = await createFiles(folderId, data);
//       return res.data;
//     },
//     onSuccess: (data, variables) => {
//       const createdFiles = data?.files ?? [];
//       const folderId = variables?.folderId;
//       createdFiles.forEach((file) => {
//         dispatch(
//           addFileToFolder({
//             folderId,
//             file,
//           })
//         );
//         dispatch(addRecentUpload(file));
//       });
//       dispatch(setUsage(data?.updatedStorage));
//       dispatch(updateFolderData(data?.updatedFolder));
//     },
//   });
// };

export const useDeleteFile = () => {
  const dispatch = useDispatch();
  const trashFiles = useSelector((state) => state.trashFiles.trashFiles);
  const recentUploads = useSelector(
    (state) => state.recentUploads.recentUploads
  );

  return useMutation({
    mutationFn: async ({ folderId, fileId }) => {
      if (!folderId || !fileId) {
        throw new Error("FileId or FolderId not found");
      }
      const res = await deleteFiles(folderId, fileId);
      return res.data;
    },
    onMutate: async ({ fileId }) => {
      const prevTrashFiles = structuredClone(trashFiles);
      const prevRecentUploads = structuredClone(recentUploads);

      dispatch(removeTrashFile(fileId));
      dispatch(removeRecentUpload(fileId));

      return { prevTrashFiles, prevRecentUploads };
    },
    onError: (error, variables, context) => {
      if (context?.prevTrashFiles) {
        dispatch(setTrashFiles(context.prevTrashFiles));
      }
      if (context?.prevRecentUploads) {
        dispatch(setRecentUploads(context.prevRecentUploads));
      }
    },
    onSuccess: (data) => {
      if (data?.updatedStorage) {
        dispatch(setUsage(data.updatedStorage));
      }
      if (data?.updatedFolder) {
        dispatch(updateFolderData(data.updatedFolder));
      }
    },
  });
};
