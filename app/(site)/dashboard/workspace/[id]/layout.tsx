import { WorkspaceSidebar } from "@/components/workspace";

export default async function WorkspaceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 w-full relative">
      <WorkspaceSidebar workspaceId={id} />
      <div className="flex-1 min-w-0">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#1d4ed8]/20 rounded-full blur-[120px] pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
