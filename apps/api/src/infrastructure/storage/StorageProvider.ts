export interface StorageArtifactMetadata {
  checksum: string;
  version: number;
  sizeBytes: number;
  mimeType: string;
}

export interface StoredArtifact {
  uri: string;
  metadata: StorageArtifactMetadata;
}

export interface StorageProvider {
  /**
   * Persists an oversized artifact payload to object storage (e.g. S3).
   * Returns a lightweight reference (URI + Metadata) to be stored in PostgreSQL.
   */
  uploadArtifact(payload: Buffer | string, prefix: string): Promise<StoredArtifact>;
  
  /**
   * Retrieves the raw artifact payload from object storage.
   */
  downloadArtifact(uri: string): Promise<Buffer>;
  
  /**
   * Generates a pre-signed URL for direct frontend retrieval if needed.
   */
  getSignedUrl(uri: string, expiresInSeconds: number): Promise<string>;
}
