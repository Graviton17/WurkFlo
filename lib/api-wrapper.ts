import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/services/auth.helper";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import { logger } from "./logger";

export type ApiContext<T = any> = {
  req: NextRequest;
  params: Record<string, string>;
  user?: User | null;
  validatedData?: T;
  pagination?: { limit: number; offset: number; page: number };
};

export type ApiHandler<T = any> = (
  ctx: ApiContext<T>
) => Promise<NextResponse | void> | NextResponse | void;

export type ApiSetupConfig<T extends z.ZodTypeAny> = {
  requireAuth?: boolean;
  schema?: T;
  rateLimit?: { limit: number; windowMs: number };
  handler: ApiHandler<z.infer<T>>;
};

// Extremely basic in-memory store for rate limiting (For better scalability, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Standardized API Wrapper to enforce industry standards across all endpoints.
 * - Handles `try/catch` internally.
 * - Validates authentication securely.
 * - Parses and validates JSON payload using Zod.
 * - Returns uniform `{ success, data, error }` structures.
 */
export function withApiSetup<T extends z.ZodTypeAny = any>(
  config: ApiSetupConfig<T>
) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<Record<string, string>> | Record<string, string> } = { params: {} }
  ) => {
    try {
      const resolvedParams = await params;
      const ctx: ApiContext<z.infer<T>> = { req, params: resolvedParams || {} };

      // 0. Extract highly-scalable Standard Output Pagination
      if (req.method === "GET") {
        const rawLimit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);
        const rawPage = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = isNaN(rawLimit) ? 50 : Math.min(rawLimit, 100); // Cap absolutely at 100
        const page = isNaN(rawPage) ? 1 : Math.max(rawPage, 1);
        ctx.pagination = { limit, page, offset: (page - 1) * limit };
      }

      // 0.5 Rate Limiting Check
      if (config.rateLimit) {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const now = Date.now();
        const record = rateLimitStore.get(ip);
        
        if (record && now < record.resetTime) {
          if (record.count >= config.rateLimit.limit) {
            return NextResponse.json(
              { success: false, error: "Too many requests, please try again later." },
              { status: 429 }
            );
          }
          record.count++;
        } else {
          rateLimitStore.set(ip, { count: 1, resetTime: now + config.rateLimit.windowMs });
        }
      }

      // 1. Authentication Check
      if (config.requireAuth) {
        ctx.user = await getAuthenticatedUser();
        if (!ctx.user) {
          return NextResponse.json(
            { success: false, error: "Unauthorized access" },
            { status: 401 }
          );
        }
      }

      // 2. Input Validation (only for POST/PUT)
      if (config.schema && ["POST", "PUT", "PATCH"].includes(req.method)) {
        let body;
        try {
          body = await req.json();
        } catch (err) {
          return NextResponse.json(
            { success: false, error: "Invalid JSON payload" },
            { status: 400 }
          );
        }

        const validation = config.schema.safeParse(body);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "Validation Error",
              details: validation.error.issues,
            },
            { status: 400 }
          );
        }
        ctx.validatedData = validation.data;
      }

      // 3. Execute Handler
      const result = await config.handler(ctx);

      // 4. Default Success Response (if handler didn't return one)
      if (result instanceof NextResponse) return result;
      
      return NextResponse.json({ success: true }, { status: 200 });
      
    } catch (error: any) {
      logger.error({
        msg: `API Error`,
        method: req.method,
        path: req.nextUrl.pathname,
        err: error?.message || error
      });
      return NextResponse.json(
        {
          success: false,
          error: "Internal Server Error",
          message: error?.message || "An unexpected error occurred",
        },
        { status: 500 }
      );
    }
  };
}
