"use client";

import { useEffect, useState } from "react";
import { CloudSun, Sun, Moon } from "lucide-react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getIcon(hour: number) {
  if (hour < 6 || hour >= 20) return Moon;
  if (hour < 18) return CloudSun;
  return Sun;
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function GreetingSection() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const hour = now ? now.getHours() : 12;
  const greeting = getGreeting(hour);
  const Icon = getIcon(hour);
  const dateStr = now ? formatDateTime(now) : "";

  return (
    <div className="flex flex-col items-center justify-center text-center mt-12 mb-4">
      <h1 className="text-[1.3rem] font-semibold mb-2 tracking-tight">
        {greeting}, Harshi Jain
      </h1>
      <div className="flex items-center gap-2 text-[#888] text-[0.85rem] font-medium">
        <Icon size={16} className="text-amber-100/80" />
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
