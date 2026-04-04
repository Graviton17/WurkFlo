import { WorkspaceWithRole } from "@/types/index";
import { WorkspaceCard } from "./WorkspaceCard";

interface WorkspaceGridProps {
  workspaces: WorkspaceWithRole[];
  searchQuery: string;
}

export function WorkspaceGrid({ workspaces, searchQuery }: WorkspaceGridProps) {
  const filtered = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">
          {searchQuery
            ? `No workspaces found for "${searchQuery}"`
            : "You don't have any workspaces yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
