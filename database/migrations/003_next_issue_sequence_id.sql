-- Migration: Create function to atomically generate the next sequence_id for an issue within a project.
-- This avoids race conditions that could occur with MAX(sequence_id) + 1 in application code.

CREATE OR REPLACE FUNCTION public.next_issue_sequence_id(p_project_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  next_id integer;
BEGIN
  -- Lock the issues table rows for this project to prevent concurrent inserts
  -- from generating the same sequence_id
  SELECT COALESCE(MAX(sequence_id), 0) + 1
  INTO next_id
  FROM public.issues
  WHERE project_id = p_project_id
  FOR UPDATE;

  RETURN next_id;
END;
$$;
