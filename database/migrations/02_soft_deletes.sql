-- Phase III: Soft Deletes Migration
-- Alters core tables to support soft deletion, preventing hard data loss and preserving relationships.

-- 1. Add deleted_at columns
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.workflow_states ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

-- 2. Create index on deleted_at to speed up filtering on massive tables
CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON public.workspaces(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON public.projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_workflow_states_deleted_at ON public.workflow_states(deleted_at);
