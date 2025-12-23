import mongoose from "mongoose";

const storageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      index: true,
      required: true,
    },
    metaData: {
      usedStorage: {
        type: Number,
        default: 0,
      },
      formatUsedStorage: {
        type: String,
        trim: true,
        default: null,
      },
      storageLimit: {
        type: Number,
        default: 2 * 1024 * 1024 * 1024,
      },
      formatStorageLimit: {
        type: String,
        trim: true,
        default: null,
      },
      totalFiles: {
        type: Number,
        default: 0,
      },
      totalFolders: {
        type: Number,
        default: 0,
      },
      trashSize: {
        type: Number,
        default: 0,
      },
      formatTrashSize: {
        type: String,
        trim: true,
        default: null,
      },
    },
    plan: {
      name: {
        type: String,
        enum: ["FREE", "STANDARD", "PRO"],
        default: "FREE",
      },
      paymentBroker: {
        provider: {
          type: String,
          enum: ["RAZORPAY", "STRIPE", "PAYPAL", "NONE"],
          default: "NONE",
        },
        lastOrderId: {
          type: String,
          default: null,
        },
        lastPaymentId: {
          type: String,
          default: null,
        },
        lastSignature: {
          type: String,
          default: null,
        },
        lastPaidAmount: {
          type: Number,
          default: 0,
        },
        currency: {
          type: String,
          default: "INR",
        },
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

const Storage =
  mongoose.models.Storage || mongoose.model("Storage", storageSchema);

export default Storage;
