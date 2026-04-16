import { redirect } from "next/navigation";
import { getWorkspaceByIdAction } from "@/app/actions/workspace.actions";
import { SettingsForm } from "@/components/workspace/settings-form";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getWorkspaceByIdAction(resolvedParams.id);

  if (!result.success || !result.data) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#0c0c0d] overflow-y-auto relative">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10">
        <SettingsForm workspace={result.data} />
      </div>
    </div>
  );
}
