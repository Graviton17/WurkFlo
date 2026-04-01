-- Industry Standard Atomic Workspace and Project Creation
-- This RPC ensures that a Workspace, its initial Project, and its initial Owner are created in a single ACID transaction.
-- If any part of the creation fails, the entire sub-transaction rolls back.

CREATE OR REPLACE FUNCTION atomic_create_workspace_with_project(
  workspace_name text,
  workspace_identifier text,
  workspace_description text,
  project_name text,
  project_identifier text,
  project_description text,
  owner_id uuid
) RETURNS uuid AS $$
DECLARE
  new_workspace_id uuid;
BEGIN
  -- 1. Create the Workspace
  INSERT INTO public.workspaces (name, slug)
  VALUES (workspace_name, workspace_identifier)
  RETURNING id INTO new_workspace_id;

  -- 2. Associate the Member as an 'owner'
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, owner_id, 'owner');

  -- 3. Create the Initial Project
  INSERT INTO public.projects (name, identifier, description, workspace_id)
  VALUES (project_name, project_identifier, project_description, new_workspace_id);

  -- 4. Return the newly created workspace ID upon success
  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
