import { User, Mail, Calendar } from "lucide-react";
import { type User as UserType } from "@/types/index";

export function ProfileInfoDisplay({ data }: { data: UserType }) {
  const joinDate = data.created_at 
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(data.created_at)) 
    : "Unknown";

  return (
    <div className="w-full rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-6 backdrop-blur-md shadow-xl flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
          <User size={16} className="text-white/40" />
          Account Info
        </h3>
        <p className="text-xs text-white/40">Read-only system information.</p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">Account ID</span>
          <span className="text-sm font-mono text-white/70 truncate" title={data.id}>{data.id}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">Contact Email</span>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Mail size={14} className="text-white/40" />
            <span className="truncate">{data.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">Member Since</span>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar size={14} className="text-white/40" />
            <span>{joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
