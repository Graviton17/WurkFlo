import { cache } from "react";

/**
 * Standard utility wrapping database query functions with React's `cache`.
 * This ensures that if multiple components (e.g. Layout, Page, and Sidebar)
 * all request the same exact data during a single Server Request lifecycle,
 * the actual database query only physically executes exactly once.
 * 
 * Usage:
 * export const getUserProfile = cache(async (userId: string) => {
 *   return await db.from('users').select('*').eq('id', userId).single();
 * });
 */
export const withRequestCache = <T extends (...args: any[]) => Promise<any>>(
  dbQueryFn: T
): T => {
  return cache(dbQueryFn) as T;
};
