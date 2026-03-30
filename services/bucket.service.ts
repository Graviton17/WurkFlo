import { supabase } from "./supabase";
import { createServerComponentClient } from "./server.service";
import type { StorageResponse, UploadOptions } from "@/types/index";

/**
 * Storage Service
 * Handles file storage operations.
 * Uses getClient() to resolve correct Supabase client for server vs browser context.
 */
export class StorageService {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  /**
   * Resolve the correct Supabase client based on execution context.
   */
  private async getClient() {
    if (typeof window === "undefined") {
      return await createServerComponentClient();
    }
    return supabase;
  }

  /**
   * Upload a file
   * @param path - File path in bucket
   * @param file - File to upload
   * @param options - Upload options
   * @returns Promise with upload data or error
   */
  async upload(
    path: string,
    file: File | Blob,
    options?: UploadOptions,
  ): Promise<StorageResponse<{ path: string }>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .upload(path, file, options);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Download a file
   * @param path - File path in bucket
   * @returns Promise with file blob or error
   */
  async download(path: string): Promise<StorageResponse<Blob>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .download(path);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Get public URL for a file
   * @param path - File path in bucket
   * @returns Public URL
   */
  async getPublicUrl(path: string): Promise<string> {
    const client = await this.getClient();
    const {
      data: { publicUrl },
    } = client.storage.from(this.bucketName).getPublicUrl(path);

    return publicUrl;
  }

  /**
   * Create a signed URL for private files
   * @param path - File path in bucket
   * @param expiresIn - Expiration time in seconds
   * @returns Promise with signed URL or error
   */
  async createSignedUrl(
    path: string,
    expiresIn: number = 3600,
  ): Promise<StorageResponse<{ signedUrl: string }>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .createSignedUrl(path, expiresIn);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * List files in a directory
   * @param path - Directory path
   * @param options - List options
   * @returns Promise with file list or error
   */
  async list(
    path?: string,
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: { column: string; order: "asc" | "desc" };
    },
  ): Promise<StorageResponse<any[]>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .list(path, options);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Delete a file
   * @param paths - File path(s) to delete
   * @returns Promise with success status
   */
  async delete(paths: string | string[]): Promise<StorageResponse<null>> {
    try {
      const pathArray = Array.isArray(paths) ? paths : [paths];
      const client = await this.getClient();
      const { error } = await client.storage
        .from(this.bucketName)
        .remove(pathArray);

      return {
        data: null,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Move a file
   * @param fromPath - Source path
   * @param toPath - Destination path
   * @returns Promise with success status
   */
  async move(
    fromPath: string,
    toPath: string,
  ): Promise<StorageResponse<{ message: string }>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .move(fromPath, toPath);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Copy a file
   * @param fromPath - Source path
   * @param toPath - Destination path
   * @returns Promise with success status
   */
  async copy(
    fromPath: string,
    toPath: string,
  ): Promise<StorageResponse<{ path: string }>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.storage
        .from(this.bucketName)
        .copy(fromPath, toPath);

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }
}
