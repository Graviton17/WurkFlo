export function WorkloadSection() {
  const workloads = [
    { label: "Backlog", color: "bg-white", count: 0 },
    { label: "Not started", color: "bg-blue-500", count: 0 },
    { label: "Working on", color: "bg-amber-500", count: 0 },
    { label: "Completed", color: "bg-green-500", count: 0 },
    { label: "Canceled", color: "bg-red-500", count: 0 },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-[1rem] font-medium text-[#f0f0f0] mb-4">Workload</h2>
      <div className="flex flex-wrap items-center gap-4">
        {workloads.map((item) => (
          <div
            key={item.label}
            className="flex flex-col bg-[#222226] border border-white/[0.07] rounded-xl px-4 py-3 min-w-[140px] flex-1"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-[2px] ${item.color}`} />
              <span className="text-[0.8rem] text-[#888]">{item.label}</span>
            </div>
            <span className="text-lg font-semibold text-[#f0f0f0]">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
