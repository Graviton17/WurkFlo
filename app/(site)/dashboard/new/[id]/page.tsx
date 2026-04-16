import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWorkspaceByIdAction } from "@/app/actions/workspace.actions";
import { NewProjectForm } from "@/components/project/index";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getWorkspaceByIdAction(id);

  if (!result.success || !result.data) {
    redirect("/dashboard/workspace");
  }

  return <NewProjectForm workspace={result.data} />;
}
