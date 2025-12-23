import Storage from "../../models/storage-model.js";

export const getOrCreateStorage = async (userId) => {
  let storage = await Storage.findOne({ userId });

  if (!storage) {
    storage = await Storage.create({
      userId,
    });
  }

  return storage;
};

export const decreaseStorage = async (userId, bytes, fileCount = 1) => {
  return await Storage.findOneAndUpdate(
    { userId },
    {
      $inc: {
        usedStorage: -bytes,
        totalFiles: -fileCount,
      },
    },
    { new: true }
  );
};

export const checkStorageLimit = (storage) => {
  return storage.metaData.usedStorage < storage.metaData.storageLimit;
};
