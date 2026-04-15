import { auth } from "@/lib/auth";
import { workspaceService, userService } from "@/services/index";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const [workspaceResult, profileResult] = await Promise.all([
    workspaceService.getAllWorkspacesByUserId(user.id),
    userService.getUserById(user.id),
  ]);

  const workspaces = workspaceResult.data || [];
  const profileData = profileResult.data;

  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0e0e10]">
        <DashboardNavbar initialUser={user} workspaces={workspaces} />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-[#ec7c8a]">Failed to load profile data.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0e0e10]">
      <DashboardNavbar initialUser={user} workspaces={workspaces} />
      <main className="flex-1 flex flex-col p-8 md:p-12 lg:p-16">
        <ProfileForm user={profileData} />
      </main>
    </div>
  );
}
