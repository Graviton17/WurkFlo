import { Issue } from "@/types/index";
import { CheckSquare, Bug, BookOpen } from "lucide-react";

export function ProjectStats({ issues }: { issues: Issue[] }) {
  const taskCount = issues.filter(i => i.issue_type === 'task').length;
  const bugCount = issues.filter(i => i.issue_type === 'bug').length;
  const storyCount = issues.filter(i => i.issue_type === 'story').length;
  
  const total = issues.length;

  return (
    <div className="rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-6 backdrop-blur-md flex flex-col h-full shadow-xl">
      <div className="mb-6">
         <h3 className="text-white/80 font-medium text-sm">Issue Breakdown</h3>
         <p className="text-white/40 text-xs mt-1">Snapshot of all created issues.</p>
      </div>

      <div className="flex items-end gap-2 mb-8">
         <span className="text-4xl font-semibold tracking-tight text-white">{total}</span>
         <span className="text-white/40 text-sm mb-1 uppercase tracking-wider">Total</span>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
         <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
               </div>
               <span className="text-sm text-white/70 group-hover:text-white transition-colors">Tasks</span>
            </div>
            <span className="text-sm font-medium text-white">{taskCount}</span>
         </div>
         
         <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Bug className="w-4 h-4 text-red-400" />
               </div>
               <span className="text-sm text-white/70 group-hover:text-white transition-colors">Bugs</span>
            </div>
            <span className="text-sm font-medium text-white">{bugCount}</span>
         </div>

         <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
               </div>
               <span className="text-sm text-white/70 group-hover:text-white transition-colors">Stories</span>
            </div>
            <span className="text-sm font-medium text-white">{storyCount}</span>
         </div>
      </div>
    </div>
  );
}
