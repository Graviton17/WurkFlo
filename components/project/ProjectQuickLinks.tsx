import Link from "next/link";
import { View, AlignLeft, Settings, ArrowRight } from "lucide-react";

export function ProjectQuickLinks({ projectId }: { projectId: string }) {
  const links = [
    {
      title: "Kanban Board",
      description: "Visual workflow and active sprints",
      icon: <View className="w-5 h-5 text-indigo-400" />,
      href: `/dashboard/project/${projectId}/board`,
      bgClass: "bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/10",
    },
    {
      title: "Backlog",
      description: "Prioritize and plan upcoming work",
      icon: <AlignLeft className="w-5 h-5 text-amber-400" />,
      href: `/dashboard/project/${projectId}/backlog`,
      bgClass: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10",
    },
    {
      title: "Project Settings",
      description: "Manage forms, workflows, and team",
      icon: <Settings className="w-5 h-5 text-rose-400" />,
      href: `/dashboard/project/${projectId}/settings`,
      bgClass: "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/10",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {links.map((link) => (
        <Link 
          key={link.title} 
          href={link.href}
          className={`group flex flex-col p-5 rounded-[18px] border transition-all duration-300 ${link.bgClass} backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-[10px] bg-black/40 shadow-inner">
               {link.icon}
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors transform group-hover:translate-x-1" />
          </div>
          <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">{link.title}</h3>
          <p className="text-white/40 text-xs line-clamp-2">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
