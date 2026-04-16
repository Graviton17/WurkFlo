"use client";

import { useState, useRef, useCallback } from "react";
import { useServerAction, type StatusMessage } from "./use-server-action";
import { updateUserProfile } from "@/app/actions/user.actions";
import type { User } from "@/types/index";

export function useProfileForm(user: User) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const save = useServerAction(
    async (formData: FormData) => updateUserProfile(formData),
    {
      successMessage: "Profile automatically updated!",
      onSuccess: () => setPendingFile(null),
    },
  );

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      setPendingFile(file);
      save.setStatus({ text: "Unsaved changes...", type: "info" });
    },
    [save],
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setFullName(value);
      if (!save.status.text.includes("Unsaved")) {
        save.setStatus({ text: "Unsaved changes...", type: "info" });
      }
    },
    [save],
  );

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (pendingFile) {
      formData.append("file", pendingFile);
    }
    save.execute(formData);
  }, [fullName, pendingFile, save]);

  const hasChanges =
    fullName !== (user.full_name || "") || pendingFile !== null;

  return {
    fullName,
    setFullName: handleNameChange,
    avatarUrl,
    pendingFile,
    fileInputRef,
    isPending: save.isPending,
    status: save.status,
    hasChanges,
    handleAvatarClick,
    handleFileChange,
    handleSave,
  };
}
