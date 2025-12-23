import Storage from "../models/storage-model.js";
import Folder from "../models/folder-model.js";
import File from "../models/file-model.js";
import Share from "../models/share-model.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { redisGet, redisSet } from "../utils/safeRedis.js";
import { validateFields } from "../utils/validateFields.js";

const getDashboard = asyncFunc(async (req, res) => {
  const { userId } = req.body;

  validateFields({ userId });

  const cachekey = `dashboard:${userId}`;

  let dashboardData = await redisGet(cachekey);

  if (!dashboardData) {
    const folders = await Folder.find({ userId, isTrash: false }).lean();
    const recentUpload = await File.find({ userId })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    dashboardData = {
      recentUpload,
      folders,
    };

    redisSet(cachekey, dashboardData, 600);
  }

  return res.status(200).json(new apiRes(200, { dashboardData }, "_ok"));
});

const getStorage = asyncFunc(async (req, res) => {
  const { userId } = req.body;

  validateFields({ userId });

  const cachekey = `storage:${userId}`;

  let cachedData = await redisGet(cachekey);

  if (!cachedData) {
    const [storage, trashFolders] = await Promise.all([
      Storage.findOne({ userId }).lean(),
      Folder.find({ userId, isTrash: true }).lean(),
    ]);

    cachedData = {
      storage,
      trashFolders,
    };

    redisSet(cachekey, cachedData, 600);
  }

  return res.status(200).json(new apiRes(200, cachedData, "_ok"));
});

const getActivity = asyncFunc(async (req, res) => {
  const { userId } = req.body;

  validateFields({ userId });

  const cachekey = `activity:${userId}`;

  let cachedData = await redisGet(cachekey);

  if (!cachedData) {
    const [
      updatedFiles,
      updatedFolders,
      createdFiles,
      createdFolders,
      recentShared,
    ] = await Promise.all([
      File.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean(),
      Folder.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean(),
      File.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      Folder.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      Share.find({ ownerId: userId }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    let activities = [
      ...createdFiles.map((i) => ({
        type: "created_file",
        name: i.fileName,
        id: i._id,
        time: i.createdAt,
      })),

      ...createdFolders.map((i) => ({
        type: "created_folder",
        name: i.name,
        id: i._id,
        time: i.createdAt,
      })),

      ...updatedFiles
        .filter((i) => i.updatedAt.getTime() !== i.createdAt.getTime())
        .map((i) => ({
          type: "updated_file",
          name: i.fileName,
          id: i._id,
          time: i.updatedAt,
        })),

      ...updatedFolders
        .filter((i) => i.updatedAt.getTime() !== i.createdAt.getTime())
        .map((i) => ({
          type: "updated_folder",
          name: i.name,
          id: i._id,
          time: i.updatedAt,
        })),

      ...recentShared.map((i) => ({
        type: "shared",
        name: i.fileName,
        id: i._id,
        time: i.createdAt,
      })),
    ];

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    cachedData = {
      activityData: activities,
    };

    redisSet(cachekey, cachedData, 600);
  }

  return res.status(200).json(new apiRes(200, cachedData, "_ok"));
});

export { getDashboard, getStorage, getActivity };
