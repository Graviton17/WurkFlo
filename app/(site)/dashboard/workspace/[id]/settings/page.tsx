"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Workspace } from "@/types/index";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { WorkspaceSettingsForm } from "@/components/workspace/WorkspaceSettingsForm";
import { WorkspaceDangerZone } from "@/components/workspace/WorkspaceDangerZone";

export default function SettingsPage() {
  const params = useParams();
  const workspaceId = params?.id as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaceAndRole = async () => {
    if (!workspaceId) return;
    
    try {
      setLoading(true);

      const { data: userResponse } = await supabase.auth.getUser();
      const currentUserId = userResponse.user?.id;
      setUserId(currentUserId || null);

      if (currentUserId) {
         const { data: memberData } = await supabase
           .from('workspace_members')
           .select('role')
           .eq('workspace_id', workspaceId)
           .eq('user_id', currentUserId)
           .single();
           
         if (memberData) setRole(memberData.role);
      }

      const res = await fetch(`/api/workspaces/${workspaceId}`);
      if (res.ok) {
        const d = await res.json();
        setWorkspace(d.data);
      }
      
    } catch (err) {
      console.error(err);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceAndRole();
  }, [workspaceId]);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 w-full max-w-[800px] mx-auto">
      
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Settings</h1>
         <p className="text-sm text-white/50">Manage workspace configurations and preferences.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
           <Loader2 className="w-8 h-8 animate-spin text-white/20" />
        </div>
      ) : workspace ? (
        <div>
           <WorkspaceSettingsForm workspace={workspace} role={role} onUpdate={fetchWorkspaceAndRole} />
           <WorkspaceDangerZone workspace={workspace} role={role} userId={userId} />
        </div>
      ) : (
        <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 text-white/50">
           Failed to load workspace details.
        </div>
      )}

    </div>
  );
}
