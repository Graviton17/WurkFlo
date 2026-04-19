"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserAction, uploadAvatarAction } from "@/app/actions/user.actions";
import { User, Camera, Loader2, ArrowLeft, Shield, Mail, Pencil } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await updateUserAction({ fullName });
    
    if (res.success) {
      setMessage("Profile updated successfully.");
    } else {
      setError(res.error || "Failed to update profile.");
    }
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAvatarAction(formData);
    
    if (res.success && res.data) {
      setAvatarUrl(res.data);
      setMessage("Avatar uploaded successfully.");
    } else {
      setError(res.error || "Failed to upload avatar.");
    }
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 w-full max-w-4xl mx-auto"
    >
      {/* Back button + heading */}
      <motion.div variants={fadeInUp}>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#666] hover:text-white transition-colors text-[13px] mb-6 group"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] group-hover:bg-white/[0.08] group-hover:border-white/[0.14] transition-all">
            <ArrowLeft size={14} />
          </span>
          Back
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase">
            <User className="w-3.5 h-3.5" />
            Profile
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-white/40 mt-1.5 text-[14px]">Manage your personal information and preferences.</p>
      </motion.div>

      {/* Main card */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden border border-white/[0.08] rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl shadow-2xl"
      >
        {/* Decorative gradient line at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#009b65]/30 to-transparent" />

        {/* Avatar hero section */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06] flex items-center gap-6">
          <div className="relative group shrink-0">
            <Avatar className="w-20 h-20 border-2 border-white/10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl bg-[#1a1a1a] text-white font-bold">
                {(user.full_name || user.email || "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </button>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-semibold text-white truncate">{user.full_name || "Set your name"}</p>
            <p className="text-[13px] text-white/40 mt-0.5 truncate">{user.email}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-[#666] hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] px-3 py-1 rounded-lg transition-all"
            >
              <Camera size={12} />
              Change photo
            </button>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className="px-8 py-6 space-y-5">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/50 text-[12px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Mail size={12} />
              Email
            </Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-white/[0.02] border-white/[0.07] text-white/40 rounded-xl h-11 text-[13px]"
            />
            <p className="text-[11px] text-white/20">Managed by your authentication provider.</p>
          </div>

          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/50 text-[12px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Pencil size={12} />
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl h-11 text-[13px] focus-visible:ring-[#009b65]/20 focus-visible:border-[#009b65]/30 placeholder:text-white/20"
            />
          </div>

          {/* Feedback */}
          {message && (
            <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              {message}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2.5 bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff4d4d] p-3 rounded-xl text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f1f] shrink-0" />
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full h-11 bg-[#009b65] hover:bg-[#009b65]/90 text-white rounded-full font-medium text-[14px] transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden border border-[#ff1f1f]/10 rounded-2xl bg-[#ff1f1f]/[0.02] backdrop-blur-xl"
      >
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 flex items-center justify-center shrink-0">
              <Shield size={15} className="text-[#ff1f1f]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white/80">Danger Zone</p>
              <p className="text-[12px] text-white/30 mt-0.5">Irreversible account actions</p>
            </div>
          </div>
          <button
            type="button"
            className="text-[12px] font-medium text-[#ff1f1f]/70 hover:text-[#ff1f1f] border border-[#ff1f1f]/20 hover:border-[#ff1f1f]/40 px-4 py-2 rounded-lg transition-all hover:bg-[#ff1f1f]/[0.06]"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
