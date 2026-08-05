import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageProvider, StoredArtifact } from "./StorageProvider";
import crypto from "crypto";

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME || 'mosaic-storage';
    
    // For MinIO compatibility locally, configure endpoint and force path style
    const endpoint = process.env.S3_ENDPOINT;
    
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin',
      },
      endpoint: endpoint || undefined,
      forcePathStyle: !!endpoint, // Required for MinIO
    });
  }

  async uploadArtifact(payload: Buffer | string, prefix: string): Promise<StoredArtifact> {
    const buffer = typeof payload === 'string' ? Buffer.from(payload) : payload;
    
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const key = `${prefix}/${hash}`;
    
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: typeof payload === 'string' ? 'application/json' : 'application/octet-stream',
    }));
    
    return {
      uri: `s3://${this.bucket}/${key}`,
      metadata: {
        checksum: hash,
        version: 1,
        sizeBytes: buffer.length,
        mimeType: typeof payload === 'string' ? 'application/json' : 'application/octet-stream'
      }
    };
  }
  
  async downloadArtifact(uri: string): Promise<Buffer> {
    const key = uri.replace(`s3://${this.bucket}/`, '');
    
    const response = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
    
    if (!response.Body) {
      throw new Error(`Failed to download artifact from ${uri}`);
    }
    
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  }
  
  async getSignedUrl(uri: string, expiresInSeconds: number): Promise<string> {
    const key = uri.replace(`s3://${this.bucket}/`, '');
    
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    
    return await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}
