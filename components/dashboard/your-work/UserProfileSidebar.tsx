import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Sparkles } from "lucide-react";

export function UserProfileSidebar() {
  return (
    <div className="w-[300px] flex-shrink-0 border-l border-white/[0.07] bg-[#1e1e21] flex flex-col h-screen sticky top-0 overflow-y-auto hidden lg:flex">
      {/* Banner Image Area */}
      <div className="h-32 w-full bg-[#1c1c1e] relative overflow-hidden">
        {/* Abstract grain/noise texture overlay as banner */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        {/* Edit Button */}
        <button className="absolute top-4 right-4 p-1.5 bg-black/40 hover:bg-black/60 rounded-md text-white/70 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="px-6 relative pb-6 border-b border-white/5">
        <div className="-mt-10 mb-4 inline-block p-1 bg-[#1e1e21] rounded-xl">
          <Avatar className="w-20 h-20 rounded-lg">
            <AvatarFallback className="bg-teal-600 text-white text-2xl font-medium rounded-lg">H</AvatarFallback>
          </Avatar>
        </div>

        <h2 className="text-lg font-semibold text-[#f0f0f0]">Harshi Jain</h2>
        <p className="text-[#888] text-[0.85rem] mb-6">(harshi.r.jain2005)</p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center text-[0.85rem]">
            <span className="text-[#888]">Joined on</span>
            <span className="text-[#f0f0f0]">Mar 30, 2026</span>
          </div>
          <div className="flex justify-between items-center text-[0.85rem]">
            <span className="text-[#888]">Timezone</span>
            <span className="text-[#f0f0f0]">07:36 UTC</span>
          </div>
        </div>

        {/* Workspace selector */}
        <div className="mt-8">
          <button className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded-md transition-colors">
            <div className="flex items-center gap-2 text-[0.85rem] text-[#f0f0f0]">
              <span className="text-amber-500"><Sparkles size={14} /></span>
              <span>Harshi</span>
            </div>
            <ChevronDown size={14} className="text-[#888]" />
          </button>
        </div>
      </div>
    </div>
  );
}
