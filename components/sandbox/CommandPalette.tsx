"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, User, FileText, Settings, X, CornerDownLeft, Sparkles, CheckCircle } from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Listen for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ACTIONS = [
    { id: '1', title: 'Create new issue', icon: Plus, group: 'Actions', message: 'Issue drafted successfully!' },
    { id: '2', title: 'Assign to me', icon: User, group: 'Actions', message: 'Assigned to your queue.' },
    { id: '3', title: 'Search documentation', icon: FileText, group: 'Navigation', message: 'Opening docs...' },
    { id: '4', title: 'Open Settings', icon: Settings, group: 'Navigation', message: 'Redirecting to settings...' },
    { id: '5', title: 'Generate with AI', icon: Sparkles, group: 'Actions', message: 'AI generating response...' },
  ];

  const filtered = ACTIONS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleAction = (message: string) => {
    setIsOpen(false);
    setSearch('');
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {/* Trigger Button inside sandbox */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#161618]/80 hover:bg-[#1c1c1f] border border-zinc-700/50 hover:border-indigo-500/50 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 mx-auto w-full max-w-md justify-between shadow-sm group backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
          <span>Search or type a command...</span>
        </div>
        <kbd className="hidden sm:inline-flex bg-zinc-800/80 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-mono border border-zinc-700/50 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-colors shadow-sm">
          ⌘K
        </kbd>
      </button>

      {/* Mock Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#161618] border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Palette Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(5px)' }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-[#131315]/95 backdrop-blur-xl border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden shadow-black/80 ring-1 ring-white/5"
            >
              <div className="flex items-center px-4 py-4 border-b border-zinc-800/80 bg-black/20">
                <Search className="w-5 h-5 text-indigo-400 mr-3" />
                <input 
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What do you need?"
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-lg"
                />
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2 pb-4 styled-scrollbar">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 flex flex-col items-center gap-3">
                    <Search className="w-8 h-8 text-zinc-700" />
                    <p>No matching commands found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 p-1">
                    {filtered.map((action, idx) => (
                      <button 
                        key={action.id}
                        onClick={() => handleAction(action.message)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group text-left ${
                          idx === 0 
                            ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 shadow-sm' 
                            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent hover:border-zinc-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-1.5 rounded-md ${idx === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300'}`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-[15px]">{action.title}</span>
                        </div>
                        {idx === 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400/60 font-medium">Suggestion</span>
                            <CornerDownLeft className="w-4 h-4 text-indigo-400/50" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded shadow-sm">↑</kbd>
                    <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded shadow-sm">↓</kbd>
                  </span> 
                  navigate
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="bg-zinc-800 px-2 py-0.5 rounded shadow-sm text-[10px] inline-flex items-center">↵</kbd> 
                  select
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="bg-zinc-800 px-2 py-0.5 rounded shadow-sm text-xs">esc</kbd> 
                  close
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
