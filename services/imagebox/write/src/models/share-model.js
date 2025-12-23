import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    ownerInfo: {
      name: String,
      email: String,
      profilePhoto: String,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    fileName: {
      type: String,
      default: "Shared File",
    },
    mimeType: {
      type: String,
    },
    objectKey: {
      type: String,
      required: true,
    },
    isForAll: {
      type: Boolean,
      default: false,
      index: true,
    },
    sharedWith: [
      {
        email: {
          type: String,
          index: true,
        },
        _id: false,
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

shareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Share = mongoose.models.Share || mongoose.model("Share", shareSchema);

export default Share;
