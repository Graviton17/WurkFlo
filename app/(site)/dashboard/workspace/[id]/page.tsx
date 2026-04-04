import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { projectService } from "@/services/index";
import { Project } from "@/types/index";
import { ProjectManager } from "@/components/project";

export const dynamic = "force-dynamic";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id: workspaceId } = await params;

  const result = await projectService.getProjectsByWorkspace(workspaceId);

  if (!result.success) {
    console.error("Failed to load projects:", result.error);
  }

  const projects: Project[] = result.data || [];

  return <ProjectManager projects={projects} workspaceId={workspaceId} />;
}
