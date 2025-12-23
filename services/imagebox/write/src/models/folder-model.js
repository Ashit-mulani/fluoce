import mongoose from "mongoose";

const folderScheam = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    metaData: {
      size: {
        type: Number,
        default: 0,
      },
      formatedSize: {
        type: String,
        trim: true,
        default: null,
      },
      totalFiles: {
        type: Number,
        default: 0,
      },
    },
    isTrash: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Folder = mongoose.models.Folder || mongoose.model("Folder", folderScheam);

export default Folder;
