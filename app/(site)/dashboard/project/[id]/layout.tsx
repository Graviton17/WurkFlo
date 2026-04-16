import { ProjectTabsHeader } from "@/components/dashboard/project/ProjectTabsHeader";
import { getProjectData } from "@/app/actions/project.actions";
import { getWorkflowStatesAction } from "@/app/actions/workflow.actions";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";
import { CreateIssueProvider } from "@/components/dashboard/issues/CreateIssueContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { WorkflowState } from "@/types/index";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  let projectName: string | undefined;
  let projectIdentifier: string | undefined;
  let workspaceId: string = "";
  let states: WorkflowState[] = [];

  try {
    const [projectRes, statesRes] = await Promise.all([
      getProjectData(id),
      getWorkflowStatesAction(id),
    ]);
    
    if (projectRes.data) {
      projectName = projectRes.data.name;
      projectIdentifier = projectRes.data.identifier;
      workspaceId = projectRes.data.workspace_id;
    }
    
    if (statesRes.data) {
      states = statesRes.data;
    }
  } catch (error) {
    console.error("Failed to load project layout context", error);
  }

  return (
    <SidebarLayoutWrapper>
      <div className="flex flex-col w-full h-full min-h-0 bg-[#111113] text-[#e5e7eb]">
        {/* Project Tabs Header */}
        <ProjectTabsHeader
          projectId={id}
          projectName={projectName}
          projectIdentifier={projectIdentifier}
        />

        {/* Main Content */}
        <CreateIssueProvider projectId={id} workspaceId={workspaceId} states={states}>
          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
        </CreateIssueProvider>
      </div>
    </SidebarLayoutWrapper>
  );
}
