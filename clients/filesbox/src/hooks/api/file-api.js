import { readApi, writeApi } from "@/lib/axios";

export const getPreviewUrl = async (foldrerId, fileId) => {
  try {
    const res = await readApi.get(`/file/previewUrl/${foldrerId}/${fileId}`);
    return res.data;
  } catch (err) {
    return false;
  }
};

export const updateFile = async (folderId, fileId, data) => {
  try {
    const res = await writeApi.put(`/file/${folderId}/${fileId}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to update File");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to update File");
  }
};

export const toggelTrashOrFavoriteFile = async (folderId, fileId, data) => {
  try {
    const res = await writeApi.patch(`/file/${folderId}/${fileId}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to update File");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to update File");
  }
};

export const moveFile = async (folderId, fileId, data) => {
  try {
    const res = await writeApi.put(`/file/move/${folderId}/${fileId}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to move File");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to move File");
  }
};

export const getSignedUrls = async (folderId, data) => {
  try {
    const res = await writeApi.post(`/file/presignedurl/${folderId}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to upload File");
    }
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to upload File");
  }
};

export const createFiles = async (folderId, data) => {
  try {
    const res = await writeApi.post(`/file/${folderId}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to upload File");
    }
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to upload File");
  }
};

export const deleteFiles = async (folderId, fileId) => {
  try {
    const res = await writeApi.delete(`/file/${folderId}/${fileId}`);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to delete File");
    }
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to delete File");
  }
};
