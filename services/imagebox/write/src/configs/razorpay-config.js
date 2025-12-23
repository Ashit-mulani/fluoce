import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const PLAN_DETAILS = {
  FREE: {
    price: 0,
    storage: 2 * 1024 * 1024 * 1024, // 2GB
    order: 0,
  },
  STANDARD: {
    price: 149,
    storage: 20 * 1024 * 1024 * 1024, // 20GB
    order: 1,
  },
  PRO: {
    price: 199,
    storage: 100 * 1024 * 1024 * 1024, // 100GB
    order: 2,
  },
};

export const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
