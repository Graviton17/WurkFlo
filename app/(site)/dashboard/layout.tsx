import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#161716]">
      <DashboardNavbar initialUser={user} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
