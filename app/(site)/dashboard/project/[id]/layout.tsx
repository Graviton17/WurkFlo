import { ProjectTabsHeader } from "@/components/dashboard/project/ProjectTabsHeader";
import { projectService } from "@/services/index";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let projectName: string | undefined;
  let projectIdentifier: string | undefined;

  try {
    const { data: project } = await projectService.getProjectById(id);
    if (project) {
      projectName = project.name;
      projectIdentifier = project.identifier;
    }
  } catch (error) {}

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
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </SidebarLayoutWrapper>
  );
}
