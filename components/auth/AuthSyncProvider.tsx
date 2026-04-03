"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import axios from "axios";
import { useRouter } from "next/navigation";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const syncAttempted = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Capture if we landed with an OAuth code before Supabase potentially cleans the URL
    const hasCode = typeof window !== "undefined" && window.location.search.includes("code=");

    const { data: listener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      // Run sync only once per session on SIGNED_IN event (which fires after PKCE exchange)
      if (event === "SIGNED_IN" && session?.user && !syncAttempted.current) {
        syncAttempted.current = true;
        try {
          await axios.post("/api/sync");
          
          if (hasCode) {
            router.push("/onboarding");
          }
        } catch (err) {
          console.error("Global auth sync failed:", err);
        }
      }
      
      // Reset flag if signed out
      if (event === "SIGNED_OUT") {
        syncAttempted.current = false;
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
