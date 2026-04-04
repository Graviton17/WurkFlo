import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { workspaceService } from "@/services/index";
import { WorkspaceWithRole } from "@/types/index";
import { WorkspaceManager } from "@/components/workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await workspaceService.getAllWorkspacesByUserId(user.id);

  if (!result.success) {
    // Basic error handling for server component
    console.error("Failed to load workspaces:", result.error);
  }

  const workspaces: WorkspaceWithRole[] = (result.data || []).map((ws: any) => ({
    ...ws,
    role: ws.role ?? "member",
  }));

  return <WorkspaceManager workspaces={workspaces} />;
}
