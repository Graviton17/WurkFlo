"use server";

import { requireUser } from "./utils";
import { userService, onboardingService } from "@/services/index";
import { logger } from "@/lib/logger";
import type { ActionResult } from "@/types/index";

export async function getOnboardingStatus(): Promise<ActionResult<{ hasWorkspace: boolean; fullName: string; userId: string; }>> {
  try {
    const user = await requireUser();
    
    // Check if user belongs to any workspace
    const { data: memberData } = await onboardingService.getMemberWorkspace(user.id);
    const hasWorkspace = !!memberData?.id;

    // Fetch user profile stats
    const { data: userData } = await onboardingService.getUserProfile(user.id);

    return { 
      success: true, 
      data: {
        hasWorkspace,
        fullName: userData?.full_name || "",
        userId: user.id
      }
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch onboarding status";
    logger.error({ err: error }, "getOnboardingStatus failed");
    return { success: false, data: null, error: msg };
  }
}

export async function submitOnboardingWorkspace(data: {
  fullName?: string;
  workspaceData?: any;
  projectData?: any;
}): Promise<ActionResult<{ workspaceId?: string }>> {
  try {
    const user = await requireUser();

    if (data.fullName?.trim()) {
      await userService.updateUser(user.id, { full_name: data.fullName.trim() });
    }

    if (!data.workspaceData) {
      return { success: true, data: {} };
    }

    const { data: newWorkspaceId, error: rpcError } = await onboardingService.createWorkspaceAndProject(
      data.workspaceData,
      data.projectData,
      user.id
    );

    if (rpcError) {
      return { success: false, data: null, error: rpcError.message };
    }

    return { success: true, data: { workspaceId: newWorkspaceId } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to process workspace setup";
    logger.error({ err: error }, "submitOnboardingWorkspace failed");
    return { success: false, data: null, error: msg };
  }
}

export async function submitOnboardingMembers(workspaceId: string, membersData: any[]): Promise<ActionResult<null>> {
  try {
    await requireUser();

    if (!workspaceId) {
      return { success: false, data: null, error: "Workspace ID is required to add members" };
    }
    
    await onboardingService.addMembers(workspaceId, membersData);

    return { success: true, data: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to add members";
    logger.error({ err: error }, "submitOnboardingMembers failed");
    return { success: false, data: null, error: msg };
  }
}
