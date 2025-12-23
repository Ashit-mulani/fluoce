import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  createFolder,
  updateFolder,
  trashFolder,
  deleteFolder,
} from "../api/folder-api";
import {
  addFolder,
  setFolders,
  updateFolderData,
  removeFolder,
} from "@/store/slice/folders";
import store from "@/store/store";
import {
  addTrashFolder,
  removeTrashFolder,
  setTrashFolders,
  setUsage,
} from "@/store/slice/usage";

export const useCreateFolder = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (data) => {
      const res = await createFolder(data);
      return res?.data?.folder;
    },
    onSuccess: (newFolder) => {
      dispatch(addFolder(newFolder));
    },
  });
};

export const useUpdateFolder = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateFolder(id, data);
      return res?.data?.folder;
    },
    onMutate: async ({ id, data }) => {
      const previousFolders = structuredClone(store.getState().folders.folders);
      dispatch(
        updateFolderData({
          _id: id,
          ...data,
        })
      );
      return { previousFolders };
    },
    onError: (err, variables, context) => {
      if (context?.previousFolders) {
        dispatch(setFolders(context.previousFolders));
      }
    },
    onSuccess: (updatedFolder) => {
      dispatch(updateFolderData(updatedFolder));
    },
  });
};

export const useTrashFolder = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await trashFolder(id);
      return res?.data;
    },
    onMutate: async ({ id }) => {
      const previousFolders = structuredClone(store.getState().folders.folders);
      const previousTrashFolders = structuredClone(
        store.getState().usage.trashFolders
      );
      const folders = [...previousFolders];
      const idx = folders.findIndex((f) => f._id === id);

      if (idx !== -1) {
        const folder = folders[idx];
        const isTrashing = !folder.isTrash;

        if (isTrashing) {
          dispatch(removeFolder(folders.filter((f) => f._id !== id)));
          dispatch(addTrashFolder(folder));
        } else {
          dispatch(removeTrashFolder(folder._id));
          dispatch(addFolder({ ...folder, isTrash: false }));
        }
      }
      return { previousFolders, previousTrashFolders };
    },
    onError: (err, variables, context) => {
      if (context?.previousFolders) {
        dispatch(setFolders(context.previousFolders));
      }
      if (context?.previousTrashFolders) {
        dispatch(setTrashFolders(context.previousTrashFolders));
      }
    },
    onSuccess: (data) => {
      if (data?.folder?.isTrash) {
        dispatch(removeFolder(data?.folder._id));
        dispatch(addTrashFolder(data.folder));
      } else {
        dispatch(addFolder(data?.folder));
        dispatch(removeTrashFolder(data?.folder._id));
      }
      if (data?.updatedStorge) {
        dispatch(setUsage(data?.updatedStorge));
      }
    },
  });
};

export const useDeleteFolder = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await deleteFolder(id);
      return res?.data;
    },
    onMutate: async ({ id }) => {
      const previousFolders = structuredClone(
        store.getState().usage.trashFolders
      );
      dispatch(removeTrashFolder(id));
      return { previousFolders };
    },
    onError: (err, variables, context) => {
      if (context?.previousFolders) {
        dispatch(setTrashFolders(context.previousFolders));
      }
    },
    onSuccess: (data) => {
      dispatch(removeTrashFolder(data?.folder?._id));
      if (data?.updatedStorge) {
        dispatch(setUsage(data?.updatedStorge));
      }
    },
  });
};
