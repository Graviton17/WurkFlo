"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkspaceAction } from "@/app/actions/workspace.actions";
import { Settings, Loader2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function SettingsForm({ workspace }: { workspace: any }) {
  const [name, setName] = useState(workspace.name || "");
  const [slug, setSlug] = useState(workspace.slug || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await updateWorkspaceAction(workspace.id, { name, slug });
    
    if (res.success) {
      setMessage("Workspace updated successfully.");
    } else {
      setError(res.error || "Failed to update workspace.");
    }
    setLoading(false);
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full max-w-xl">
      <motion.div variants={fadeInUp}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
          <Settings className="w-3.5 h-3.5" />
          Settings
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Workspace Settings</h1>
        <p className="text-white/50 text-[15px] mb-8">Configure your workspace name and URL slug.</p>
      </motion.div>

      <motion.form
        variants={fadeInUp}
        onSubmit={handleSave}
        className="relative overflow-hidden space-y-6 border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-white/70 text-[13px]">Workspace Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Acme Corp" 
            required
            className="bg-white/[0.03] border-white/10 text-white rounded-xl h-11 focus-visible:ring-white/20 focus-visible:border-white/20 placeholder:text-white/30"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-white/70 text-[13px]">Workspace Slug</Label>
          <Input 
            id="slug" 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)} 
            placeholder="e.g. acme-corp" 
            required
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
          disabled={loading}
          className="w-full h-11 bg-[#009b65] hover:bg-[#009b65]/90 text-white rounded-full font-medium transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </motion.form>
    </motion.div>
  );
}
