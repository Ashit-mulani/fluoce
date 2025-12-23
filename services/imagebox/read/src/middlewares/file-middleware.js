import File from "../models/file-model.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisGet } from "../utils/safeRedis.js";
import { isMongoId } from "../utils/isMongoId.js";

export const fileAuth = asyncFunc(async (req, res, next) => {
  const folderId = req.folder._id;
  const { fileId } = req.params;
  const { userId } = req.body;

  if (!isMongoId(fileId)) {
    throw new apiError(400, "Invalid fileId");
  }

  let file = await redisGet(`file:${fileId}`);

  if (!file) {
    file = await File.findOne({ _id: fileId, folderId, userId }).select(
      "-__v -updatedAt"
    );
  }

  if (!file) {
    throw new apiError(404, "File not found");
  }

  if (String(file.folderId) !== String(folderId)) {
    throw new apiError(403, "File not exist in this folder");
  }

  if (String(file.userId) !== String(userId)) {
    throw new apiError(403, "You do not have permission to access this file");
  }

  req.file = file;
  next();
});
