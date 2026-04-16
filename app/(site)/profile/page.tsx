import { getUserProfileAction } from "@/app/actions/user.actions";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const result = await getUserProfileAction();
  
  if (!result.success || !result.data) {
    redirect("/login");
  }

  return (
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#161716] overflow-y-auto">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-6">Profile Settings</h1>
      <ProfileForm user={result.data} />
    </div>
  );
}
