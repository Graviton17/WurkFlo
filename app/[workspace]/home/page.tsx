import { HomeHeader } from "@/components/dashboard/home/HomeHeader";
import { GreetingSection } from "@/components/dashboard/home/GreetingSection";
import { QuicklinksSection } from "@/components/dashboard/home/QuicklinksSection";
import { RecentsSection } from "@/components/dashboard/home/RecentsSection";

export default function WorkspaceHomePage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#1a1a1a] text-[#f0f0f0] overflow-y-auto w-full">
      <HomeHeader />

      <div className="max-w-[900px] w-full mx-auto px-6 py-12 flex flex-col gap-10">
        <GreetingSection />

        <div className="grid grid-cols-1 gap-10">
          <QuicklinksSection />
          <RecentsSection />
        </div>
      </div>
    </div>
  );
}
