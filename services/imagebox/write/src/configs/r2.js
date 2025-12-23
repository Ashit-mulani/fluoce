import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_ID,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

const r2Public = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL,
  credentials: {
    accessKeyId: process.env.R2_PUBLIC_ACCESS_ID,
    secretAccessKey: process.env.R2_PUBLIC_SECRET_KEY,
  },
});

// Export both clients as named exports
export { r2, r2Public };
