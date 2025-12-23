import Storage from "../models/storage-model.js";
import File from "../models/file-model.js";
import Folder from "../models/folder-model.js";
import { validateFields } from "../utils/validateFields.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisDel, redisSet } from "../utils/safeRedis.js";
import {
  deleteObjectFromR2,
  deleteObjectFromR2Public,
} from "./helpers/deleteObject.js";
import { extractKeyFromUrl } from "../utils/extractKeyFromUrl.js";

const createFolder = asyncFunc(async (req, res) => {
  const { name, userId } = req.body;

  validateFields({ name, userId });

  const folder = await Folder.create({
    userId,
    name,
  });

  if (!folder) {
    throw new apiError(500, "Failed to create folder");
  }

  redisSet(`folder:${folder._id}`, folder, 300);
  redisDel(`folders:${userId}`);
  redisDel(`activity:${userId}`);
  redisDel(`dashboard:${userId}`);

  return res.status(200).json(
    new apiRes(
      200,
      {
        folder,
      },
      "folder created"
    )
  );
});

const updateFolder = asyncFunc(async (req, res) => {
  const folder = req.folder;
  const { userId, name } = req.body;

  if (folder.isTrash) {
    throw new apiError(404, "Folder is in trash");
  }

  validateFields({ name });

  let updatedFolder = folder;

  if (folder?.name != name) {
    updatedFolder = await Folder.findOneAndUpdate(
      { _id: folder._id, userId: folder.userId },
      { $set: { name } },
      { new: true }
    );
    if (!updatedFolder) {
      throw new apiError(404, "Folder not found");
    }
  }

  redisSet(`folder:${folder._id}`, updatedFolder, 300);
  redisDel(`folders:${userId}`);
  redisDel(`activity:${userId}`);
  redisDel(`dashboard:${userId}`);

  return res.status(200).json(
    new apiRes(
      200,
      {
        folder: updatedFolder,
      },
      "folder updated"
    )
  );
});

const trashFolder = asyncFunc(async (req, res) => {
  const folder = req.folder;
  const { userId } = req.body;

  const isTrashToggled = !folder.isTrash;

  const updatedFolder = await Folder.findOneAndUpdate(
    { _id: folder._id, userId: folder.userId },
    { $set: { isTrash: isTrashToggled } },
    { new: true }
  );

  if (!updatedFolder) {
    throw new apiError(404, "Folder not found");
  }

  let storageUpdate = {};
  if (isTrashToggled) {
    storageUpdate = {
      $inc: {
        "metaData.trashSize": folder.metaData.size ?? 0,
      },
    };
  } else {
    storageUpdate = {
      $inc: {
        "metaData.trashSize": -1 * (folder.metaData.size ?? 0),
      },
    };
  }

  let updatedStorge = null;

  if ((folder.metaData?.size ?? 0) !== 0) {
    updatedStorge = await Storage.findOneAndUpdate({ userId }, storageUpdate, {
      new: true,
    });
  }

  const message = updatedFolder.isTrash
    ? "folder moved to trash"
    : "folder restored from trash";

  redisSet(`folder:${folder._id}`, updatedFolder, 300);
  redisDel(`folders:${userId}`);
  redisDel(`dashboard:${userId}`);
  redisDel(`activity:${userId}`);

  return res.status(200).json(
    new apiRes(
      200,
      {
        folder: updatedFolder,
        updatedStorge,
      },
      message
    )
  );
});

const deleteFolder = asyncFunc(async (req, res) => {
  const folder = req.folder;
  const { userId } = req.body;

  const filesInFolder = await File.find({
    folderId: folder._id,
    userId: folder.userId,
  });

  setImmediate(async () => {
    for (const file of filesInFolder) {
      try {
        await deleteObjectFromR2(file.objectKey);
        if (file.thumbnailUrl) {
          const thumbnailKey = extractKeyFromUrl(file.thumbnailUrl);

          if (thumbnailKey) {
            await deleteObjectFromR2Public(thumbnailKey);
          }
        }
      } catch (err) {}
    }
  });

  const filesDeleted = await File.deleteMany({
    folderId: folder._id,
    userId: folder.userId,
  });

  const result = await Folder.deleteOne({
    _id: folder._id,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new apiError(404, "Folder not found or already deleted");
  }

  let updatedStorge = null;
  if ((filesDeleted?.deletedCount ?? 0) > 0) {
    updatedStorge = await Storage.findOneAndUpdate(
      { userId },
      {
        $inc: {
          "metaData.usedStorage": -1 * (folder.metaData.size ?? 0),
          "metaData.totalFiles": -1 * (folder.metaData.totalFiles ?? 0),
          ...(folder.isTrash
            ? { "metaData.trashSize": -1 * (folder.metaData.size ?? 0) }
            : {}),
        },
      },
      { new: true }
    );
  }

  redisDel(`folder:${folder._id}`);
  redisDel(`folders:${userId}`);
  redisDel(`dashboard:${userId}`);
  redisDel(`dashboard:${userId}`);

  return res.status(200).json(
    new apiRes(
      200,
      {
        folder,
        filesDeleted: filesDeleted.deletedCount,
        updatedStorge,
      },
      "folder deleted permanently"
    )
  );
});

export { createFolder, updateFolder, trashFolder, deleteFolder };
