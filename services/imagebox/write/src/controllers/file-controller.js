import File from "../models/file-model.js";
import Storage from "../models/storage-model.js";
import mongoose from "mongoose";
import { validateFields } from "../utils/validateFields.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisDel, redisGet, redisSet } from "../utils/safeRedis.js";
import { getMultipleSignedUrls } from "./helpers/getSignedUrl.js";
import { formatFileSize } from "../utils/formatFileSize.js";
import mime from "mime-types";
import { getObjectChunks } from "./helpers/getSignedUrl.js";
import { createThumbnail } from "../utils/createThumbnail.js";
import { putObject } from "./helpers/putObject.js";
import {
  deleteObjectFromR2,
  deleteObjectFromR2Public,
} from "./helpers/deleteObject.js";
import { extractKeyFromUrl } from "../utils/extractKeyFromUrl.js";
import { getR2FileInfo } from "./helpers/infoObject.js";
import { isMongoId } from "../utils/isMongoId.js";
import Folder from "../models/folder-model.js";
import { checkStorageLimit, getOrCreateStorage } from "./helpers/storage.js";
import logger from "../utils/logger.js";

const preSignedUrl = asyncFunc(async (req, res) => {
  const { userId, files } = req.body;
  const folderId = req.folder._id;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new apiError(400, "files array is required");
  }

  if (files.length > 5) {
    throw new apiError(400, "A maximum of 5 files are allowed per request");
  }

  let cache = await redisGet(`storage:${userId}`);

  let storage;

  if (cache?.storage) {
    storage = cache.storage;
  } else {
    storage = await getOrCreateStorage(userId);
  }

  if (!storage) {
    throw new apiError(404, "Stoarge Not Found");
  }

  if (!checkStorageLimit(storage)) {
    throw new apiError(
      400,
      "Storage limit exceeded. Please upgrade your plan."
    );
  }

  for (const f of files) {
    if (!f || typeof f !== "object") {
      throw new apiError(400, "Invalid file object");
    }

    if (!f.tempId || typeof f.tempId !== "string") {
      throw new apiError(400, "tempId is required for each file");
    }

    if (!f.fileName || typeof f.fileName !== "string") {
      throw new apiError(400, "fileName is required for each file");
    }

    if (!f.size || typeof f.size !== "number" || f.size <= 0) {
      throw new apiError(400, "size is required for each file");
    }

    if (f.size > storage.metaData.storageLimit) {
      throw new apiError(
        400,
        `File "${f.fileName}" is too large for your storage plan.`
      );
    }
  }

  const formatedFiles = files.map((f) => ({
    tempId: f.tempId,
    fileName: f.fileName,
    contentType: mime.lookup(f.fileName) || "application/octet-stream",
  }));

  let signedUrls;

  try {
    signedUrls = await getMultipleSignedUrls(userId, formatedFiles);
    if (!signedUrls) {
      throw new apiError(500, "Failed to upload files");
    }
  } catch (error) {
    logger.error({ error }, "Failed to create singurl");
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        folderId,
        signedUrls,
      },
      "Signed URLs generated successfully"
    )
  );
});

