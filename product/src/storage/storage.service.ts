import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;
  private endpoint: string;
  private publicUrl: string;

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucket = process.env.S3_BUCKET_NAME;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (
      !accessKeyId ||
      !secretAccessKey ||
      !bucket ||
      !accountId ||
      !publicUrl
    ) {
      throw new Error('Missing Cloudflare R2 environment variables');
    }

    this.bucket = bucket;
    this.publicUrl = publicUrl;
    this.endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder = ''): Promise<string> {
    const key = `${folder}${randomUUID()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // ✅ Return the public URL (NOT the S3 endpoint)
    return `${this.publicUrl}/${key}`;
  }
}
