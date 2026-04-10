import { YourWorkHeader } from "@/components/dashboard/your-work/YourWorkHeader";
import { YourWorkTabs } from "@/components/dashboard/your-work/YourWorkTabs";
import { OverviewSection } from "@/components/dashboard/your-work/OverviewSection";
import { WorkloadSection } from "@/components/dashboard/your-work/WorkloadSection";
import { EmptyStateCard } from "@/components/dashboard/your-work/EmptyStateCard";
import { UserProfileSidebar } from "@/components/dashboard/your-work/UserProfileSidebar";
import { HelpCircle } from "lucide-react";

export default function YourWorkPage() {
  return (
    <div className="flex h-full w-full bg-[#1a1a1a] text-[#f0f0f0]">
      {/* Main Content Area (Left side) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <YourWorkHeader />

        <YourWorkTabs>
          {/* Summary Tab Content */}
          <div className="max-w-[1200px]">
            <OverviewSection />
            <WorkloadSection />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <EmptyStateCard title="Work items by Priority" />
              <EmptyStateCard title="Work items by state" />
            </div>

            <div className="mt-8 mb-12">
              <EmptyStateCard
                title="Recent activity"
                message="No Data yet"
                className="mb-0"
              />
            </div>
          </div>
        </YourWorkTabs>

        {/* Floating Help Button (Bottom Right of Left Content) */}
        <button className="fixed bottom-6 right-8 lg:right-[320px] p-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-[#888] rounded-md border border-white/10 transition-colors shadow-lg z-50">
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Profile Sidebar (Right side) */}
      <UserProfileSidebar />
    </div>
  );
}
