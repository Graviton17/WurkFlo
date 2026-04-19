"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccountAction } from "@/app/actions/user.actions";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

interface ProfileDangerZoneProps {
  email: string;
}

export function ProfileDangerZone({ email }: ProfileDangerZoneProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText === email;

  async function handleDelete() {
    if (!canDelete) return;

    setLoading(true);
    setError("");

    const res = await deleteAccountAction();

    if (res.success) {
      router.push("/login");
    } else {
      setError(res.error || "Failed to delete account.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden border border-[#ff1f1f]/15 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
    >
      {/* Decorative danger gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff1f1f]/40 to-transparent opacity-60" />

      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-[#ff1f1f]" />
        <h2 className="text-sm font-bold tracking-wider uppercase text-[#ff6b6b]">Danger Zone</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-white/80 font-medium">Delete your account</p>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Permanently remove your account and all associated data.
            You will be removed from all workspaces. This action cannot be undone.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="delete-confirm" className="text-white/40 text-[11px] uppercase tracking-wider">
            Type <span className="text-white/70 font-mono select-all">"{email}"</span> to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter your email to confirm"
            className="bg-white/[0.03] border-[#ff1f1f]/15 text-white rounded-xl h-11 focus-visible:ring-[#ff1f1f]/20 focus-visible:border-[#ff1f1f]/30 placeholder:text-white/25"
          />
        </div>

        {error && (
          <div className="bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff4d4d] p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={loading || !canDelete}
          className="w-full h-11 bg-[#ff1f1f]/15 hover:bg-[#ff1f1f]/25 text-[#ff6b6b] border border-[#ff1f1f]/20 hover:border-[#ff1f1f]/40 rounded-full font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={15} />}
          {loading ? "Deleting account..." : "Delete Account Permanently"}
        </button>
      </div>
    </motion.div>
  );
}
