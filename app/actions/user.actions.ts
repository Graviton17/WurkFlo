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
    const hasWorkspace = !!memberData?.workspace_id;

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

import { StorageService } from "@/lib/supabase/bucket";

export async function updateUserProfile(formData: FormData): Promise<ActionResult<{ avatarUrl?: string }>> {
  try {
    const user = await requireUser();
    
    const fullName = formData.get("fullName") as string | null;
    const file = formData.get("file") as File | null;
    
    let avatarUrl: string | undefined = undefined;

    if (file && file.size > 0) {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        return { success: false, data: null, error: "Only image files are allowed" };
      }
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, data: null, error: "File exceeds 5MB limit" };
      }

      const avatarStorage = new StorageService("avatars");
      
      // Cleanup existing avatars for this user
      const listResult = await avatarStorage.list(user.id);
      if (listResult.success && listResult.data) {
        const pathsToDelete = listResult.data.map((item: any) => `${user.id}/${item.name}`);
        if (pathsToDelete.length > 0) {
          await avatarStorage.delete(pathsToDelete);
        }
      }

      // Safe buffer conversion for Edge compatibility
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const uploadResult = await avatarStorage.upload(filePath, buffer as any, {
        upsert: true,
        contentType: file.type,
      });

      if (!uploadResult.success) {
        const errMsg = uploadResult.error?.message || "";
        if (errMsg.includes("Bucket not found") || errMsg.includes("row-level security")) {
           return { success: false, data: null, error: "The 'avatars' storage bucket is missing in Supabase. Please create a public 'avatars' bucket in your dashboard." };
        }
        return { success: false, data: null, error: "Avatar upload failed: " + errMsg };
      }
      
      avatarUrl = await avatarStorage.getPublicUrl(filePath);
    }

    // Process DB Updates
    const updates: Partial<typeof user> = {};
    if (fullName) updates.full_name = fullName;
    if (avatarUrl) updates.avatar_url = avatarUrl;
    
    if (Object.keys(updates).length > 0) {
      const updateResult = await userService.upsertUser({ 
        id: user.id, 
        email: user.email!, 
        ...updates 
      });
      
      if (!updateResult.success) {
        return { success: false, data: null, error: updateResult.error?.message };
      }
    }
    
    return { success: true, data: { avatarUrl } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    logger.error({ err: error }, "updateUserProfile failed");
    return { success: false, data: null, error: msg };
  }
}
