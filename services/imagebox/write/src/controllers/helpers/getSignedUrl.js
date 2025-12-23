import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "../../configs/r2.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { r2Handler } from "../../utils/r2Handler.js";

dotenv.config();

const generateSafeFileName = (originalName) => {
  const ext = originalName.split(".").pop();
  const base =
    originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
  const unique = uuidv4();

  return `${base}@${unique}.${ext}`;
};

export const getSignedUrl = async (userId, fileName, contentType) => {
  const safeName = generateSafeFileName(fileName);

  const objectKey = `${userId}/${safeName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    ContentType: contentType,
  });

  const result = await r2Handler(async () => {
    const signedUrl = await awsGetSignedUrl(r2, command, {
      expiresIn: 600,
    });

    return {
      signedUrl,
      objectKey,
      fileName,
      safeName,
    };
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, ...result.data };
};

export const getMultipleSignedUrls = async (userId, files) => {
  const results = [];

  for (const file of files) {
    const data = await getSignedUrl(
      userId,
      file.fileName || "default",
      file.contentType
    );

    results.push({
      tempId: file.tempId,
      size: file.size,
      formatedSize: file.formatedSize,
      mimeType: file.contentType,
      ...data,
    });
  }

  return results;
};

export const getObjectChunks = async (Key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key,
  });

  const result = await r2Handler(async () => {
    const response = await r2.send(command);

    const chunks = [];

    for await (const chunk of response.Body) chunks.push(chunk);

    return Buffer.concat(chunks);
  });

  if (!result.success) {
    return null;
  }

  return result.data;
};
