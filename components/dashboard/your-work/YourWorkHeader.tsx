import { User } from "lucide-react";

export function YourWorkHeader() {
  return (
    <div className="flex items-center gap-2 px-8 pt-8 pb-4">
      <User size={18} className="text-[#888]" />
      <h1 className="text-lg font-semibold text-[#f0f0f0]">Your work</h1>
    </div>
  );
}
