import { getWorkspaceMembersAction } from "@/app/actions/workspace.actions";
import { TeamList } from "@/components/workspace/team-list";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getWorkspaceMembersAction(resolvedParams.id);
  
  const members = result.success && result.data ? result.data : [];

  return (
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#161716] overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Team</h1>
      <TeamList members={members} />
    </div>
  );
}
