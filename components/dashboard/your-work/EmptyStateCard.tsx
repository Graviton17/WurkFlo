import { Copy } from "lucide-react";

interface EmptyStateCardProps {
  title: string;
  message?: string;
  className?: string;
}

export function EmptyStateCard({ title, message = "No work item assigned yet", className = "" }: EmptyStateCardProps) {
  return (
    <div className={`flex flex-col mb-8 ${className}`}>
      <h2 className="text-[1rem] font-medium text-[#f0f0f0] mb-4">{title}</h2>
      <div className="bg-[#222226] border border-white/[0.07] rounded-xl h-[180px] flex flex-col items-center justify-center">
        {/* Layered icons styling to match image empty state */}
        <div className="relative mb-4 opacity-50 flex items-center justify-center">
          <div className="absolute transform -translate-x-2 translate-y-2 bg-[#2a2a2e] border border-white/10 rounded-lg p-2 w-12 h-12 flex items-center justify-center z-0"></div>
          <div className="relative bg-[#303036] border border-white/10 rounded-lg p-2 w-12 h-12 flex items-center justify-center z-10">
            <Copy size={24} className="text-[#888]" />
          </div>
        </div>
        <span className="text-[0.85rem] text-[#888]">{message}</span>
      </div>
    </div>
  );
}