const createFile = asyncFunc(async (req, res) => {
  const { userId, files } = req.body;
  const folderId = req.folder._id;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new apiError(400, "files array is required");
  }

  validateFields({ files });

  let cache = await redisGet(`storage:${userId}`);

  let storage;

  if (cache?.storage) {
    storage = cache.storage;
  } else {
    storage = await getOrCreateStorage(userId);
  }

  if (!checkStorageLimit(storage)) {
    throw new apiError(
      400,
      "Storage limit exceeded. Please upgrade your plan."
    );
  }

  const docsToInsert = [];
  let totalAddedBytes = 0;
  const failedFiles = [];
  let totalFilesToAdd = 0;

  for (const file of files) {
    const { objectKey, fileName, safeName } = file;

    validateFields({ objectKey, fileName, safeName });

    const info = await getR2FileInfo(objectKey);
    if (!info || !info.size) {
      failedFiles.push({
        fileName,
        reason: "File not found in storage bucket, please retry",
      });
      continue;
    }

    const realSize = info?.size || 0;
    const mimeType = info?.contentType;
    const formatedSize = formatFileSize(realSize);

    totalAddedBytes += realSize;
    totalFilesToAdd++;

    const doc = {
      fileName,
      folderId,
      userId,
      objectKey,
      metaData: {
        size: Number(realSize),
        formatedSize,
        mimeType,
      },
    };

    docsToInsert.push(doc);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdFiles = await File.insertMany(docsToInsert, {
      ordered: false,
      session,
    });

    const updatedStorage = await Storage.findOneAndUpdate(
      { userId },
      {
        $inc: {
          "metaData.usedStorage": totalAddedBytes,
          "metaData.totalFiles": docsToInsert.length,
        },
      },
      { new: true, session }
    );

    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: folderId },
      {
        $inc: {
          "metaData.size": totalAddedBytes,
          "metaData.totalFiles": docsToInsert.length,
        },
      },
      {
        new: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    const response = {
      files: createdFiles,
      updatedStorage,
      updatedFolder,
    };

    if (failedFiles.length > 0) {
      response.failedFiles = failedFiles;
      response.partialSuccess = true;
    }

    for (const file of createdFiles) {
      redisSet(`file:${file._id}`, file, 300);
    }

    redisDel(`folderFiles:${folderId}`);
    redisDel(`storage:${userId}`);
    redisDel(`dashboard:${userId}`);
    redisDel(`activity:${userId}`);

    return res
      .status(201)
      .json(
        new apiRes(
          201,
          response,
          failedFiles.length > 0
            ? `${createdFiles.length} files uploaded successfully, ${failedFiles.length} failed`
            : "Files uploaded successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(500, "Failed to create files");
  }
});

const updateFile = asyncFunc(async (req, res) => {
  const file = req.file;
  const folderId = req.folder._id;
  const { userId, fileName } = req.body;

  validateFields({ fileName, userId });

  if (file.fileName !== fileName) {
    file.fileName = fileName;
    try {
      const updatedFile = await File.findByIdAndUpdate(
        file._id,
        { fileName },
        { new: true }
      );

      redisSet(`file:${file._id}`, updatedFile, 300);
      redisDel(`folderFiles:${folderId}`);
      redisDel(`activity:${userId}`);

      return res.status(200).json(
        new apiRes(
          200,
          {
            file: updatedFile,
          },
          "file updated successfully"
        )
      );
    } catch (error) {
      throw new apiError(500, "Failed to update file");
    }
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        file,
      },
      "file updated successfully"
    )
  );
});

