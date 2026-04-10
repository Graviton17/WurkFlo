import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { workspaceService } from '@/services/index';
import { logger } from "@/lib/logger";

export default async function DashboardRedirectPage() {
  const user = await auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let hasWorkspace = false;

  try {
    const { data: workspacesResponse } = await workspaceService.getAllWorkspacesByUserId(user.id);
    if (workspacesResponse && workspacesResponse.length > 0) {
      hasWorkspace = true;
    }
  } catch (err) {
    logger.error({ err }, "Error checking workspace for dashboard redirect:");
  }

  if (hasWorkspace) {
    // Redirect to the workspace list
    redirect('/dashboard/workspace');
  } else {
    // If no workspace found, send them to onboarding
    redirect('/onboarding');
  }
}

