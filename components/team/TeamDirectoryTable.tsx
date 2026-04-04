"use client";

import { useState } from "react";
import { User, MoreVertical, Trash, Key, UserCog, UserCheck, Ghost } from "lucide-react";
import { WorkspaceRole } from "@/types/index";

export interface PopulatedMember {
  user_id: string;
  workspace_id: string;
  role: WorkspaceRole;
  created_at: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function TeamDirectoryTable({ members, onRoleChange, onRemove }: { 
  members: PopulatedMember[], 
  onRoleChange: (userId: string, newRole: WorkspaceRole) => void,
  onRemove: (userId: string) => void
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Key className="w-4 h-4 text-emerald-400" />;
      case 'admin': return <UserCog className="w-4 h-4 text-blue-400" />;
      default: return <UserCheck className="w-4 h-4 text-white/40" />;
    }
  };

  if (!members || members.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-[18px] bg-black/20">
           <Ghost className="w-10 h-10 text-white/20 mb-4" />
           <p className="text-sm font-medium text-white/60">No members found</p>
           <p className="text-xs text-white/40 mt-1">This workspace appears to be empty.</p>
        </div>
     );
  }

  return (
    <div className="w-full rounded-[18px] bg-white/[0.02] border border-white/[0.05] overflow-hidden backdrop-blur-md shadow-xl">
       <div className="overflow-x-auto">
         <table className="w-full text-left text-sm text-white/60 min-w-[700px]">
           <thead className="bg-black/40 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/[0.05]">
             <tr>
               <th className="px-6 py-4">Member</th>
               <th className="px-6 py-4">Role</th>
               <th className="px-6 py-4">Joined At</th>
               <th className="px-6 py-4 text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/[0.05]">
             {members.map((member) => {
                const initials = member.full_name ? member.full_name.substring(0, 2).toUpperCase() : "U";
                const joinDate = member.created_at ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(member.created_at)) : "Unknown";
                
                return (
                 <tr key={member.user_id} className="hover:bg-white/[0.02] transition-colors relative">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                           {member.avatar_url ? (
                              <img src={member.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                              <span className="text-xs font-semibold text-white/70">{initials}</span>
                           )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="text-sm font-medium text-white/90 truncate max-w-[250px]">
                              {member.full_name || "Unknown User"}
                           </span>
                        </div>
                     </div>
                   </td>
                   
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-white/5 w-fit">
                         {getRoleIcon(member.role)}
                         <span className="text-xs font-medium uppercase tracking-wider text-white/70">{member.role}</span>
                      </div>
                   </td>

                   <td className="px-6 py-4 text-white/50">
                      {joinDate}
                   </td>

                   <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === member.user_id ? null : member.user_id)}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      >
                         <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === member.user_id && (
                         <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                            <div className="absolute right-6 top-10 mt-1 w-40 bg-black/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50 text-left">
                               <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/30 border-b border-white/5 mb-1">
                                  Change Role
                               </div>
                               <button onClick={() => { onRoleChange(member.user_id, "admin"); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors">Make Admin</button>
                               <button onClick={() => { onRoleChange(member.user_id, "member"); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors">Make Member</button>
                               <button onClick={() => { onRoleChange(member.user_id, "guest"); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors">Make Guest</button>
                               <div className="h-[1px] bg-white/10 my-1 font-['Inter']" />
                               <button onClick={() => { onRemove(member.user_id); setOpenDropdown(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors flex items-center gap-2">
                                  <Trash className="w-3.5 h-3.5" /> Remove
                               </button>
                            </div>
                         </>
                      )}
                   </td>
                 </tr>
                );
             })}
           </tbody>
         </table>
       </div>
    </div>
  );
}
