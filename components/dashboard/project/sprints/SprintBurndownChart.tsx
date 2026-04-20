"use client";

import { useState, useEffect, useMemo } from "react";
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

type BurndownMode = "points" | "issues";

/**
 * Generate an array of ISO date strings (YYYY-MM-DD) from start to end, inclusive.
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Format YYYY-MM-DD → "Apr 12" style label.
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SprintBurndownChart({ sprint }: SprintBurndownChartProps) {
  const [snapshots, setSnapshots] = useState<SprintDailySnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<BurndownMode>("points");

  useEffect(() => {
    loadBurndown();
  }, [sprint.id]);

  const loadBurndown = async () => {
    setIsLoading(true);
    const result = await getSprintBurndownData(sprint.id);
    if (result.success && result.data) {
      setSnapshots(result.data);
      // Auto-select: use points if any issue has estimates, fallback to issue count
      const hasPoints = result.data.some((s) => s.total_points > 0);
      setMode(hasPoints ? "points" : "issues");
    }
    setIsLoading(false);
  };

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const chartData = useMemo(() => {
    if (snapshots.length === 0) {
      return [];
    }

    // ── 1. Determine timeline boundaries ──
    // Use sprint dates if available, otherwise fall back to snapshot date range
    const firstSnapDate = snapshots[0].snapshot_date;
    const lastSnapDate = snapshots[snapshots.length - 1].snapshot_date;

    const startDate = sprint.start_date || firstSnapDate;
    const endDate = sprint.end_date || lastSnapDate;

    // ── 2. Build the full sprint timeline ──
    const allDates = generateDateRange(startDate, endDate);
    const totalDays = allDates.length;

    // ── 2. Index snapshots by date for O(1) lookup ──
    const snapshotMap = new Map<string, SprintDailySnapshot>();
    for (const snap of snapshots) {
      snapshotMap.set(snap.snapshot_date, snap);
    }

    // ── 3. Initial scope from the first snapshot (day the sprint started) ──
    const firstSnap = snapshots[0];
    const initialTotal =
      mode === "points" ? firstSnap.total_points : firstSnap.total_issues;

    // ── 4. Build data points for every day in the timeline ──
    let lastKnownSnap = firstSnap;

    return allDates.map((date, idx) => {
      const snap = snapshotMap.get(date);
      if (snap) lastKnownSnap = snap;

      // Future days (active sprint, no data yet)
      const isFuture = sprint.status === "active" && date > today;

      const totalScope =
        mode === "points"
          ? lastKnownSnap.total_points
          : lastKnownSnap.total_issues;
      const completed =
        mode === "points"
          ? lastKnownSnap.completed_points
          : lastKnownSnap.completed_issues;
      const remaining = totalScope - completed;

      // Ideal trend: straight diagonal from initialTotal → 0
      const ideal =
        totalDays > 1
          ? Math.round(initialTotal * (1 - idx / (totalDays - 1)))
          : 0;

      return {
        date: formatDateLabel(date),
        rawDate: date,
        remaining: isFuture ? undefined : remaining,
        ideal,
        totalScope: isFuture ? undefined : totalScope,
      };
    });
  }, [snapshots, sprint, mode, today]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={18} className="animate-spin text-[#555]" />
      </div>
    );
  }

  // ── Empty state ──
  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-[#555] gap-2">
        <TrendingDown size={20} className="text-[#444]" />
        <p className="text-[12px]">No burndown data available yet</p>
        {sprint.status === "active" && (
          <p className="text-[10px] text-[#444]">
            Data will appear as issues are completed
          </p>
        )}
      </div>
    );
  }

  // Today label for the reference line
  const todayLabel = formatDateLabel(today);

  // Calculate the X-axis tick interval to avoid crowding
  const tickInterval = Math.max(0, Math.floor(chartData.length / 7));

  return (
    <div className="px-5 py-4">
      {/* ── Header row ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <TrendingDown size={14} className="text-[#666]" />
        <span className="text-[12px] font-semibold text-[#888] uppercase tracking-wider">
          Burndown Chart
        </span>

        {/* Points / Issues toggle */}
        <div className="flex items-center gap-0.5 ml-3 bg-white/[0.03] rounded-lg border border-white/[0.06] p-0.5">
          <button
            onClick={() => setMode("points")}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${
              mode === "points"
                ? "bg-white/[0.08] text-[#ccc]"
                : "text-[#555] hover:text-[#888]"
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setMode("issues")}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${
              mode === "issues"
                ? "bg-white/[0.08] text-[#ccc]"
                : "text-[#555] hover:text-[#888]"
            }`}
          >
            Issues
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 rounded bg-[#3b82f6]" />
            <span className="text-[10px] text-[#666]">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 rounded bg-[#555] opacity-50" />
            <span className="text-[10px] text-[#666]">Ideal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-0.5 rounded bg-amber-500/50" />
            <span className="text-[10px] text-[#666]">Scope</span>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="h-[200px] -ml-2">
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
              interval={tickInterval}
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
              formatter={(value: any, name: any) => {
                if (value === undefined || value === null) return ["-", name];
                const labels: Record<string, string> = {
                  remaining: `Remaining ${mode === "points" ? "Points" : "Issues"}`,
                  ideal: "Ideal",
                  totalScope: "Total Scope",
                };
                return [value, labels[name as string] || name];
              }}
            />

            {/* Today marker — active sprints only */}
            {sprint.status === "active" && (
              <ReferenceLine
                x={todayLabel}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "#666",
                  fontSize: 10,
                }}
              />
            )}

            {/* Ideal trend line: start_date total → 0 on end_date */}
            <Line
              type="linear"
              dataKey="ideal"
              stroke="#555"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
              name="ideal"
              connectNulls
            />

            {/* Total scope line — spikes up on scope creep */}
            <Line
              type="stepAfter"
              dataKey="totalScope"
              stroke="rgba(245,158,11,0.4)"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="totalScope"
              connectNulls
            />

            {/* Actual remaining work */}
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{
                fill: "#3b82f6",
                r: 2.5,
                stroke: "#3b82f6",
                strokeWidth: 1,
              }}
              activeDot={{
                r: 5,
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              name="remaining"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
