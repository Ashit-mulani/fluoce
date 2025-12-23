import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isTrash: {
      type: Boolean,
      default: false,
      index: true,
    },
    metaData: {
      size: {
        type: Number,
        required: true,
        default: 0,
      },
      formatedSize: {
        type: String,
        trim: true,
        default: null,
      },
      mimeType: {
        type: String,
        required: true,
      },
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    objectKey: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;
