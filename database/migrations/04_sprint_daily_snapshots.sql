-- Migration: Create sprint_daily_snapshots table for burndown chart data.
-- Each row represents a point-in-time snapshot of sprint progress on a given day.
-- Snapshots are captured when sprints are started, on state changes, and on completion.

CREATE TABLE IF NOT EXISTS public.sprint_daily_snapshots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sprint_id uuid NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL,
  total_issues integer NOT NULL DEFAULT 0,
  completed_issues integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  completed_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(sprint_id, snapshot_date)
);

-- Index for efficient lookups by sprint
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_sprint_id
  ON public.sprint_daily_snapshots(sprint_id);

-- Index for ordering by date within a sprint
CREATE INDEX IF NOT EXISTS idx_sprint_snapshots_date
  ON public.sprint_daily_snapshots(sprint_id, snapshot_date);
