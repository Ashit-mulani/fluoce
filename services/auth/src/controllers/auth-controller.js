import User from "../models/user-model.js";
import RefreshToken from "../models/refreshToken-model.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiError } from "../utils/apiError.js";
import { apiRes } from "../utils/apiRes.js";
import { validateFields } from "../utils/validateFields.js";
import oauth2Client from "../configs/google-oauth-client.js";
import logger from "../utils/logger.js";
import { generateRefreshToken, generateAccessToken } from "../utils/token.js";
import { isAllowedDomain } from "../utils/domain.js";
import { redisSet, redisDel, redisGet } from "../utils/safeRedis.js";
import crypto from "crypto";
import { sendOtp } from "../services/sendEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function getMissingFields(user, providerName, providerProfilePhoto) {
  const updates = {};

  if (!user.name) updates.name = providerName;
  if (!user.profilePhoto) updates.profilePhoto = providerProfilePhoto;

  return updates;
}

function generateOTP() {
  return crypto.randomInt(0, 10000).toString().padStart(4, "0");
}

const emailAuth = asyncFunc(async (req, res) => {
  const { email, domain } = req.body;

  validateFields({ email, domain });

  if (!isAllowedDomain(domain)) {
    throw new apiError(400, "Invalid login domain");
  }

  let user = await User.findOne({ email });

  if (!user) {
    const name = email.split("@")[0];
    const profilePhoto = null;

    user = await User.create({
      email,
      name,
      profilePhoto,
      providers: [],
    });
  }

  if (!user) {
    throw new apiError(500, "Failed to login, try again");
  }

  const otp = generateOTP();

  const setOtp = await redisSet(`otp:${email}`, otp, 300);

  if (!setOtp) {
    throw new apiError(500, "Failed to send verification code. Try again.");
  }

  try {
    await sendOtp(user.email, user.name, otp);
  } catch (error) {
    // throw new apiError(500, "Failed to send OTP, try later");
  }

  return res
    .status(200)
    .json(new apiRes(200, { email: user.email }, "Email login success"));
});

const emailVerify = asyncFunc(async (req, res) => {
  const { email, domain, otp, device } = req.body;

  validateFields({ email, domain, otp });

  if (!isAllowedDomain(domain)) {
    throw new apiError(400, "Invalid login domain");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found with this email");
  }

  const redisOtp = await redisGet(`otp:${email}`);

  if (!redisOtp) {
    throw new apiError(
      400,
      "Verification OTP expired, Please request a new one"
    );
  }

  if (redisOtp !== otp) {
    throw new apiError(400, "Invalid verification OTP");
  }

  redisDel(`otp:${email}`);

  const rt = await generateRefreshToken({
    _id: user._id,
    email: user.email,
  });

  const refreshTokenData = {
    userId: user._id,
    token: rt,
    userSnapshot: {
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      createdAt: user.createdAt,
    },
  };

  if (device) {
    refreshTokenData.device = device;
  }

  const refreshToken = await RefreshToken.create(refreshTokenData);

  if (!refreshToken) {
    throw new apiError(
      500,
      "There was an issue completing your login. Please try again"
    );
  }

  const at = await generateAccessToken({
    _id: user._id,
    email,
    name: user.name,
    profilePhoto: user.profilePhoto,
    createdAt: user.createdAt,
  });

  return res.status(200).json(
    new apiRes(
      200,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
          createdAt: user.createdAt,
        },
        rt,
        at,
        domain,
      },
      "Email login success"
    )
  );
});

