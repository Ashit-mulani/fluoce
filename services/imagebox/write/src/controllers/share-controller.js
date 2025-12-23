import Share from "../models/share-model.js";
import { validateFields } from "../utils/validateFields.js";
import { apiRes } from "../utils/apiRes.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { redisDel, redisGet, redisSet } from "../utils/safeRedis.js";

const createShare = asyncFunc(async (req, res) => {
  const file = req.file;
  const { userId, isForAll, emails = [], expiry, ownerInfo } = req.body;

  validateFields({ file, ownerInfo, userId });

  const existingShare = await Share.findOne({
    fileId: file?._id,
    ownerId: userId,
  });

  if (existingShare) {
    throw new apiError(
      400,
      "A share link for this file already exists, view on Shared Files Tab"
    );
  }

  if (isForAll === false && (!emails || emails.length === 0)) {
    throw new apiError(400, "Provide emails or make public sharing");
  }

  const sharedWith = emails.map((email) => ({ email }));

  const shareDoc = await Share.create({
    ownerId: userId,
    ownerInfo: {
      email: ownerInfo?.email,
      name: ownerInfo?.name,
      profilePhoto: ownerInfo?.profilePhoto,
    },
    fileId: file._id,
    fileName: file.fileName,
    mimeType: file.metaData?.mimeType,
    objectKey: file.objectKey,
    isForAll: !!isForAll,
    sharedWith,
    expiresAt: expiry ? new Date(expiry) : null,
  });

  if (!shareDoc) {
    throw new apiError(500, "Failed to create share Link");
  }

  const link = `${process.env.FRONTEND_URL}/preview/shared/${shareDoc._id}`;

  redisDel(`share:myShares:${userId}`);

  redisDel(`activity:${userId}`);

  for (const user of sharedWith) {
    await redisDel(`share:sharedWithMe:${user.email}`);
  }

  return res.status(201).json(
    new apiRes(
      201,
      {
        share: shareDoc,
        link,
      },
      "Share Link created successfully"
    )
  );
});

const deleteShare = asyncFunc(async (req, res) => {
  const { shareId } = req.params;
  const { userId } = req.body;

  const share = await Share.findById(shareId);

  if (!share) {
    throw new apiError(404, "Share file not found");
  }

  if (share.ownerId.toString() !== userId.toString()) {
    throw new apiError(403, "You do not have permission to delete this share");
  }

  await Share.findByIdAndDelete(shareId);

  redisDel(`share:myShares:${userId}`);

  for (const u of share.sharedWith) {
    redisDel(`share:sharedWithMe:${u.email}`);
  }

  redisDel(`shared:${shareId}`);

  redisDel(`sharePreview:${shareId}`);

  return res
    .status(200)
    .json(new apiRes(200, {}, "Share removed successfully"));
});

export { createShare, deleteShare };
