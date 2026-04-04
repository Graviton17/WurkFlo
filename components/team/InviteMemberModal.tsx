"use client";

import { useState } from "react";
import { Mail, Loader2, UserPlus, X } from "lucide-react";
import { WorkspaceRole } from "@/types/index";

export function InviteMemberModal({ workspaceId, onInviteComplete }: { workspaceId: string, onInviteComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("member");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to invite member");
      }

      setStatus({ type: 'success', message: "Invitation email sent successfully!" });
      setEmail("");
      setRole("member");
      
      // Auto close after 2 seconds
      setTimeout(() => {
         setIsOpen(false);
         setStatus({ type: null, message: "" });
         onInviteComplete();
      }, 2000);

    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-10 px-4 rounded-[12px] bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all shadow-lg shadow-white/5"
      >
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && setIsOpen(false)} />
           <div className="relative w-full max-w-md rounded-[20px] bg-[#161716] border border-white/10 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-semibold tracking-tight text-white">Invite to Workspace</h2>
                 <button onClick={() => !loading && setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleInvite} className="flex flex-col gap-4">
                 
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="colleague@company.com" 
                         required
                         className="h-11 w-full border border-white/10 rounded-[12px] bg-white/[0.03] text-white pl-10 pr-4 outline-none transition-all placeholder:text-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                       />
                    </div>
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/70">Workspace Role</label>
                    <select 
                      value={role}
                      onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                      className="h-11 w-full border border-white/10 rounded-[12px] bg-white/[0.03] text-white px-4 outline-none transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 cursor-pointer appearance-none"
                    >
                       <option value="admin" className="bg-[#161716] text-white">Admin</option>
                       <option value="member" className="bg-[#161716] text-white">Member</option>
                       <option value="guest" className="bg-[#161716] text-white">Guest</option>
                    </select>
                 </div>

                 {status.message && (
                    <div className={`mt-2 p-3 rounded-[8px] text-xs font-medium border ${
                      status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                       {status.message}
                    </div>
                 )}

                 <button 
                   type="submit" 
                   disabled={loading || !email}
                   className="h-11 mt-2 w-full rounded-[12px] bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invitation"}
                 </button>

              </form>

           </div>
        </div>
      )}
    </>
  );
}
