import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";

// write

const createShare = asyncFunc(async (req, res) => {
  const user = req.user;
  const { fileId, folderId } = req.params;
  const { isForAll, emails = [], expiry } = req.body;

  validateFields({
    fileId,
    user,
    folderId,
  });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/write/api/v2/share/${folderId}/${fileId}`,
    data: {
      userId: user._id,
      isForAll,
      emails,
      expiry,
      ownerInfo: {
        name: user?.name,
        email: user.email,
        profilePhoto: user?.profilePhoto,
      },
    },
  });

  return res.json(result);
});

const deleteShare = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { shareId } = req.params;

  validateFields({ shareId, userId });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "delete",
    url: `${baseUrl}/write/api/v2/share/${shareId}`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

// read

const getShare = asyncFunc(async (req, res) => {
  const user = req.user;

  validateFields({ user });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/share`,
    data: {
      userId: user._id,
      email: user.email,
    },
  });

  return res.json(result);
});

const getShareFile = asyncFunc(async (req, res) => {
  const user = req.user;
  const { shareId } = req.params;

  validateFields({ shareId });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/share/previewUrl/${shareId}`,
    data: {
      userId: user?._id || null,
      email: user?.email || null,
    },
  });

  return res.json(result);
});

export { createShare, deleteShare, getShare, getShareFile };
