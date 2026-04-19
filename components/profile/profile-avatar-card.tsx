"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatarAction } from "@/app/actions/user.actions";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface ProfileAvatarCardProps {
  avatarUrl: string | null;
  fullName: string | null;
  email: string;
}

export function ProfileAvatarCard({ avatarUrl, fullName, email }: ProfileAvatarCardProps) {
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setMessage({ text: "Only image files are allowed.", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: "File must be under 5MB.", type: "error" });
      return;
    }

    setUploading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAvatarAction(formData);

    if (res.success && res.data) {
      setCurrentAvatar(res.data);
      setMessage({ text: "Avatar updated!", type: "success" });
    } else {
      setMessage({ text: res.error || "Failed to upload avatar.", type: "error" });
    }
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const initials = (fullName || email || "U").charAt(0).toUpperCase();

  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
    >
      {/* Decorative gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

      <div className="flex items-center gap-6">
        {/* Avatar with hover overlay */}
        <div className="relative group">
          <Avatar className="w-24 h-24 border-2 border-white/10 transition-all group-hover:border-white/25">
            <AvatarImage src={currentAvatar} />
            <AvatarFallback className="text-3xl bg-gradient-to-br from-[#ff1f1f]/20 to-[#3c00ff]/20 text-white/70">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            {uploading ? (
              <Loader2 size={20} className="text-white animate-spin" />
            ) : (
              <Camera size={20} className="text-white" />
            )}
          </button>
        </div>

        {/* Name & email preview */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {fullName || "Set your name"}
          </h3>
          <p className="text-sm text-white/40 mt-0.5 truncate">{email}</p>
          <p className="text-xs text-white/25 mt-2">Click the avatar to upload a new photo</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
      />

      {/* Status message */}
      {message.text && (
        <div className={`mt-4 flex items-center gap-2 text-sm ${
          message.type === "error"
            ? "text-[#ff4d4d]"
            : "text-emerald-400"
        }`}>
          {message.type === "success" && <CheckCircle2 size={14} />}
          {message.text}
        </div>
      )}
    </motion.div>
  );
}
