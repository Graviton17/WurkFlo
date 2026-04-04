import { redirect } from "next/navigation";
import { workspaceService } from "@/services/index";
import { NewProjectForm } from "@/components/project/index";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await workspaceService.getWorkspaceById(id);

  if (!result.success || !result.data) {
    redirect("/dashboard/workspace");
  }

  return <NewProjectForm workspace={result.data} />;
}
