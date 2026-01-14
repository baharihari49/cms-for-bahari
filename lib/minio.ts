// lib/minio.ts
import { S3Client } from '@aws-sdk/client-s3';

const globalForMinio = globalThis as unknown as {
  minio: S3Client | undefined;
};

const getEndpoint = () => {
  let endpoint = process.env.MINIO_ENDPOINT || 'localhost';

  // Remove protocol if already included in MINIO_ENDPOINT
  endpoint = endpoint.replace(/^https?:\/\//, '');

  const useSSL = process.env.MINIO_USE_SSL === 'true';
  const protocol = useSSL ? 'https' : 'http';
  const port = process.env.MINIO_PORT;

  // If port is provided and not standard (80/443), include it
  if (port && port !== '443' && port !== '80') {
    return `${protocol}://${endpoint}:${port}`;
  }

  return `${protocol}://${endpoint}`;
};

export const minioClient =
  globalForMinio.minio ??
  new S3Client({
    endpoint: getEndpoint(),
    region: 'us-east-1', // MinIO ignores this but SDK requires it
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY || '',
      secretAccessKey: process.env.MINIO_SECRET_KEY || '',
    },
    forcePathStyle: true, // Required for MinIO
  });

if (process.env.NODE_ENV !== 'production') {
  globalForMinio.minio = minioClient;
}

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'cms-uploads';

export function getPublicUrl(key: string): string {
  const baseUrl = process.env.MINIO_PUBLIC_URL || getEndpoint();
  return `${baseUrl}/${BUCKET_NAME}/${key}`;
}
