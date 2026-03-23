import { supabase } from "../services/supabase";
import type { DatabaseResponse } from "@/types/index";

export class BaseCURD<T = any> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
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
      let query = supabase.from(this.tableName).select(options?.select || "*");

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
      const { data, error } = await supabase
        .from(this.tableName)
        .select(select || "*")
        .eq("id", id)
        .single();

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
      const { data: createdData, error } = await (
        supabase.from(this.tableName) as any
      )
        .insert(data)
        .select()
        .single();

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
      const { data: createdData, error } = await (
        supabase.from(this.tableName) as any
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
      const { data: updatedData, error } = await (
        supabase.from(this.tableName) as any
      )
        .update(data)
        .eq("id", id)
        .select()
        .single();

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
      const { error } = await supabase
        .from(this.tableName)
        .delete()
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
      let query = supabase
        .from(this.tableName)
        .select("*", { count: "exact", head: true });

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
    queryBuilder: (table: ReturnType<typeof supabase.from>) => any,
  ): Promise<DatabaseResponse<R>> {
    try {
      const table = supabase.from(this.tableName);
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
