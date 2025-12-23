import { r2Public } from "../../configs/r2.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { r2Handler } from "../../utils/r2Handler.js";

dotenv.config();

export const putObject = async (Key, Body) => {
  const bucket = process.env.R2_PUBLIC_BUCKET_NAME;
  const viewUrl = process.env.R2_PUBLIC_VIEW_URL;

  const result = await r2Handler(async () => {
    await r2Public.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key,
        Body,
        ContentType: "image/png",
      })
    );

    return `${viewUrl}/${Key}`;
  });

  return result.success ? result.data : null;
};
