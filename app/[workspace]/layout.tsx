import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
}) {
  const { workspace } = await params;
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e5e7eb] selection:bg-[#ff1f1f]/30">

      {/* Fixed Top Navbar — spans full width */}
      <TopNavbar workspaceSlug={workspace} />

      {/* Fixed Sidebar — sits below navbar */}
      <Sidebar workspaceSlug={workspace} />

      {/* Main Content — offset to clear fixed navbar + sidebar */}
      <main className="pt-[52px] pl-[300px] min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
        {/* Background ambient light */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ff1f1f]/[0.015] rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
