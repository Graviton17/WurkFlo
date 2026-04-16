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
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#161716] overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Workspace Settings</h1>
      <SettingsForm workspace={result.data} />
    </div>
  );
}
