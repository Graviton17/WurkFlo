"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOnboardingStatus } from '@/app/actions/user.actions';
import { logger } from "@/lib/logger";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkStatus = async () => {
      try {
        const result = await getOnboardingStatus();
        if (!isMounted) return;
        
        if (result.success && result.data?.hasWorkspace) {
          router.replace('/dashboard/workspace');
        } else {
          router.replace('/onboarding');
        }
      } catch (err: any) {
        if (!isMounted) return;
        
        logger.error({ err }, "Error checking workspace for dashboard redirect:");
        router.replace('/login');
      } finally {
        if (isMounted) setChecking(false);
      }
    };
    
    checkStatus();
    
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen bg-[#0d0d0f]">
        <div className="w-8 h-8 rounded-full border-[2px] border-white/5 border-t-[#5E6AD2] animate-spin" />
      </div>
    );
  }

  return null;
}


