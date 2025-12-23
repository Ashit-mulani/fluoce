import { r2, r2Public } from "../../configs/r2.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { r2Handler } from "../../utils/r2Handler.js";

dotenv.config();

export const deleteObjectFromR2 = async (Key) => {
  const Bucket = process.env.R2_BUCKET_NAME;
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });
  const result = await r2Handler(async () => await r2.send(command));

  return result.success ? result : null;
};

export const deleteObjectFromR2Public = async (Key) => {
  const Bucket = process.env.R2_PUBLIC_BUCKET_NAME;
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });

  const result = await r2Handler(async () => {
    return await r2Public.send(command);
  });

  return result.success ? result : null;
};
