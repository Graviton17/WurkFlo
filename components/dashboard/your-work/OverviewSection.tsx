import { BookOpen, User, Inbox } from "lucide-react";

export function OverviewSection() {
  return (
    <div className="mb-8">
      <h2 className="text-[1rem] font-medium text-[#f0f0f0] mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-[#222226] border border-white/[0.07] rounded-xl p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-2 text-[#888]">
            <BookOpen size={16} />
            <span className="text-[0.8rem]">Work items created</span>
          </div>
          <div className="text-xl font-semibold text-[#f0f0f0]">0</div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#222226] border border-white/[0.07] rounded-xl p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-2 text-[#888]">
            <User size={16} />
            <span className="text-[0.8rem]">Work items assigned</span>
          </div>
          <div className="text-xl font-semibold text-[#f0f0f0]">0</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#222226] border border-white/[0.07] rounded-xl p-4 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-2 text-[#888]">
            <Inbox size={16} />
            <span className="text-[0.8rem]">Work items subscribed</span>
          </div>
          <div className="text-xl font-semibold text-[#f0f0f0]">0</div>
        </div>
      </div>
    </div>
  );
}
