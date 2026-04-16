"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Trash2 } from "lucide-react";
import { useTeamManagement } from "@/hooks/use-team-management";

type MemberWithUser = {
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export function TeamManagement({
  workspaceId,
  initialMembers,
}: {
  workspaceId: string;
  initialMembers: MemberWithUser[];
}) {
  const {
    members,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    isPending,
    message,
    handleInvite,
    handleRoleChange,
    handleRemove,
  } = useTeamManagement(workspaceId, initialMembers);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 group">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#e7e4ec]">
          Team Management
        </h1>
        <p className="mt-2 text-sm text-[#acaab1]">
          Control who has access to your workspace datasets.
        </p>
      </div>

      {/* Invite Member Section */}
      <div className="bg-[#1f1f24] rounded-2xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-8">
        <h2 className="text-lg font-medium text-[#e7e4ec] mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#acaab1]" />
          Invite a Coworker
        </h2>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <Label className="text-[#acaab1] text-xs uppercase tracking-wider">Email Address</Label>
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="bg-[#0e0e10] border-white/10 text-[#e7e4ec] placeholder:text-[#565457] focus-visible:ring-[#c6c6c7]/50"
              required
            />
          </div>
          <div className="w-full sm:w-48 space-y-2">
            <Label className="text-[#acaab1] text-xs uppercase tracking-wider">Role</Label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-[#e7e4ec] focus:outline-none focus:ring-1 focus:ring-[#c6c6c7]/50"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={isPending || !inviteEmail}
            className="bg-[#c6c6c7] hover:bg-[#e2e2e2] text-[#3f4041] transition-all duration-200"
          >
            {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Send Invite
          </Button>
        </form>
        {message.text && (
          <div className={`mt-4 text-sm ${message.type === "error" ? "text-[#ec7c8a]" : "text-green-500"}`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Member List Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-[#e7e4ec]">Active Members</h2>
        
        <div className="bg-[#1f1f24] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#131316] text-[#acaab1] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => (
                <tr key={member.user_id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3f4041] overflow-hidden flex items-center justify-center border border-white/10">
                        {member.user.avatar_url ? (
                          <img src={member.user.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#e7e4ec] text-xs font-bold">
                            {(member.user.full_name || member.user.email).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-[#e7e4ec] font-medium">{member.user.full_name || "Unknown"}</div>
                        <div className="text-[#75757c] text-xs">{member.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={member.role}
                      disabled={isPending}
                      onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                      className="bg-transparent text-[#acaab1] hover:text-[#e7e4ec] cursor-pointer focus:outline-none"
                    >
                      <option value="owner" disabled>Owner</option>
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="guest">Guest</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(member.user_id)}
                      disabled={isPending || member.role === "owner"}
                      className="text-[#565457] hover:text-[#ec7c8a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group-hover:opacity-100"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {members.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-[#acaab1]">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
