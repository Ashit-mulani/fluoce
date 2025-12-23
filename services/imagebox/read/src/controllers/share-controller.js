import Share from "../models/share-model.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisDel, redisGet, redisSet } from "../utils/safeRedis.js";
import { getPreviewUrl } from "./helpers/getObject.js";
import { validateFields } from "../utils/validateFields.js";

const getShare = asyncFunc(async (req, res) => {
  const { userId, email } = req.body;

  let shared = await redisGet(`share:myShares:${userId}`);

  let sharedWithMe = await redisGet(`share:sharedWithMe:${email}`);

  if (!shared) {
    shared = await Share.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean();
    redisSet(`share:myShares:${userId}`, shared, 600);
  }

  if (!sharedWithMe) {
    sharedWithMe = await Share.find({
      "sharedWith.email": email,
      ownerId: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .lean();

    redisSet(`share:sharedWithMe:${email}`, sharedWithMe, 600);
  }

  const filterFields = (obj) => {
    const { objectKey, createdAt, expiresAt, updatedAt, __v, ...rest } = obj;
    return rest;
  };

  let filteredShared = Array.isArray(shared) ? shared.map(filterFields) : [];
  let filteredSharedWithMe = Array.isArray(sharedWithMe)
    ? sharedWithMe.map(filterFields)
    : [];

  return res
    .status(200)
    .json(
      new apiRes(
        200,
        { shared: filteredShared, sharedWithMe: filteredSharedWithMe },
        "Share files fetched"
      )
    );
});

const getShareFile = asyncFunc(async (req, res) => {
  const { shareId } = req.params;

  let shareDoc = await redisGet(`shared:${shareId}`);

  if (!shareDoc) {
    shareDoc = await Share.findById(shareId);

    if (!shareDoc) {
      throw new apiError(404, "Share file not found");
    }

    redisSet(`shared:${shareId}`, shareDoc, 60 * 60);
  }

  if (shareDoc.expiresAt && shareDoc.expiresAt < new Date()) {
    redisDel(`shared:${shareId}`);
    throw new apiError(410, "Share link expired");
  }

  let allowed = false;

  if (shareDoc.isForAll === true) {
    allowed = true;
  } else {
    const { userId, email } = req.body;

    validateFields({ email, userId });

    if (shareDoc.ownerId?.toString?.() === userId?.toString?.()) {
      allowed = true;
    }
    if (!allowed && Array.isArray(shareDoc.sharedWith) && email) {
      const sharedEmailMatch = shareDoc.sharedWith.some(
        (u) => u.email === email
      );
      if (sharedEmailMatch) allowed = true;
    }
  }

  if (!allowed) {
    throw new apiError(403, "You do not have access to this shared file");
  }

  let previewUrl = await redisGet(`sharePreview:${shareId}`);

  if (!previewUrl) {
    previewUrl = await getPreviewUrl(shareDoc.objectKey);

    if (!previewUrl) {
      throw new apiError(500, "Failed to get file view");
    }

    redisSet(`sharePreview:${shareId}`, previewUrl, 28 * 60);
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        fileName: shareDoc.fileName,
        mimeType: shareDoc.mimeType,
        previewUrl,
      },
      "Preview URL generated successfully"
    )
  );
});

export { getShare, getShareFile };
