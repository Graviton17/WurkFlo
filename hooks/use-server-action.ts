"use client";

import { useState, useTransition, useCallback } from "react";
import type { ActionResult } from "@/types/index";

export type StatusMessage = {
  text: string;
  type: "" | "success" | "error" | "info";
};

/**
 * Generic hook that wraps any server action with pending state + status messages.
 *
 * Usage:
 *   const { execute, isPending, status, clearStatus } = useServerAction(myAction);
 *   await execute(arg1, arg2);
 */
export function useServerAction<TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<ActionResult<TData>>,
  options?: {
    onSuccess?: (data: TData | null) => void;
    onError?: (error: string) => void;
    successMessage?: string;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<StatusMessage>({ text: "", type: "" });

  const clearStatus = useCallback(() => setStatus({ text: "", type: "" }), []);

  const execute = useCallback(
    (...args: TArgs) => {
      clearStatus();
      startTransition(async () => {
        const result = await action(...args);
        if (result.success) {
          setStatus({
            text: options?.successMessage || "Success!",
            type: "success",
          });
          options?.onSuccess?.(result.data);
        } else {
          const errorMsg = result.error || "Something went wrong";
          setStatus({ text: errorMsg, type: "error" });
          options?.onError?.(errorMsg);
        }
      });
    },
    [action, options, clearStatus],
  );

  return { execute, isPending, status, setStatus, clearStatus };
}
