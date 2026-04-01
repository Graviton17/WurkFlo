import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/services/auth.helper";
import { onboardingService } from "@/services/index";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const { data: memberData } = await onboardingService.getMemberWorkspace(user.id);
  
  if (memberData?.workspace_id) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
