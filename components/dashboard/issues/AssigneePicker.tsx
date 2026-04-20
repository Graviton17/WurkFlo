"use client";

import { useState, useEffect, useRef } from "react";
import { User2, Search, X, Check, Loader2 } from "lucide-react";
import { getWorkspaceMembersAction } from "@/app/actions/workspace.actions";

export interface MemberInfo {
  user_id: string;
  role: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface AssigneePickerProps {
  workspaceId: string;
  selectedUserId: string | null;
  onSelect: (userId: string | null) => void;
  /** Compact mode renders inline instead of full button */
  compact?: boolean;
}

export function AssigneePicker({
  workspaceId,
  selectedUserId,
  onSelect,
  compact = false,
}: AssigneePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Calculate position when opening — clamp so dropdown never overflows right edge
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 260;
      const margin = 8;
      const clampedLeft = Math.min(
        rect.left,
        window.innerWidth - dropdownWidth - margin,
      );
      setDropdownStyle({
        position: "fixed",
        top: `${rect.bottom + 4}px`,
        left: `${Math.max(margin, clampedLeft)}px`,
        width: `${dropdownWidth}px`,
      });
    }
  }, [isOpen]);

  // Fetch members lazily on first open
  const handleOpen = async () => {
    setIsOpen((prev) => !prev);
    if (members.length === 0 && !isLoading) {
      setIsLoading(true);
      try {
        const result = await getWorkspaceMembersAction(workspaceId);
        if (result.success && result.data) {
          setMembers(result.data);
        }
      } catch {
        // silently fail — empty list shown
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectedMember = members.find((m) => m.user_id === selectedUserId);

  const filteredMembers = searchQuery
    ? members.filter(
        (m) =>
          (m.full_name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (m.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : members;

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      {compact ? (
        <button
          type="button"
          ref={buttonRef}
          onClick={handleOpen}
          className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888] hover:border-white/[0.12] hover:text-white transition-all cursor-pointer w-full"
        >
          {selectedMember ? (
            <>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/80 shrink-0">
                {getInitials(selectedMember.full_name)}
              </div>
              <span className="truncate">
                {selectedMember.full_name || selectedMember.email}
              </span>
            </>
          ) : (
            <>
              <User2 size={13} className="shrink-0" />
              <span>Unassigned</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          ref={buttonRef}
          onClick={handleOpen}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs transition-colors ${
            selectedUserId
              ? "bg-indigo-500/[0.08] border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/[0.12]"
              : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-[#a0a0a0]"
          }`}
        >
          {selectedMember ? (
            <>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/80">
                {getInitials(selectedMember.full_name)}
              </div>
              {selectedMember.full_name?.split(" ")[0] || "Assigned"}
            </>
          ) : (
            <>
              <User2 size={13} />
              Assignees
            </>
          )}
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div style={dropdownStyle} className="z-[100] bg-[#141414] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
            <Search size={13} className="text-[#555] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              autoFocus
              className="flex-1 bg-transparent text-[12px] text-white placeholder:text-[#555] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#555] hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[200px] overflow-y-auto py-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-[#555]" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="px-3 py-4 text-[12px] text-[#555] text-center">
                {searchQuery ? "No matching members" : "No members found"}
              </div>
            ) : (
              <>
                {/* Unassign option */}
                <button
                  onClick={() => {
                    onSelect(null);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.04] transition-colors ${
                    !selectedUserId ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#222] border border-white/10 flex items-center justify-center">
                    <User2 size={12} className="text-[#555]" />
                  </div>
                  <span className="text-[12px] text-[#999] flex-1">
                    Unassigned
                  </span>
                  {!selectedUserId && (
                    <Check size={13} className="text-emerald-400 shrink-0" />
                  )}
                </button>

                {/* Members */}
                {filteredMembers.map((member) => (
                  <button
                    key={member.user_id}
                    onClick={() => {
                      onSelect(member.user_id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.04] transition-colors ${
                      selectedUserId === member.user_id
                        ? "bg-white/[0.03]"
                        : ""
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/80 shrink-0">
                      {getInitials(member.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#ccc] font-medium truncate">
                        {member.full_name || "Unnamed"}
                      </p>
                      {member.email && (
                        <p className="text-[10px] text-[#555] truncate">
                          {member.email}
                        </p>
                      )}
                    </div>
                    {selectedUserId === member.user_id && (
                      <Check
                        size={13}
                        className="text-emerald-400 shrink-0"
                      />
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
