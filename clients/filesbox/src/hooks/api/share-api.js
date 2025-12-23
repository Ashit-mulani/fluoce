import { writeApi } from "@/lib/axios";

export const createShare = async (folderId, fileId, data) => {
  try {
    const res = await writeApi.post(`/share/${folderId}/${fileId}`, data);
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Failed to create share Link"
    );
  }
};

export const deleteShare = async (shareId) => {
  try {
    const res = await writeApi.delete(`/share/${shareId}`);
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Failed to delete share Link"
    );
  }
};
