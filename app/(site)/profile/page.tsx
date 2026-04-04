import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { auth } from "@/lib/auth";
import { workspaceService, userService } from "@/services/index";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ProfileInfoDisplay } from "@/components/profile/ProfileInfoDisplay";

export const metadata = {
  title: "Profile | WurkFlo",
};

export default async function ProfilePage() {
  const authUser = await auth.getUser();
  if (!authUser) {
    redirect("/login");
  }

  const [workspaceResult, userResult] = await Promise.all([
    workspaceService.getAllWorkspacesByUserId(authUser.id),
    userService.getUserById(authUser.id)
  ]);

  const workspaces = workspaceResult.data || [];
  const profileData = userResult.data;

  if (!profileData) {
    return (
       <div className="flex min-h-screen w-full flex-col bg-[#161716]">
          <DashboardNavbar initialUser={authUser} workspaces={workspaces} />
          <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground">
            Error loading profile data. Please contact support.
          </div>
       </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#161716]">
      <DashboardNavbar initialUser={authUser} workspaces={workspaces} />
      <main className="flex-1 flex flex-col items-center py-12 px-4 relative z-0">
        
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-1.5 flex flex-col items-center sm:items-start text-center sm:text-left">
             <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">Your Profile</h1>
             <p className="text-sm text-white/50">Manage your personal information and profile display settings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
             <div className="space-y-8 w-full order-2 lg:order-1">
               <ProfileSettings initialData={profileData} />
             </div>
             
             <div className="w-full order-1 lg:order-2 sticky top-[80px]">
               <ProfileInfoDisplay data={profileData} />
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
