import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOnboardingStatus } from "@/app/actions/user.actions";

export const dynamic = "force-dynamic";

export default async function DashboardRedirectPage() {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getOnboardingStatus();
  const hasWorkspace = result.data?.hasWorkspace ?? false;

  if (hasWorkspace) {
    redirect("/dashboard/workspace");
  } else {
    redirect("/onboarding");
  }
}
