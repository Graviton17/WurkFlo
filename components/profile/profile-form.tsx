"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserAction, uploadAvatarAction } from "@/app/actions/user.actions";
import { User, Camera, Loader2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function ProfileForm({ user }: { user: any }) {
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
      className="space-y-8 w-full max-w-xl"
    >
      <motion.div variants={fadeInUp}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
          <User className="w-3.5 h-3.5" />
          Profile
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-white/50 mt-2 text-[15px]">Manage your personal information and preferences.</p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

        {/* Avatar Section */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-white/10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-[#ff1f1f]/20 to-[#3c00ff]/20 text-white/70">
                {(user.full_name || user.email || "U").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.full_name || "Set your name"}</p>
            <p className="text-xs text-white/40 mt-0.5">{user.email}</p>
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
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70 text-[13px]">Email</Label>
            <Input
              id="email"
              value={user.email || ""}
              disabled
              className="bg-white/[0.03] border-white/10 text-white/50 rounded-xl h-11"
            />
            <p className="text-xs text-white/30">Managed by your authentication provider.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white/70 text-[13px]">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-11 focus-visible:ring-white/20 focus-visible:border-white/20 placeholder:text-white/30"
            />
          </div>
          
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff4d4d] p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full h-11 bg-[#009b65] hover:bg-[#009b65]/90 text-white rounded-full font-medium transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
