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
        {children}
      </div>
    </div>
  );
}