const googleAuth = asyncFunc(async (req, res) => {
  const { code, domain, device } = req.body;

  validateFields({ code, domain });

  if (!isAllowedDomain(domain)) {
    throw new apiError(400, "Invalid login domain");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const {
      email,
      name: providerName,
      picture: providerProfilePhoto,
      sub: googleId,
    } = ticket.payload;

    let user = await User.findOne({ email });

    const hasGoogleProvider = user
      ? user.providers.some((p) => p.type === "google")
      : false;

    if (!user) {
      user = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: {
            providers: {
              type: "google",
              providerId: googleId,
              lastUsed: new Date(),
            },
          },
          $setOnInsert: {
            email,
            name: providerName,
            profilePhoto: providerProfilePhoto,
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true }
      );
    } else if (hasGoogleProvider) {
      const updates = {
        "providers.$.lastUsed": new Date(),
        updatedAt: new Date(),
        ...getMissingFields(user, providerName, providerProfilePhoto),
      };

      user = await User.findOneAndUpdate(
        {
          email,
          "providers.type": "google",
        },
        {
          $set: updates,
        },
        { new: true }
      );
    } else {
      const updates = {
        updatedAt: new Date(),
        ...getMissingFields(user, providerName, providerProfilePhoto),
      };

      user = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: {
            providers: {
              type: "google",
              providerId: googleId,
              lastUsed: new Date(),
            },
          },
          $set: updates,
        },
        { new: true }
      );
    }

    if (!user) {
      throw new apiError(500, "Failed to login, try again");
    }

    const rt = await generateRefreshToken({
      _id: user._id,
      email: user.email,
    });

    const finalName = user?.name || providerName;

    const finalProfilePhoto = user?.profilePhoto || providerProfilePhoto;

    const refreshTokenData = {
      userId: user._id,
      token: rt,
      userSnapshot: {
        email,
        name: finalName,
        profilePhoto: finalProfilePhoto,
        createdAt: user.createdAt,
      },
    };

    if (device) {
      refreshTokenData.device = device;
    }

    const refreshToken = await RefreshToken.create(refreshTokenData);

    if (!refreshToken) {
      throw new apiError(
        500,
        "There was an issue completing your login. Please try again"
      );
    }

    const at = await generateAccessToken({
      _id: user._id,
      email,
      name: finalName,
      profilePhoto: finalProfilePhoto,
      createdAt: user.createdAt,
    });

    return res.status(200).json(
      new apiRes(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt,
          },
          rt,
          at,
          domain,
        },
        "Google login success"
      )
    );
  } catch (error) {
    logger.error({ error }, "Googel login failed");
    throw new apiError(500, "Google login failed");
  }
});

const refreshToken = asyncFunc(async (req, res) => {
  const { domain } = req.body;

  validateFields({ domain });

  if (!isAllowedDomain(domain)) {
    throw new apiError(400, "Invalid login domain");
  }

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "No refresh token provided");
  }

  const cacheKey = `rt:${token}`;

  let tokenData;

  try {
    tokenData = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new apiError(401, "Invalid or expired refresh token");
  }

  let refreshTokenDoc = await redisGet(cacheKey);

  if (!refreshTokenDoc) {
    refreshTokenDoc = await RefreshToken.findOne({
      token,
      userId: tokenData?._id,
    });

    redisSet(cacheKey, refreshTokenDoc, 86400);

    if (!refreshTokenDoc) {
      throw new apiError(401, "refresh token not found");
    }
  }

  const user = {
    ...refreshTokenDoc.userSnapshot,
    _id: refreshTokenDoc.userId,
  };

  const at = await generateAccessToken(user);

  let rt = refreshTokenDoc.token;

  const now = Date.now();
  const createdAt = new Date(refreshTokenDoc.createdAt).getTime();
  const age = now - createdAt;

  const fortyFiveDays = 45 * 24 * 60 * 60 * 1000;

  if (age >= fortyFiveDays) {
    rt = await generateRefreshToken({
      _id: user._id,
      email: user.email,
    });

    const refreshTokenData = {
      userId: user._id,
      token: rt,
      userSnapshot: user,
    };

    RefreshToken.deleteOne({ token: refreshTokenDoc.token }).exec();

    const newRt = await RefreshToken.create(refreshTokenData);

    if (!newRt) {
      throw new apiError(
        500,
        "Failed to issue new refresh token. Re-login required"
      );
    }
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        user,
        rt,
        at,
        domain,
      },
      "token refresh success"
    )
  );
});

const logout = asyncFunc(async (req, res) => {
  const { domain } = req.body;

  validateFields({ domain });

  if (!isAllowedDomain(domain)) {
    throw new apiError(400, "Invalid login domain");
  }

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "No refresh token provided");
  }

  let tokenData;

  try {
    tokenData = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new apiError(401, "Invalid or expired refresh token");
  }

  await RefreshToken.findOneAndDelete({
    token,
    userId: tokenData?._id,
  });

  redisDel(`rt:${token}`);

  return res.status(200).json({});
});

export { emailAuth, emailVerify, googleAuth, refreshToken, logout };
