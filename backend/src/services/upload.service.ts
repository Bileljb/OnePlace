import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../utils/AppError.js";
import {
  S3_REGION,
  S3_BUCKET,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_CDN_URL,
} from "../config/env.js";
import crypto from "crypto";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  // Images
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  // Videos
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  // Documents
  "application/pdf": "pdf",
  // Generic files
  "application/zip": "zip",
  "application/octet-stream": "bin",
};

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024,    // 10 MB
  video: 2 * 1024 * 1024 * 1024, // 2 GB
  application: 100 * 1024 * 1024, // 100 MB
};

const PRESIGN_EXPIRES_IN = 900; // 15 minutes

function getS3Client() {
  if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET || !S3_REGION) {
    throw new AppError("File storage is not configured", 503);
  }
  return new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT } : {}),
  });
}

export type UploadFolder = "courses" | "lessons" | "attachments" | "posts" | "communities";

export async function createPresignedUpload(input: {
  filename: string;
  contentType: string;
  folder: UploadFolder;
}) {
  const { filename, contentType, folder } = input;

  const ext = ALLOWED_MIME_TYPES[contentType];
  if (!ext) {
    throw new AppError(`File type "${contentType}" is not allowed`, 400);
  }

  // Validate max size based on mime type category
  const category = contentType.split("/")[0] ?? "application";
  const maxSize = MAX_SIZES[category] ?? MAX_SIZES["application"];

  const uniqueKey = `${folder}/${crypto.randomUUID()}.${ext}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET!,
    Key: uniqueKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: PRESIGN_EXPIRES_IN });

  // Build the final public URL — use CDN if configured, otherwise direct S3
  const baseUrl = S3_CDN_URL
    ? S3_CDN_URL.replace(/\/$/, "")
    : `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

  const fileUrl = `${baseUrl}/${uniqueKey}`;

  return { uploadUrl, fileUrl, maxSize, expiresIn: PRESIGN_EXPIRES_IN };
}
