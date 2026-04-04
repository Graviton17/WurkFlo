import { HardHat } from "lucide-react";

export default function ProjectBoardPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[#161716] min-h-[50vh]">
      <HardHat className="w-12 h-12 text-white/20 mb-4" />
      <h1 className="text-2xl font-semibold tracking-tight text-white/90">Kanban Board</h1>
      <p className="mt-2 text-sm text-white/50 max-w-sm">This view is currently under construction. Check back soon for the full drag-and-drop board experience.</p>
    </div>
  );
}
