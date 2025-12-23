import { r2 } from "../../configs/r2.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2Handler } from "../../utils/r2Handler.js";

export const getR2FileInfo = async (Key) => {
  const Bucket = process.env.R2_BUCKET_NAME;

  const command = new HeadObjectCommand({
    Bucket,
    Key,
  });

  const result = await r2Handler(async () => {
    return await r2.send(command);
  });

  if (!result.success) {
    return null;
  }

  const meta = result.data;

  return {
    size: meta.ContentLength ?? 0,
    contentType: meta.ContentType ?? "application/octet-stream",
  };
};
