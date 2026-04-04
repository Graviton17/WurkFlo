import { projectService } from "@/services/project.service";
import { issueService } from "@/services/issue.service";
import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectQuickLinks } from "@/components/project/ProjectQuickLinks";
import { ProjectStats } from "@/components/project/ProjectStats";
import { RecentIssues } from "@/components/project/RecentIssues";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const [projectRes, issuesRes] = await Promise.all([
     projectService.getProjectById(params.id),
     issueService.getIssuesByProject(params.id)
  ]);

  if (!projectRes.success || !projectRes.data) {
     return notFound();
  }

  const project = projectRes.data;
  const issues = issuesRes.data || [];

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="mb-10">
        <ProjectHeader project={project} />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
         
         <div className="space-y-8 flex flex-col">
           {/* Quick Navigation / Tooling Links */}
           <section>
              <h2 className="text-sm font-semibold text-white/50 tracking-wider uppercase mb-4 pl-1">Workspace Tools</h2>
              <ProjectQuickLinks projectId={project.id} />
           </section>

           {/* Recent Issues Feed */}
           <section className="flex-1">
              <RecentIssues issues={issues} project={project} />
           </section>
         </div>

         {/* Right Sidebar Stats */}
         <div className="space-y-8">
            <ProjectStats issues={issues} />
         </div>

      </div>

    </div>
  );
}
