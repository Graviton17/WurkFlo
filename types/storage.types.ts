/**
 * Storage response type
 */
export interface StorageResponse<T = any> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

/**
 * Upload options
 */
export interface UploadOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}
