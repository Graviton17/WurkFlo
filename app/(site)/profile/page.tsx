import { getUserProfileAction } from "@/app/actions/user.actions";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const result = await getUserProfileAction();
  
  if (!result.success || !result.data) {
    redirect("/login");
  }

  return (
    <div className="flex h-full w-full flex-col p-8 text-left bg-[#0c0c0d] overflow-y-auto relative">
      {/* Decorative glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#3c00ff]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10">
        <ProfileForm user={result.data} />
      </div>
    </div>
  );
}
