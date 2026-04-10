"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Kanban,
  List,
  Milestone,
  Tag,
  Inbox,
  ListChecks,
  Settings,
  X,
  CornerDownLeft,
  Hash,
} from "lucide-react";

interface CommandAction {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  group: string;
  href?: string;
  action?: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const ACTIONS: CommandAction[] = [
    {
      id: "board",
      title: "Go to Active Sprint",
      icon: Kanban,
      group: "Navigation",
    },
    { id: "backlog", title: "Go to Backlog", icon: List, group: "Navigation" },
    {
      id: "epics",
      title: "Go to Epics",
      icon: Milestone,
      group: "Navigation",
    },
    {
      id: "releases",
      title: "Go to Releases",
      icon: Tag,
      group: "Navigation",
    },
    {
      id: "inbox",
      title: "Go to Inbox",
      icon: Inbox,
      group: "Navigation",
      href: "/dashboard/inbox",
    },
    {
      id: "my-issues",
      title: "Go to My Issues",
      icon: ListChecks,
      group: "Navigation",
      href: "/dashboard/my-issues",
    },
    {
      id: "create-issue",
      title: "Create new issue",
      icon: Plus,
      group: "Actions",
    },
    {
      id: "settings",
      title: "Open Settings",
      icon: Settings,
      group: "Navigation",
      href: "/profile",
    },
  ];

  const filtered = ACTIONS.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSearch("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
  }, []);

  const executeAction = useCallback(
    (action: CommandAction) => {
      handleClose();
      if (action.href) {
        router.push(action.href);
      }
    },
    [handleClose, router]
  );

  // Listen for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  // Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        executeAction(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [isOpen, filtered, selectedIndex, executeAction]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Group actions
  const groups = filtered.reduce(
    (acc, action) => {
      if (!acc[action.group]) acc[action.group] = [];
      acc[action.group].push(action);
      return acc;
    },
    {} as Record<string, CommandAction[]>
  );

  let globalIdx = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-[560px] bg-[#131315] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/[0.03]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/[0.06]">
              <Search
                size={18}
                className="text-[#555] mr-3 shrink-0"
              />
              <input
                ref={inputRef}
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-[#e0e0e0] placeholder:text-[#444] text-[15px]"
              />
              <button
                onClick={handleClose}
                className="p-1 text-[#555] hover:text-[#aaa] hover:bg-white/5 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="max-h-[50vh] overflow-y-auto py-2 px-2">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-[#444] flex flex-col items-center gap-2.5">
                  <Search size={24} className="text-[#333]" />
                  <p className="text-[13px]">No results found</p>
                </div>
              ) : (
                Object.entries(groups).map(([groupName, actions]) => (
                  <div key={groupName} className="mb-1">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-[#444] uppercase tracking-widest">
                      {groupName}
                    </div>
                    {actions.map((action) => {
                      globalIdx++;
                      const idx = globalIdx;
                      return (
                        <button
                          key={action.id}
                          onClick={() => executeAction(action)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] transition-all text-left group ${
                            idx === selectedIndex
                              ? "bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500/20"
                              : "text-[#888] hover:bg-white/[0.04] hover:text-[#ccc]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-lg ${
                                idx === selectedIndex
                                  ? "bg-indigo-500/20 text-indigo-400"
                                  : "bg-white/[0.04] text-[#666] group-hover:text-[#aaa]"
                              }`}
                            >
                              <action.icon size={15} />
                            </div>
                            <span className="font-medium">{action.title}</span>
                          </div>
                          {idx === selectedIndex && (
                            <CornerDownLeft
                              size={14}
                              className="text-indigo-400/50"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[10px] text-[#444] font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/[0.05] px-1.5 py-0.5 rounded text-[9px]">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/[0.05] px-1.5 py-0.5 rounded text-[9px]">
                  ↵
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-white/[0.05] px-1.5 py-0.5 rounded text-[9px]">
                  esc
                </kbd>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
