import { writeApi } from "@/lib/axios";

export const createFolder = async (data) => {
  try {
    const res = await writeApi.post(`/folder`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to create folder");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to create folder");
  }
};

export const updateFolder = async (id, data) => {
  try {
    const res = await writeApi.put(`/folder/${id}`, data);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to update folder");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to update folder");
  }
};

export const trashFolder = async (id) => {
  try {
    const res = await writeApi.put(`/folder/trash/${id}`);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to move folder in Trash");
    }
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Failed to move folder in Trash"
    );
  }
};

export const deleteFolder = async (id) => {
  try {
    const res = await writeApi.delete(`/folder/${id}`);
    if (res.data?.success === false) {
      throw new Error(res.data.message || "Failed to Delete folder");
    }
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to Delete folder");
  }
};
