import { getUserProfileAction } from "@/app/actions/user.actions";
import { getUserWorkspacesAction } from "@/app/actions/workspace.actions";
import { ProfileAvatarCard } from "@/components/profile/profile-avatar-card";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { ProfileWorkspacesCard } from "@/components/profile/profile-workspaces-card";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const [profileResult, workspacesResult] = await Promise.all([
    getUserProfileAction(),
    getUserWorkspacesAction(),
  ]);

  if (!profileResult.success || !profileResult.data) {
    redirect("/login");
  }

  const user = profileResult.data;
  const workspaces = workspacesResult.data || [];

  return (
    <div className="flex h-full w-full flex-col p-8 md:p-12 lg:p-16 bg-[#0c0c0d] overflow-y-auto relative">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#3c00ff]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto space-y-6">
        {/* Page header */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
            Profile
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
          <p className="text-white/50 mt-2 text-[15px]">Manage your personal information and preferences.</p>
        </div>

        {/* Modular cards */}
        <ProfileAvatarCard
          avatarUrl={user.avatar_url}
          fullName={user.full_name}
          email={user.email}
        />
        <ProfileInfoCard
          fullName={user.full_name}
          email={user.email}
          createdAt={user.created_at}
        />
        <ProfileWorkspacesCard workspaces={workspaces} />
        <ProfileDangerZone email={user.email} />
      </div>
    </div>
  );
}
