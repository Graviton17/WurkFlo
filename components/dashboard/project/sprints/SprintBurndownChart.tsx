"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SprintDailySnapshot, Sprint } from "@/types/index";
import { getSprintBurndownData } from "@/app/actions/sprint.actions";

interface SprintBurndownChartProps {
  sprint: Sprint;
}

export function SprintBurndownChart({ sprint }: SprintBurndownChartProps) {
  const [snapshots, setSnapshots] = useState<SprintDailySnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBurndown();
  }, [sprint.id]);

  const loadBurndown = async () => {
    setIsLoading(true);
    const result = await getSprintBurndownData(sprint.id);
    if (result.success && result.data) {
      setSnapshots(result.data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={18} className="animate-spin text-[#555]" />
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-[#555] gap-2">
        <TrendingDown size={20} className="text-[#444]" />
        <p className="text-[12px]">No burndown data available</p>
      </div>
    );
  }

  // Build chart data
  const totalIssues = snapshots[0]?.total_issues || 0;
  const chartData = snapshots.map((snap, idx) => {
    const remaining = snap.total_issues - snap.completed_issues;
    const remainingPoints = snap.total_points - snap.completed_points;
    // Ideal burndown: linear decrease from total to 0
    const idealRemaining =
      snapshots.length > 1
        ? Math.round(
            totalIssues * (1 - idx / (snapshots.length - 1)),
          )
        : totalIssues;

    return {
      date: new Date(snap.snapshot_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      remaining,
      remainingPoints,
      ideal: idealRemaining,
      completed: snap.completed_issues,
    };
  });

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown size={14} className="text-[#666]" />
        <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wider">
          Burndown Chart
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 rounded bg-[#ff1f1f]" />
            <span className="text-[10px] text-[#666]">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 rounded bg-[#555] opacity-50" />
            <span className="text-[10px] text-[#666]">Ideal</span>
          </div>
        </div>
      </div>

      <div className="h-[180px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#555", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#ccc",
              }}
              labelStyle={{ color: "#888" }}
            />
            {/* Ideal line */}
            <Line
              type="linear"
              dataKey="ideal"
              stroke="#555"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              name="Ideal"
            />
            {/* Actual remaining */}
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#ff1f1f"
              strokeWidth={2}
              dot={{
                fill: "#ff1f1f",
                r: 3,
                stroke: "#ff1f1f",
                strokeWidth: 1,
              }}
              activeDot={{
                r: 5,
                fill: "#ff1f1f",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              name="Remaining"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
