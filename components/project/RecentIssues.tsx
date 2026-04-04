import { Issue, Project } from "@/types/index";
import { Ghost, CheckSquare, Bug, BookOpen } from "lucide-react";
import Link from "next/link";

export function RecentIssues({ issues, project }: { issues: Issue[], project: Project }) {
  // Sort by updated_at (newest first) and take top 5
  const recentIssues = [...issues].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  }).slice(0, 5);

  const getIssueIcon = (type: string) => {
    switch(type) {
      case 'bug': return <Bug className="w-3.5 h-3.5 text-red-400" />;
      case 'story': return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <CheckSquare className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-6 backdrop-blur-md flex flex-col h-full shadow-xl">
      <div className="mb-6 flex items-center justify-between">
         <div className="space-y-1">
            <h3 className="text-white/80 font-medium text-sm">Recent Activity</h3>
            <p className="text-white/40 text-xs">Latest issues accessed in this project.</p>
         </div>
      </div>

      {recentIssues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-[12px] bg-black/20">
           <Ghost className="w-8 h-8 text-white/20 mb-3" />
           <p className="text-sm font-medium text-white/60">No issues yet</p>
           <p className="text-xs text-white/40 mt-1 max-w-[200px]">Create an issue in the backlog to see it appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recentIssues.map(issue => (
             <Link 
               href={`/dashboard/project/${project.id}/board?issue=${issue.id}`} 
               key={issue.id}
               className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-[12px] bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all gap-3"
             >
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded bg-black/40">
                      {getIssueIcon(issue.issue_type)}
                   </div>
                   <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs font-mono text-white/40 shrink-0">{project.identifier}-{issue.sequence_id}</span>
                      <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">{issue.title}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2 pl-9 sm:pl-0 shrink-0">
                   <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${getPriorityColor(issue.priority)}`}>
                     {issue.priority}
                   </span>
                </div>
             </Link>
          ))}
        </div>
      )}
    </div>
  );
}
