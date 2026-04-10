import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
}

export function PageHeader({ icon, title, children }: PageHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 fixed top-[52px] left-[300px] w-[calc(100vw-300px)] bg-[#1a1a1a]/80 backdrop-blur-sm z-40 flex-shrink-0">
        <div className="flex items-center text-[#f0f0f0] font-medium text-[0.95rem] gap-2">
          {icon && <span className="text-[#888]">{icon}</span>}
          <span>{title}</span>
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
      <div className="h-[57px] w-full flex-shrink-0" />
    </>
  );
}
