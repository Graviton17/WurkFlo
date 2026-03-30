-- Industry Standard Atomic Workspace Creation
-- This RPC ensures that a Workspace and its initial Owner are created in a single ACID transaction.
-- If the workspace creation succeeds but the member association fails, the entire sub-transaction rolls back.
-- Preventing orphaned workspaces in the database.

CREATE OR REPLACE FUNCTION atomic_create_workspace(
  workspace_name text,
  workspace_identifier text,
  workspace_description text,
  owner_id uuid
) RETURNS uuid AS $$
DECLARE
  new_workspace_id uuid;
BEGIN
  -- 1. Create the Workspace
  INSERT INTO public.workspaces (name, identifier, description)
  VALUES (workspace_name, workspace_identifier, workspace_description)
  RETURNING id INTO new_workspace_id;

  -- 2. Associate the Member as an 'owner'
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, owner_id, 'owner');

  -- 3. Return the newly created workspace ID upon success
  RETURN new_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
