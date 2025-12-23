import { r2 } from "../../configs/r2.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Handler } from "../../utils/r2Handler.js";

export const getPreviewUrl = async (Key) => {
  if (!Key) return null;

  const Bucket = process.env.R2_BUCKET_NAME;

  const command = new GetObjectCommand({
    Bucket,
    Key,
  });

  const result = await r2Handler(async () => {
    return await getSignedUrl(r2, command, { expiresIn: 30 * 60 });
  });

  return result.success ? result.data : null;
};
