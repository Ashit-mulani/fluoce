import Folder from "../models/folder-model.js";
import { validateFields } from "../utils/validateFields.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisDel, redisGet, redisSet } from "../utils/safeRedis.js";

const getFolders = asyncFunc(async (req, res) => {
  const { userId } = req.body;

  let folders = await redisGet(`folders:${userId}`);

  if (!folders) {
    folders = await Folder.find({ userId });
  }

  if (!folders) {
    throw new apiError(404, "Folders not found");
  }

  redisSet(`folders:${userId}`, folders, 300);

  return res
    .status(200)
    .json(new apiRes(200, { folders }, "folders fetched successfully"));
});

export { getFolders };
