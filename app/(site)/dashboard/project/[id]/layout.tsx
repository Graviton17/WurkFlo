import { ProjectTabsHeader } from "@/components/dashboard/project/ProjectTabsHeader";
import { getProjectData } from "@/app/actions/project.actions";
import { getWorkflowStatesAction } from "@/app/actions/workflow.actions";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";
import { CreateIssueProvider } from "@/components/dashboard/issues/CreateIssueContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { WorkflowState, Sprint, Epic, Release } from "@/types/index";
import { sprintService, epicService, releaseService } from "@/services/index";

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
  let sprints: Sprint[] = [];
  let epics: Epic[] = [];
  let releases: Release[] = [];

  try {
    const [projectRes, statesRes, sprintsRes, epicsRes, releasesRes] = await Promise.all([
      getProjectData(id),
      getWorkflowStatesAction(id),
      sprintService.getSprintsByProject(id),
      epicService.getEpicsByProject(id),
      releaseService.getReleasesByProject(id),
    ]);
    
    if (projectRes.data) {
      projectName = projectRes.data.name;
      projectIdentifier = projectRes.data.identifier;
      workspaceId = projectRes.data.workspace_id;
    }
    
    if (statesRes.data) {
      states = statesRes.data;
    }

    // Only show planned + active sprints for assignment
    const allSprints = sprintsRes.data ?? [];
    sprints = allSprints.filter((s) => s.status === "planned" || s.status === "active");
    epics = epicsRes.data ?? [];
    releases = releasesRes.data ?? [];
  } catch (error) {
    console.error("Failed to load project layout context", error);
  }

  return (
    <SidebarLayoutWrapper activeWorkspaceId={workspaceId}>
      <div className="flex flex-col w-full h-full min-h-0 bg-[#0c0c0d] text-[#e5e7eb]">
        {/* Project Tabs Header */}
        <ProjectTabsHeader
          projectId={id}
          projectName={projectName}
          projectIdentifier={projectIdentifier}
        />

        {/* Main Content */}
        <CreateIssueProvider
          projectId={id}
          workspaceId={workspaceId}
          states={states}
          sprints={sprints}
          epics={epics}
          releases={releases}
        >
          <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
        </CreateIssueProvider>
      </div>
    </SidebarLayoutWrapper>
  );
}
