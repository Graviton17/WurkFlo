import { supabase as browserClient } from "../services/supabase";
import { createServerComponentClient } from "../services/server.service";
import type { DatabaseResponse } from "@/types/index";
import type { SupabaseClient } from "@supabase/supabase-js";

export class BaseCURD<T = any> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async getClient() {
    if (typeof window === "undefined") {
      return await createServerComponentClient();
    }
    return browserClient;
  }

  /**
   * Get all records from the table
   * @param options - Query options (select, filters, etc.)
   * @returns Promise with data or error
   */
  async getAll(options?: {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  }): Promise<DatabaseResponse<T[]>> {
    try {
      const db = await this.getClient();
      let query = db.from(this.tableName)
        .select(options?.select || "*")
        .is("deleted_at", null); // Enforce Soft Delete tracking

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      return {
        data: data as T[] | null,
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
   * Get a single record by ID
   * @param id - Record ID
   * @param select - Fields to select
   * @returns Promise with data or error
   */
  async getById(
    id: string | number,
    select?: string,
  ): Promise<DatabaseResponse<T>> {
    try {
      const db = await this.getClient();
      const { data, error } = await db
        .from(this.tableName)
        .select(select || "*")
        .eq("id", id)
        .is("deleted_at", null) // Prevent reading soft-deleted entities
        .maybeSingle();

      return {
        data: data as T | null,
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
   * Create a new record
   * @param data - Record data
   * @returns Promise with created data or error
   */
  async create(data: Partial<T>): Promise<DatabaseResponse<T>> {
    try {
      const db = await this.getClient();
      const { data: createdData, error } = await (
        db.from(this.tableName) as any
      )
        .insert(data)
        .select()
        .maybeSingle();

      return {
        data: createdData as T | null,
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
   * Create multiple records
   * @param data - Array of record data
   * @returns Promise with created data or error
   */
  async createMany(data: Partial<T>[]): Promise<DatabaseResponse<T[]>> {
    try {
      const db = await this.getClient();
      const { data: createdData, error } = await (
        db.from(this.tableName) as any
      )
        .insert(data)
        .select();

      return {
        data: createdData as T[] | null,
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
   * Upsert a record (Insert or Update)
   * @param data - Record data
   * @returns Promise with upserted data or error
   */
  async upsert(data: Partial<T>): Promise<DatabaseResponse<T>> { 
    try { 
      const db = await this.getClient(); 
      const { data: upsertedData, error } = await ( 
        db.from(this.tableName) as any 
      ) 
        .upsert(data) 
        .select() 
        .maybeSingle(); 
 
      return { 
        data: upsertedData as T | null, 
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
   * Update a record by ID
   * @param id - Record ID
   * @param data - Updated data
   * @returns Promise with updated data or error
   */
  async update(
    id: string | number,
    data: Partial<T>,
  ): Promise<DatabaseResponse<T>> {
    try {
      const db = await this.getClient();
      const { data: updatedData, error } = await (
        db.from(this.tableName) as any
      )
        .update(data)
        .eq("id", id)
        .select()
        .maybeSingle();

      return {
        data: updatedData as T | null,
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
   * Delete a record by ID
   * @param id - Record ID
   * @returns Promise with success status
   */
  async delete(id: string | number): Promise<DatabaseResponse<null>> {
    try {
      const db = await this.getClient();
      const { error } = await db
        .from(this.tableName)
        .update({ deleted_at: new Date().toISOString() }) // Soft Delete
        .eq("id", id);

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
   * Count records in the table
   * @param filters - Optional filters
   * @returns Promise with count or error
   */
  async count(
    filters?: Record<string, any>,
  ): Promise<DatabaseResponse<number>> {
    try {
      const db = await this.getClient();
      let query = db
        .from(this.tableName)
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { count, error } = await query;

      return {
        data: count,
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
   * Execute a custom query
   * @param queryBuilder - Function that builds the query
   * @returns Promise with data or error
   */
  async customQuery<R = any>(
    queryBuilder: (table: ReturnType<SupabaseClient['from']>) => any,
  ): Promise<DatabaseResponse<R>> {
    try {
      const db = await this.getClient();
      const table = db.from(this.tableName);
      const { data, error } = await queryBuilder(table);

      return {
        data: data as R | null,
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
