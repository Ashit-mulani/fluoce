import File from "../models/file-model.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisGet, redisSet } from "../utils/safeRedis.js";
import { getPreviewUrl } from "./helpers/getObject.js";

const getFilesByFolder = asyncFunc(async (req, res) => {
  const folderId = req.folder._id;
  const { userId } = req.body;

  let files = await redisGet(`folderFiles:${folderId}`);

  if (!files) {
    files = await File.find({
      userId,
      folderId,
      isTrash: false,
    }).sort({ createdAt: -1 });
    redisSet(`folderFiles:${folderId}`, files, 600);
  }

  if (!files) {
    throw new apiError(404, "Files not found inside this folder");
  }

  return res
    .status(200)
    .json(new apiRes(200, { files }, "Files fetched successfully"));
});

const getObjectPreviewUrl = asyncFunc(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new apiError(404, "File not found in request");
  }

  let cachedData = await redisGet(`previewUrl:${file._id}`);

  if (!cachedData) {
    const previewUrl = await getPreviewUrl(file?.objectKey);

    cachedData = {
      previewUrl,
      fileName: file?.fileName,
      mimeType: file?.metaData?.mimeType,
    };

    await redisSet(`previewUrl:${file._id}`, cachedData, 29 * 60);
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        previewUrl: cachedData.previewUrl,
        fileName: cachedData.fileName,
        mimeType: cachedData.mimeType,
      },
      "Preview Url fetched successfully"
    )
  );
});

const getTrashFiles = asyncFunc(async (req, res) => {
  const { userId } = req.body;

  let files = await redisGet(`trashFiles:${userId}`);

  if (!files) {
    files = await File.find({
      userId,
      isTrash: true,
    }).sort({ updatedAt: -1 });

    redisSet(`trashFiles:${userId}`, files, 300);
  }

  return res
    .status(200)
    .json(new apiRes(200, { files }, "trash Files fetched successfully"));
});

export { getFilesByFolder, getObjectPreviewUrl, getTrashFiles };
