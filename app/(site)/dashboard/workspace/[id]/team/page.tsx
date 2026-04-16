import { getWorkspaceMembersAction } from "@/app/actions/workspace.actions";
import { TeamList } from "@/components/workspace/team-list";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getWorkspaceMembersAction(resolvedParams.id);
  
  const members = result.success && result.data ? result.data : [];

  return (
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#0c0c0d] overflow-y-auto relative">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#3c00ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10">
        <TeamList members={members} />
      </div>
    </div>
  );
}
