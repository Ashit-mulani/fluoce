import Folder from "../models/folder-model.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisGet } from "../utils/safeRedis.js";
import { isMongoId } from "../utils/isMongoId.js";

export const folderAuth = asyncFunc(async (req, res, next) => {
  const { folderId } = req.params;
  const { userId } = req.body;

  if (!isMongoId(folderId)) {
    throw new apiError(400, "Invalid folderId");
  }
  if (!isMongoId(userId)) {
    throw new apiError(400, "Invalid userId");
  }

  let folder = await redisGet(`folder:${folderId}`);

  if (!folder) {
    folder = await Folder.findOne({ _id: folderId, userId }).select(
      "-__v -updatedAt"
    );
  }

  if (!folder) {
    throw new apiError(404, "Folder not found");
  }

  if (folder.userId != userId) {
    throw new apiError(403, "You do not have permission to access this folder");
  }

  req.folder = folder;
  next();
});
