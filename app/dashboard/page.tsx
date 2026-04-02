import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { onboardingService, workspaceService } from '@/services/index';
import { logger } from "@/lib/logger";

export default async function DashboardRedirectPage() {
  const user = await auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let targetSlug = null;

  try {
    // Get user's workspace mapping
    const { data: memberData } = await onboardingService.getMemberWorkspace(user.id);

    if (memberData?.workspace_id) {
      const { data: workspace } = await workspaceService.getWorkspaceById(memberData.workspace_id);

      if (workspace?.slug) {
        targetSlug = workspace.slug;
      }
    }
  } catch (err) {
    logger.error({ err }, "Error checking workspace for dashboard redirect:");
  }

  if (targetSlug) {
    // Redirect to the workspace home
    redirect(`/${targetSlug}/get-started`);
  } else {
    // If no workspace found, send them to onboarding
    redirect('/onboarding');
  }
}
