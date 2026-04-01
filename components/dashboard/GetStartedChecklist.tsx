"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CheckCircle2, 
  Circle,
  FolderOpen,
  ListTodo,
  Users,
  FileText,
  MessageSquare,
  Link as LinkIcon
} from "lucide-react";

type CheckableItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

const items: CheckableItem[] = [
  { id: "project", title: "Create a project", icon: <FolderOpen size={16} className="text-[#888]" /> },
  { id: "workitem", title: "Create a work item", icon: <ListTodo size={16} className="text-[#888]" /> },
  { id: "invite", title: "Invite team members", icon: <Users size={16} className="text-[#888]" /> },
  { id: "page", title: "Try creating a page", icon: <FileText size={16} className="text-[#888]" /> },
  { id: "ai", title: "Try Plane AI chat", icon: <MessageSquare size={16} className="text-[#888]" /> },
  { id: "integration", title: "Link an integration", icon: <LinkIcon size={16} className="text-[#888]" /> },
];

export function GetStartedChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#101012] border border-white/5 rounded-xl overflow-hidden mb-12">
      <div className="flex flex-col">
        {items.map((item, index) => {
          const isChecked = checkedItems.has(item.id);
          
          return (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-white/[0.03] ${index !== items.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <button 
                className={`flex items-center justify-center transition-colors ${isChecked ? 'text-green-500' : 'text-white/20 hover:text-white/40'}`}
              >
                {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              
              <div className="flex items-center gap-3">
                {item.icon}
                <span className={`text-[0.9rem] transition-colors ${isChecked ? 'text-white/50 line-through' : 'text-white/90'}`}>
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