const toggelTrashOrFavoriteFile = asyncFunc(async (req, res) => {
  const file = req.file;
  const folderId = req.folder._id;
  const { userId, isTrash, isFavorite } = req.body;

  const oldTrashState = file.isTrash;
  const fileSize = file.metaData.size;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updateFields = {};

    if (typeof isTrash === "boolean") {
      updateFields.isTrash = isTrash;
    }

    if (typeof isFavorite === "boolean") {
      updateFields.isFavorite = isFavorite;
    }

    const updatedFile = await File.findOneAndUpdate(
      { _id: file._id },
      { $set: updateFields },
      { new: true, session }
    );

    let updatedStorage = null;

    if (typeof isTrash === "boolean" && isTrash !== oldTrashState) {
      if (isTrash === true) {
        updatedStorage = await Storage.findOneAndUpdate(
          { userId },
          { $inc: { "metaData.trashSize": fileSize } },
          { new: true, session }
        );
      } else {
        updatedStorage = await Storage.findOneAndUpdate(
          { userId },
          { $inc: { "metaData.trashSize": -fileSize } },
          { new: true, session }
        );
      }
      redisDel(`folderFiles:${folderId}`);
      redisDel(`trashFiles:${userId}`);
    }

    redisSet(`file:${updatedFile._id}`, updatedFile, 300);

    if (updatedStorage) {
      redisDel(`storage:${userId}`);
      redisDel(`dashboard:${userId}`);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new apiRes(
        200,
        {
          file: updatedFile,
          updatedStorage,
        },
        "file updated successfully"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(500, "Failed to update file");
  }
});

const moveFile = asyncFunc(async (req, res) => {
  const file = req.file;
  const folderId = req.folder._id;
  const { userId, targetedFolderId } = req.body;

  if (!isMongoId(targetedFolderId)) {
    throw new apiError(400, "Invalid targetedFolderId");
  }

  if (String(folderId) === String(targetedFolderId)) {
    return res.status(200).json(
      new apiRes(
        200,
        {
          file,
          moveFromFolder: req.folder,
          moveInFolder: req.folder,
        },
        "folder moved successfully"
      )
    );
  }

  const targetedFolder = await Folder.findOne({
    _id: targetedFolderId,
    userId,
  });

  if (!targetedFolder) {
    throw new apiError(404, "targeted folder not exist");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fileSize = file?.metaData?.size ?? 0;

    const updatedFile = await File.findByIdAndUpdate(
      file._id,
      { folderId: targetedFolderId },
      { new: true, session }
    );

    const moveFromFolder = await Folder.findOneAndUpdate(
      { _id: folderId },
      {
        $inc: {
          "metaData.size": -fileSize,
          "metaData.totalFiles": -1,
        },
      },
      { new: true, session }
    );

    const moveInFolder = await Folder.findOneAndUpdate(
      { _id: targetedFolderId },
      {
        $inc: {
          "metaData.size": fileSize,
          "metaData.totalFiles": 1,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    redisSet(`file:${updatedFile._id}`, updatedFile, 300);
    redisDel(`folderFiles:${targetedFolderId}`);
    redisDel(`folderFiles:${folderId}`);
    redisDel(`dashboard:${userId}`);

    return res.status(200).json(
      new apiRes(
        200,
        {
          file: updatedFile,
          moveFromFolder,
          moveInFolder,
        },
        "folder moved successfully"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(500, "failed to move file");
  }
});

const deleteFile = asyncFunc(async (req, res) => {
  const file = req.file;
  const folderId = req.folder._id;
  const userId = req.body.userId;

  validateFields({ userId });

  if (!file) {
    throw new apiError(404, "File not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await File.findOneAndDelete({ _id: file._id, folderId }, { session });

    const isInTrash = file?.isTrash;
    const fileSize = file?.metaData?.size;

    const storageUpdate = {
      $inc: {
        "metaData.usedStorage": -fileSize,
        "metaData.totalFiles": -1,
      },
    };

    if (isInTrash) {
      storageUpdate.$inc["metaData.trashSize"] = -fileSize;
    }

    const updatedStorage = await Storage.findOneAndUpdate(
      { userId },
      storageUpdate,
      { new: true, session }
    );

    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: folderId },
      {
        $inc: {
          "metaData.size": -fileSize,
          "metaData.totalFiles": -1,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    redisDel(`file:${file._id}`);
    redisDel(`folderFiles:${folderId}`);
    redisDel(`dashboard:${userId}`);
    redisDel(`storage:${userId}`);
    redisDel(`trashFiles:${userId}`);

    setImmediate(async () => {
      await deleteObjectFromR2(file.objectKey);
      if (file.thumbnailUrl) {
        const thumbnailKey = extractKeyFromUrl(file.thumbnailUrl);

        if (thumbnailKey) {
          await deleteObjectFromR2Public(thumbnailKey);
        }
      }
    });

    return res
      .status(200)
      .json(
        new apiRes(
          200,
          { updatedStorage, updatedFolder },
          "file deleted successfully"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(500, "Failed to delete file");
  }
});

export {
  preSignedUrl,
  createFile,
  updateFile,
  toggelTrashOrFavoriteFile,
  moveFile,
  deleteFile,
};
