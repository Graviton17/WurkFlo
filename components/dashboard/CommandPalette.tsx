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
  Loader2,
  Bug,
  BookOpen,
} from "lucide-react";
import { globalSearch, type SearchResults } from "@/app/actions/search.actions";

interface CommandAction {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  group: string;
  href?: string;
  action?: () => void;
}

interface CommandPaletteProps {
  workspaceId?: string | null;
}

export function CommandPalette({ workspaceId }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const STATIC_ACTIONS: CommandAction[] = [
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

  // Build combined actions list from static + search results
  const buildActions = useCallback((): CommandAction[] => {
    const staticFiltered = STATIC_ACTIONS.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase()),
    );

    if (!searchResults || !search.trim()) return staticFiltered;

    const dynamicActions: CommandAction[] = [];

    // Issues from search
    for (const issue of searchResults.issues.slice(0, 5)) {
      dynamicActions.push({
        id: `issue-${issue.id}`,
        title: issue.title,
        subtitle: `${issue.workflow_state?.name || "No status"} · ${issue.priority}`,
        icon: issue.issue_type === "bug" ? Bug : Hash,
        group: "Issues",
      });
    }

    // Projects from search
    for (const project of searchResults.projects.slice(0, 3)) {
      dynamicActions.push({
        id: `project-${project.id}`,
        title: project.name,
        subtitle: project.identifier,
        icon: BookOpen,
        group: "Projects",
        href: `/dashboard/project/${project.id}/board`,
      });
    }

    // Epics from search
    for (const epic of searchResults.epics.slice(0, 3)) {
      dynamicActions.push({
        id: `epic-${epic.id}`,
        title: epic.name,
        subtitle: epic.target_date
          ? `Target: ${new Date(epic.target_date).toLocaleDateString()}`
          : undefined,
        icon: Milestone,
        group: "Epics",
      });
    }

    return [...dynamicActions, ...staticFiltered];
  }, [search, searchResults]);

  const filtered = buildActions();

  // Debounced search
  useEffect(() => {
    if (!isOpen || !search.trim() || !workspaceId) {
      setSearchResults(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await globalSearch(search.trim(), workspaceId);
        if (result.success && result.data) {
          setSearchResults(result.data);
        }
      } catch (err) {
        // Silently fail
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, isOpen, workspaceId]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSearch("");
    setSelectedIndex(0);
    setSearchResults(null);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
    setSearchResults(null);
  }, []);

  const executeAction = useCallback(
    (action: CommandAction) => {
      handleClose();
      if (action.id === "create-issue") {
        window.dispatchEvent(new CustomEvent("open-create-issue", { detail: {} }));
        return;
      }
      if (action.action) {
        action.action();
        return;
      }
      if (action.href) {
        router.push(action.href);
      }
    },
    [handleClose, router],
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
    {} as Record<string, CommandAction[]>,
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
            className="relative w-full max-w-[560px] bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/[0.03]"
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
              {isSearching && (
                <Loader2 size={14} className="animate-spin text-[#555] mr-2" />
              )}
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
                              ? "bg-[#ff1f1f]/10 text-[#ff1f1f] ring-1 ring-[#ff1f1f]/20"
                              : "text-[#888] hover:bg-white/[0.04] hover:text-[#ccc]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 ${
                                idx === selectedIndex
                                  ? "bg-[#ff1f1f]/20 text-[#ff1f1f]"
                                  : "bg-white/[0.04] text-[#666] group-hover:text-[#aaa]"
                              }`}
                            >
                              <action.icon size={15} />
                            </div>
                            <div className="min-w-0">
                              <span className="font-medium block truncate">
                                {action.title}
                              </span>
                              {action.subtitle && (
                                <span className="text-[11px] text-[#555] block truncate">
                                  {action.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                          {idx === selectedIndex && (
                            <CornerDownLeft
                              size={14}
                              className="text-[#ff1f1f]/50 shrink-0"
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
