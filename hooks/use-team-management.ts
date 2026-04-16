"use client";

import { useState, useCallback } from "react";
import { useServerAction } from "./use-server-action";
import {
  addWorkspaceMemberAction,
  removeWorkspaceMemberAction,
  updateWorkspaceMemberRoleAction,
} from "@/app/actions/workspace.actions";

type MemberWithUser = {
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export function useTeamManagement(
  workspaceId: string,
  initialMembers: MemberWithUser[],
) {
  const [members, setMembers] = useState<MemberWithUser[]>(
    initialMembers || [],
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const invite = useServerAction(
    async (email: string, role: string) =>
      addWorkspaceMemberAction(workspaceId, email, role),
    {
      successMessage:
        "Member added successfully! Refresh to see them in the list.",
      onSuccess: () => setInviteEmail(""),
    },
  );

  const changeRole = useServerAction(
    async (userId: string, newRole: string) =>
      updateWorkspaceMemberRoleAction(workspaceId, userId, newRole),
    {
      onSuccess: () => {
        // Role update is handled optimistically in handleRoleChange
      },
    },
  );

  const removeMember = useServerAction(
    async (userId: string) =>
      removeWorkspaceMemberAction(workspaceId, userId),
    {
      onSuccess: () => {
        // Member removal is handled optimistically in handleRemove
      },
    },
  );

  const handleInvite = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inviteEmail.trim()) return;
      invite.execute(inviteEmail, inviteRole);
    },
    [inviteEmail, inviteRole, invite],
  );

  const handleRoleChange = useCallback(
    (userId: string, newRole: string) => {
      // Optimistic update
      setMembers((prev) =>
        prev.map((m) => (m.user_id === userId ? { ...m, role: newRole } : m)),
      );
      changeRole.execute(userId, newRole);
    },
    [changeRole],
  );

  const handleRemove = useCallback(
    (userId: string) => {
      const confirmRemove = window.confirm(
        "Are you sure you want to remove this member?",
      );
      if (!confirmRemove) return;

      // Optimistic update
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      removeMember.execute(userId);
    },
    [removeMember],
  );

  const isPending =
    invite.isPending || changeRole.isPending || removeMember.isPending;

  // Consolidate messages — show the most recent non-empty one
  const message =
    invite.status.text
      ? invite.status
      : changeRole.status.text
        ? changeRole.status
        : removeMember.status;

  return {
    members,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    isPending,
    message,
    handleInvite,
    handleRoleChange,
    handleRemove,
  };
}
