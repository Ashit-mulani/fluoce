import { createFiles } from "@/hooks/api/file-api";
import { uploadDB } from "./db/uploadDB";
import { toast } from "sonner";

class UploadingStateEmitter {
  constructor() {
    this._listeners = [];
    this._isUploading = false;
  }

  get isUploading() {
    return this._isUploading;
  }

  set isUploading(val) {
    if (this._isUploading !== val) {
      this._isUploading = val;
      this._listeners.forEach((fn) => fn(val));
    }
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => this.unsubscribe(fn);
  }

  unsubscribe(fn) {
    this._listeners = this._listeners.filter((listener) => listener !== fn);
  }
}

export const uploadingStateEmitter = new UploadingStateEmitter();

class UploadManager {
  isRunning = false;

  async start(userId) {
    if (this.isRunning) return;

    this.isRunning = true;

    uploadingStateEmitter.isUploading = true;

    while (true) {
      const nextFile = await uploadDB.uploads
        .where("[userId+status]")
        .equals([userId, "ready"])
        .first();

      if (!nextFile) break;

      await this.uploadFile(nextFile);
    }

    this.isRunning = false;

    uploadingStateEmitter.isUploading = false;
  }

  async uploadFile(file) {
    try {
      await uploadDB.uploads.update(file?.tempId, {
        status: "uploading",
      });

      const uploaded = await this.uploadToR2(file);

      if (!uploaded) {
        await uploadDB.uploads.update(file.tempId, {
          status: "failed",
          file: null,
        });

        return;
      }

      await uploadDB.uploads.update(file.tempId, {
        status: "saving",
      });

      const saved = await this.saveMetaData(file);

      if (!saved) {
        await uploadDB.uploads.update(file.tempId, {
          status: "failed",
          file: null,
        });
        return;
      }

      await uploadDB.uploads.update(file.tempId, {
        status: "success",
        file: null,
      });
    } catch (error) {
      toast.error(`upload failed for ${file?.fileName}`, {
        position: "top-center",
      });

      await uploadDB.uploads.update(file?.tempId, {
        status: "failed",
        file: null,
      });
    }
  }

  async uploadToR2(file) {
    try {
      const res = await fetch(file.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.mimeType || "application/octet-stream",
        },
        body: file.file,
      });

      return res.ok;
    } catch (error) {
      toast.error(`upload failed for ${file?.fileName}`, {
        position: "top-center",
      });

      return false;
    }
  }

  async saveMetaData(file) {
    try {
      const res = await createFiles(file.folderId, {
        files: [
          {
            objectKey: file.objectKey,
            fileName: file.fileName,
            safeName: file.safeName,
          },
        ],
      });
      return !!res?.Success;
    } catch (error) {
      toast.error(`upload failed for ${file?.fileName}`, {
        position: "top-center",
      });

      return false;
    }
  }
}

export const uploadManager = new UploadManager();
