import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private r2: S3Client;
  private bucket: string;
  private endpoint: string;
  private publicUrl: string;

  constructor() {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET_NAME;
    const accountId = process.env.R2_ACCOUNT_ID;
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

    this.r2 = new S3Client({
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

    await this.r2.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `${this.publicUrl}/${key}`;
  }
}
