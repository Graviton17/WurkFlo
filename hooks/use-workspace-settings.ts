"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useServerAction } from "./use-server-action";
import {
  updateWorkspaceAction,
  deleteWorkspaceAction,
} from "@/app/actions/workspace.actions";
import type { Workspace } from "@/types/index";

export function useWorkspaceSettings(workspace: Workspace) {
  const router = useRouter();
  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const update = useServerAction(
    async () => updateWorkspaceAction(workspace.id, { name, slug }),
    {
      successMessage: "Workspace updated successfully!",
      onSuccess: () => router.refresh(),
    },
  );

  const remove = useServerAction(
    async () => deleteWorkspaceAction(workspace.id),
    {
      onSuccess: () => router.push("/dashboard"),
    },
  );

  const handleUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      update.execute();
    },
    [update],
  );

  const handleDelete = useCallback(() => {
    if (deleteConfirm !== workspace.name) return;
    remove.execute();
  }, [deleteConfirm, workspace.name, remove]);

  const hasChanges = name !== workspace.name || slug !== workspace.slug;
  const isPending = update.isPending || remove.isPending;

  return {
    name,
    setName,
    slug,
    setSlug,
    deleteConfirm,
    setDeleteConfirm,
    hasChanges,
    isPending,
    updateStatus: update.status,
    deleteStatus: remove.status,
    handleUpdate,
    handleDelete,
  };
}
