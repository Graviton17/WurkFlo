import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserWorkspacesAction } from "@/app/actions/workspace.actions";
import { WorkspaceManager } from "@/components/workspace";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getUserWorkspacesAction();

  if (!result.success) {
    console.error("Failed to load workspaces:", result.error);
  }

  const workspaces = result.data || [];

  return <WorkspaceManager workspaces={workspaces} />;
}
