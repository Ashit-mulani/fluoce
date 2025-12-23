import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";

// write

const createFolder = asyncFunc(async (req, res) => {
  const { name } = req.body;

  const userId = req.user._id;

  validateFields({ name, userId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/write/api/v2/folder`,
    data: {
      name,
      userId,
    },
  });

  return res.json(result);
});

const updateFolder = asyncFunc(async (req, res) => {
  const { name } = req.body;
  const { folderId } = req.params;
  const userId = req.user._id;

  validateFields({ name, userId, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "put",
    url: `${baseUrl}/write/api/v2/folder/${folderId}`,
    data: {
      name,
      userId,
    },
  });

  return res.json(result);
});

const trashFolder = asyncFunc(async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;

  validateFields({ userId, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "put",
    url: `${baseUrl}/write/api/v2/folder/trash/${folderId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

const deleteFolder = asyncFunc(async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;

  validateFields({ userId, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "delete",
    url: `${baseUrl}/write/api/v2/folder/${folderId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

//read

const getFolders = asyncFunc(async (req, res) => {
  const userId = req.user._id;

  validateFields({ userId });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/folder`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

export { createFolder, updateFolder, trashFolder, deleteFolder, getFolders };
