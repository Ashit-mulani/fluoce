import { useQuery, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createShare, deleteShare } from "../api/share-api";
import {
  addSharedFile,
  removeSharedFile,
  setSharedFiles,
} from "@/store/slice/sharedFile";
import store from "@/store/store";

export const useCreateShare = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ folderId, fileId, data }) => {
      const res = await createShare(folderId, fileId, data);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.share) {
        dispatch(addSharedFile(data?.share));
      }
    },
  });
};

export const useDeleteShare = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (shareId) => {
      dispatch(removeSharedFile(shareId));
      const res = await deleteShare(shareId);
      return res?.data;
    },
    onError: (error, shareId, context) => {
      if (context && context.previousShared) {
        dispatch(setSharedFiles(context.previousShared));
      }
    },
    onMutate: async () => {
      const previousShared = structuredClone(
        store.getState().sharedFiles.shared
      );
      return { previousShared };
    },
  });
};
