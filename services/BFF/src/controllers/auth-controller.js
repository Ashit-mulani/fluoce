import { asyncFunc } from "../utils/asyncFunc.js";
import { apiRes } from "../utils/apiRes.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";
import { cookieOption } from "../utils/cookieOption.js";

// const authUrl = process.env.AUTH_URL;

const emailAuth = asyncFunc(async (req, res) => {
  const { email, domain } = req.body;

  validateFields({ email, domain });

  const baseUrl = await resolveService("auth-imagebox-auth");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/email`,
    data: {
      email,
      domain,
    },
  });

  const { email: em } = result.data;

  return res.json(new apiRes(200, { email: em }, "Email login success"));
});

const emailVerify = asyncFunc(async (req, res) => {
  const { email, otp, domain, device } = req.body;

  const baseUrl = await resolveService("auth-imagebox-auth");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/email/verify`,
    data: {
      email,
      otp,
      domain,
      device,
    },
  });

  const { user, at, rt, domain: dm } = result.data;

  return res
    .cookie("accessToken", at, cookieOption({ domain: dm, expiry: "1h" }))
    .cookie("refreshToken", rt, cookieOption({ domain: dm, expiry: "60d" }))
    .json(new apiRes(200, { ...user, domain: dm }, "Google login success"));
});

const googleAuth = asyncFunc(async (req, res) => {
  const { code, domain, device } = req.body;

  validateFields({ code, domain });

  const baseUrl = await resolveService("auth-imagebox-auth");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/google`,
    data: {
      code,
      domain,
      device: device || null,
    },
  });

  const { user, at, rt, domain: dm } = result.data;

  return res
    .cookie("accessToken", at, cookieOption({ domain: dm, expiry: "1h" }))
    .cookie("refreshToken", rt, cookieOption({ domain: dm, expiry: "60d" }))
    .json(new apiRes(200, { ...user, domain: dm }, "Google login success"));
});

const refreshToken = asyncFunc(async (req, res) => {
  const { domain } = req.body;

  validateFields({ domain });

  const token =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new apiRes(401, undefined, "refresh token not found"));
  }

  const baseUrl = await resolveService("auth-imagebox-auth");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/refresh`,
    data: {
      domain,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { user, at, rt, domain: dm } = result.data;

  return res
    .cookie("accessToken", at, cookieOption({ domain: dm, expiry: "1h" }))
    .cookie("refreshToken", rt, cookieOption({ domain: dm, expiry: "60d" }))
    .json(
      new apiRes(200, { ...user, at, domain: dm }, "Token refresh success")
    );
});

const me = asyncFunc(async (req, res) => {
  const { domain } = req.body;

  validateFields({ domain });

  const token =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new apiRes(401, undefined, "refresh token not found"));
  }

  const baseUrl = await resolveService("auth-imagebox-auth");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/me`,
    data: {
      domain,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { user, at, rt, domain: dm } = result.data;

  return res
    .cookie("accessToken", at, cookieOption({ domain: dm, expiry: "1h" }))
    .cookie("refreshToken", rt, cookieOption({ domain: dm, expiry: "60d" }))
    .json(
      new apiRes(200, { ...user, at, domain: dm }, "Token refresh success")
    );
});

const logout = asyncFunc(async (req, res) => {
  const { domain } = req.body;

  validateFields({ domain });

  const token =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json(new apiRes(401, undefined, "refresh token not found"));
  }

  const baseUrl = await resolveService("auth-imagebox-auth");

  axiosHandler({
    method: "post",
    url: `${baseUrl}/auth/api/v2/logout`,
    data: {
      domain,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res
    .clearCookie("accessToken", cookieOption({ domain }))
    .clearCookie("refreshToken", cookieOption({ domain }))
    .json(new apiRes(200, undefined, "Logout successfully"));
});

export { emailAuth, emailVerify, googleAuth, refreshToken, me, logout };
