import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";

//write

const preSignedUrl = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { files } = req.body;

  validateFields({ userId, files, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/write/api/v2/file/presignedurl/${folderId}`,
    data: {
      userId,
      files,
    },
  });

  return res.json(result);
});

const createFile = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { files } = req.body;

  validateFields({ userId, files, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/write/api/v2/file/${folderId}`,
    data: {
      userId,
      files,
    },
  });

  return res.json(result);
});

const updateFile = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { fileId } = req.params;
  const { fileName } = req.body;

  validateFields({ userId, folderId, fileName });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "put",
    url: `${baseUrl}/write/api/v2/file/${folderId}/${fileId}`,
    data: {
      userId,
      fileName,
    },
  });

  return res.json(result);
});

const toggelTrashOrFavoriteFile = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { fileId } = req.params;
  const { isTrash, isFavorite } = req.body;

  const body = { userId };

  if (typeof isTrash === "boolean") {
    body.isTrash = isTrash;
  }
  if (typeof isFavorite === "boolean") {
    body.isFavorite = isFavorite;
  }

  validateFields({ userId, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "patch",
    url: `${baseUrl}/write/api/v2/file/${folderId}/${fileId}`,
    data: body,
  });

  return res.json(result);
});

const moveFile = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { fileId } = req.params;
  const { targetedFolderId } = req.body;

  validateFields({ userId, folderId, targetedFolderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "put",
    url: `${baseUrl}/write/api/v2/file/move/${folderId}/${fileId}`,
    data: {
      userId,
      targetedFolderId,
    },
  });

  return res.json(result);
});

const deleteFile = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;
  const { fileId } = req.params;

  validateFields({ userId, folderId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "delete",
    url: `${baseUrl}/write/api/v2/file/${folderId}/${fileId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

//read

const getFilesByFolder = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId } = req.params;

  validateFields({ folderId, userId });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/file/${folderId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

const getObjectPreviewUrl = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { folderId, fileId } = req.params;

  validateFields({ fileId, folderId, userId });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/file/previewUrl/${folderId}/${fileId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

const getTrashFiles = asyncFunc(async (req, res) => {
  const userId = req.user._id;

  validateFields({ userId });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/file/trash`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

export {
  preSignedUrl,
  createFile,
  updateFile,
  toggelTrashOrFavoriteFile,
  moveFile,
  deleteFile,
  getFilesByFolder,
  getObjectPreviewUrl,
  getTrashFiles,
};
