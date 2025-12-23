import Storage from "../models/storage-model.js";
import { asyncFunc } from "../utils/asyncFunc.js";
import { apiRes } from "../utils/apiRes.js";
import { apiError } from "../utils/apiError.js";
import {
  razorpay,
  WEBHOOK_SECRET,
  PLAN_DETAILS,
} from "../configs/razorpay-config.js";
import logger from "../utils/logger.js";
import crypto from "crypto";
import { redisDel, redisGet } from "../utils/safeRedis.js";

const payOrder = asyncFunc(async (req, res) => {
  const { userId, plan_name } = req.body;

  if (!plan_name || !PLAN_DETAILS[plan_name]) {
    throw new apiError(400, "Invalid Plan");
  }

  let cache = await redisGet(`storage:${userId}`);

  let storage;

  if (cache) {
    storage = cache?.storage;
  } else {
    storage = await Storage.findOne({ userId }).lean();
  }

  if (!storage) {
    throw new apiError(404, "First try for free, then upgrade.");
  }

  const livePlan = storage?.plan?.name;

  if (
    PLAN_DETAILS[livePlan] &&
    PLAN_DETAILS[plan_name] &&
    PLAN_DETAILS[livePlan].order >= PLAN_DETAILS[plan_name].order
  ) {
    throw new apiError(400, `You already have the ${livePlan} plan.`);
  }

  const order = await razorpay.orders.create({
    amount: PLAN_DETAILS[plan_name].price * 100,
    currency: "INR",
    receipt: `order_${Date.now()}`,
    notes: {
      userId,
      planName: plan_name,
    },
  });

  if (!order) {
    throw new apiError(500, "Failed to create payment order, try later");
  }

  const orderData = {
    key: process.env.RAZORPAY_ID,
    orderId: order?.id,
    amount: order?.amount,
    currency: order?.currency,
    planName: plan_name,
    userId,
  };

  return res.status(200).json(new apiRes(200, { orderData }, "order created"));
});

const payWebHook = asyncFunc(async (req, res) => {
  try {
    const rawBody = req.body;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(200).send("OK");
    }

    const expectedSignature = crypto
      .createHmac("sha256", (WEBHOOK_SECRET || "").trim())
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(200).send("OK");
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const payment = event.payload.payment.entity;

    const userId = payment.notes.userId;
    const planName = payment.notes.planName;

    const planDetails = PLAN_DETAILS[planName];
    if (!planDetails) {
      logger.error(
        { webhook: "razorpay", planName, userId },
        "Invalid plan in webhook"
      );
      return res.status(200).send("OK");
    }

    const orderId = payment.order_id;
    const paymentId = payment.id;
    const currency = payment.currency;
    const amount = payment.amount / 100;

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    try {
      await Storage.findOneAndUpdate(
        { userId },
        {
          $set: {
            "plan.name": planName,
            "plan.updatedAt": new Date(),
            "plan.expiresAt": expiresAt,
            "plan.paymentBroker.provider": "RAZORPAY",
            "plan.paymentBroker.lastOrderId": orderId,
            "plan.paymentBroker.lastPaymentId": paymentId,
            "plan.paymentBroker.lastSignature": signature,
            "plan.paymentBroker.lastPaidAmount": amount,
            "plan.paymentBroker.currency": currency,
            "metaData.storageLimit": planDetails.storage,
            "metaData.formatStorageLimit":
              planDetails.storage / (1024 * 1024 * 1024) + " GB",
          },
        },
        { new: true }
      );
    } catch (error) {
      logger.error(
        { error, webhook: "razorpay", userId },
        "failed to update plan data."
      );
    }

    redisDel(`storage:${userId}`);

    return res.status(200).send("OK");
  } catch (error) {
    logger.error(
      { error, webhook: "razorpay" },
      "webhook failed of the razorpay"
    );
    return res.status(200).send("OK");
  }
});

export { payOrder, payWebHook };
