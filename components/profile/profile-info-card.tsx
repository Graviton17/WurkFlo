"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserAction } from "@/app/actions/user.actions";
import { Loader2, User, CalendarDays } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface ProfileInfoCardProps {
  fullName: string | null;
  email: string;
  createdAt: string;
}

export function ProfileInfoCard({ fullName, email, createdAt }: ProfileInfoCardProps) {
  const [name, setName] = useState(fullName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const memberSince = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasChanges = name !== (fullName || "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    const res = await updateUserAction({ fullName: name });

    if (res.success) {
      setMessage({ text: "Profile updated successfully.", type: "success" });
    } else {
      setMessage({ text: res.error || "Failed to update profile.", type: "error" });
    }
    setLoading(false);
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
    >
      {/* Decorative gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

      <div className="flex items-center gap-2 mb-6">
        <User size={16} className="text-[#ff1f1f]" />
        <h2 className="text-sm font-bold tracking-wider uppercase text-white/70">Personal Information</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="profile-email" className="text-white/50 text-[13px]">Email</Label>
          <Input
            id="profile-email"
            value={email}
            disabled
            className="bg-white/[0.03] border-white/10 text-white/50 rounded-xl h-11 cursor-not-allowed"
          />
          <p className="text-xs text-white/25">Managed by your authentication provider.</p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="profile-fullName" className="text-white/50 text-[13px]">Full Name</Label>
          <Input
            id="profile-fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-11 focus-visible:ring-white/20 focus-visible:border-white/20 placeholder:text-white/30"
          />
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 text-white/30 text-xs pt-1">
          <CalendarDays size={13} />
          <span>Member since {memberSince}</span>
        </div>

        {/* Status message */}
        {message.text && (
          <div className={`text-sm p-3 rounded-xl border ${
            message.type === "error"
              ? "bg-[#ff1f1f]/10 border-[#ff1f1f]/20 text-[#ff4d4d]"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}>
            {message.text}
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="w-full h-11 bg-[#009b65] hover:bg-[#009b65]/90 text-white rounded-full font-medium transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
}
