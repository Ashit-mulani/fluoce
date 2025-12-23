import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";

// read

const getDashboard = asyncFunc(async (req, res) => {
  const userId = req.user._id;

  validateFields({
    userId,
  });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/dashboard`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

const getStorage = asyncFunc(async (req, res) => {
  const userId = req.user._id;

  validateFields({
    userId,
  });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/storage`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

const getActivity = asyncFunc(async (req, res) => {
  const userId = req.user._id;

  validateFields({
    userId,
  });

  const baseUrl = await resolveService("read-imagebox-read");

  const result = await axiosHandler({
    method: "get",
    url: `${baseUrl}/read/api/v2/activity`,
    data: {
      userId,
    },
  });

  return res.json(result);
});

export { getDashboard, getStorage, getActivity };
