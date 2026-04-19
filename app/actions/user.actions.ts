"use server";

import { requireUser } from "./utils";
import { userService, onboardingService } from "@/services/index";
import { StorageService } from "@/lib/supabase/bucket";
import { logger } from "@/lib/logger";
import type { ActionResult } from "@/types/index";

export async function getOnboardingStatus(): Promise<ActionResult<{ hasWorkspace: boolean; fullName: string; userId: string; }>> {
  try {
    const user = await requireUser();
    
    const { data: memberData } = await onboardingService.getMemberWorkspace(user.id);
    const hasWorkspace = !!memberData?.id;

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

export async function getUserProfileAction(): Promise<ActionResult<any>> {
  try {
    const user = await requireUser();
    const result = await userService.getUserById(user.id);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Profile not found" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch profile";
    logger.error({ err: error }, "getUserProfileAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function updateUserAction(data: { fullName?: string; avatarUrl?: string }): Promise<ActionResult<any>> {
  try {
    const user = await requireUser();
    
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const result = await userService.updateUser(user.id, updateData);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to update profile" };
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    logger.error({ err: error }, "updateUserAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function uploadAvatarAction(formData: FormData): Promise<ActionResult<string>> {
  try {
    const user = await requireUser();
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, data: null, error: "No file provided" };
    }

    const storage = new StorageService("Avatar");
    const fileExt = file.name.split('.').pop() || "png";
    const path = `users/${user.id}-${Date.now()}.${fileExt}`;

    const uploadRes = await storage.upload(path, file, { upsert: true });
    if (!uploadRes.success) {
      return { success: false, data: null, error: uploadRes.error?.message || "Failed to upload file" };
    }

    const publicUrl = await storage.getPublicUrl(path);

    await userService.updateUser(user.id, { avatar_url: publicUrl });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/profile");

    return { success: true, data: publicUrl };
  } catch (error) {
    logger.error({ err: error }, "uploadAvatarAction failed");
    return { success: false, data: null, error: error instanceof Error ? error.message : "Failed to upload avatar" };
  }
}

export async function deleteAccountAction(): Promise<ActionResult<null>> {
  try {
    const user = await requireUser();

    // Remove user from all workspaces they belong to (cleanup memberships)
    const { workspaceService } = await import("@/services/index");
    const workspaceResult = await workspaceService.getAllWorkspacesByUserId(user.id);
    
    if (workspaceResult.success && workspaceResult.data) {
      for (const ws of workspaceResult.data) {
        await workspaceService.removeMember(ws.id, user.id);
      }
    }

    // Delete the user profile row
    const deleteResult = await userService.deleteUser(user.id);
    if (!deleteResult.success) {
      return { success: false, data: null, error: deleteResult.error?.message || "Failed to delete account" };
    }

    return { success: true, data: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete account";
    logger.error({ err: error }, "deleteAccountAction failed");
    return { success: false, data: null, error: msg };
  }
}
