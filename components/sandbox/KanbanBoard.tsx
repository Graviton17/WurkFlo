"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GripVertical } from 'lucide-react';

type Task = { id: string; title: string; priority: string; column: string };

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Design Landing Page', priority: 'High', column: 'todo' },
  { id: '2', title: 'Implement Auth', priority: 'Medium', column: 'in-progress' },
  { id: '3', title: 'Fix Header Bug', priority: 'Low', column: 'done' },
];

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-zinc-800/50 border-zinc-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500/5 border-blue-500/20' },
  { id: 'done', title: 'Done', color: 'bg-emerald-500/5 border-emerald-500/20' },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragEnd = (event: any, info: any, task: Task) => {
    const offset = info.offset.x;
    const currentIdx = COLUMNS.findIndex(c => c.id === task.column);
    
    let newIdx = currentIdx;
    if (offset > 120 && currentIdx < COLUMNS.length - 1) {
      newIdx++;
    } else if (offset < -120 && currentIdx > 0) {
      newIdx--;
    }

    if (newIdx !== currentIdx) {
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, column: COLUMNS[newIdx].id } : t
      ));
    }
    setActiveTaskId(null);
  };

  return (
    <div className="flex gap-4 w-full overflow-x-auto pb-4 hide-scrollbar select-none snap-x">
      {COLUMNS.map((col) => (
        <div 
          key={col.id} 
          className={`flex-1 min-w-[260px] snap-center rounded-xl p-4 flex flex-col gap-3 border ${col.color}`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-zinc-300">{col.title}</h3>
            <span className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
              {tasks.filter(t => t.column === col.id).length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[140px]">
            {tasks.filter(t => t.column === col.id).map((task) => (
              <motion.div
                key={task.id}
                layout
                layoutId={task.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                onDragStart={() => setActiveTaskId(task.id)}
                onDragEnd={(e, info) => handleDragEnd(e, info, task)}
                whileDrag={{ scale: 1.05, zIndex: 50, rotate: 2 }}
                className={`
                  bg-[#161618] border border-zinc-700/60 shadow-lg p-3.5 rounded-lg cursor-grab active:cursor-grabbing text-sm flex flex-col gap-3 relative
                  ${activeTaskId === task.id ? 'opacity-80 ring-2 ring-indigo-500/50' : 'hover:border-zinc-600'}
                  transition-colors duration-200
                `}
              >
                <div className="flex items-start gap-2 justify-between">
                  <span className="font-medium text-zinc-200 leading-tight">{task.title}</span>
                  <GripVertical className="text-zinc-600 w-4 h-4 shrink-0 hover:text-zinc-400 transition-colors" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    task.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-sm">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
            {tasks.filter(t => t.column === col.id).length === 0 && (
              <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm border-2 border-dashed border-zinc-800/50 rounded-lg bg-zinc-900/20">
                Drop here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
