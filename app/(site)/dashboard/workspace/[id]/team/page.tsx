"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TeamDirectoryTable, PopulatedMember } from "@/components/team/TeamDirectoryTable";
import { InviteMemberModal } from "@/components/team/InviteMemberModal";
import { WorkspaceRole } from "@/types/index";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function TeamPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params?.id as string;
  
  const [members, setMembers] = useState<PopulatedMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    if (!workspaceId) return;
    setLoading(true);
    try {
      // 1. Fetch workspace members
      const { data: memberRows, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId);
        
      if (error) throw error;
      
      if (!memberRows || memberRows.length === 0) {
        setMembers([]);
        return;
      }

      // 2. Fetch user profiles
      const userIds = memberRows.map((m: any) => m.user_id);
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, full_name, avatar_url')
        .in('id', userIds);
        
      if (userError) throw userError;

      // 3. Map together
      const populated: PopulatedMember[] = memberRows.map((m: any) => {
         const u = users.find((user: any) => user.id === m.user_id);
         return {
            ...m,
            full_name: u?.full_name || null,
            avatar_url: u?.avatar_url || null,
         };
      });

      // Sort owners/admins first
      populated.sort((a, b) => {
         const weight = { owner: 4, admin: 3, member: 2, guest: 1 };
         return weight[b.role] - weight[a.role];
      });

      setMembers(populated);
    } catch (err: any) {
      console.error("Fetch team error:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [workspaceId]);

  const handleRoleChange = async (userId: string, newRole: WorkspaceRole) => {
    try {
      await fetch(`/api/workspaces/${workspaceId}/members`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ userId, role: newRole })
      });
      fetchTeam();
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await fetch(`/api/workspaces/${workspaceId}/members?userId=${userId}`, {
         method: "DELETE"
      });
      fetchTeam();
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 w-full max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Team Directory</h1>
            <p className="text-sm text-white/50">Manage workspace members and their access roles.</p>
         </div>
         
         {workspaceId && <InviteMemberModal workspaceId={workspaceId} onInviteComplete={fetchTeam} />}
      </div>

      {loading ? (
         <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/30" />
         </div>
      ) : (
         <TeamDirectoryTable 
           members={members} 
           onRoleChange={handleRoleChange} 
           onRemove={handleRemove} 
         />
      )}

    </div>
  );
}
