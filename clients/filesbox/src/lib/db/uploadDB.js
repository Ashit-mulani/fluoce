// src/lib/uploadDB.js
import Dexie from "dexie";

export const uploadDB = new Dexie("UploadStoreDB");

uploadDB.version(3).stores({
  uploads: `
      &tempId,
      createdAt,
      expiresAt,
      [userId+status]
    `,
});
