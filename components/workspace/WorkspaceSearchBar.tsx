"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WorkspaceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function WorkspaceSearchBar({ value, onChange }: WorkspaceSearchBarProps) {
  return (
    <div className="relative w-full max-w-xs">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={14}
      />
      <Input
        type="text"
        placeholder="Search for a workspace"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-8 text-sm bg-secondary border-border/60 placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
