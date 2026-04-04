import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { auth } from "@/lib/auth";
import { workspaceService } from "@/services/index";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.getUser();
  const result = user ? await workspaceService.getAllWorkspacesByUserId(user.id) : { data: [] };
  const workspaces = result.data || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#161716]">
      <DashboardNavbar initialUser={user} workspaces={workspaces} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
