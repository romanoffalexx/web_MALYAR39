import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    });
  }
  return s3Client;
}

const BUCKET = process.env.S3_BUCKET || "malyar-media";
const PUBLIC_URL = process.env.S3_PUBLIC_URL || "";

export async function uploadToS3(
  file: File | Buffer,
  key: string,
  contentType?: string
): Promise<string> {
  const client = getS3Client();
  const body = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType || "application/octet-stream",
    })
  );

  return PUBLIC_URL ? `${PUBLIC_URL}/${key}` : key;
}

export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

export async function getPresignedUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(client, command, { expiresIn });
}

export function generateUploadKey(
  folder: string,
  filename: string
): string {
  const ext = filename.split(".").pop() || "jpg";
  const name = filename.replace(/\.[^/.]+$/, "");
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё-]/gi, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
  const timestamp = Date.now();
  return `${folder}/${safeName}-${timestamp}.${ext}`;
}
