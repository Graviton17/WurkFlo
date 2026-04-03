import { z } from "zod";

// --- Users ---
export const UpdateUserSchema = z.object({
  full_name: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
});

export const CreateUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// --- Workspaces ---
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required" }),
  slug: z.string()
    .min(1, { message: "Workspace slug is required" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug must contain only lowercase letters, numbers, and hyphens" }),
});

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.partial();

// --- Workspace Members ---
export const WorkspaceMemberRoleSchema = z.enum(["owner", "admin", "member", "guest"]);

export const AddWorkspaceMemberSchema = z.object({
  userId: z.string().uuid({ message: "Valid user ID (UUID) is required" }),
  role: WorkspaceMemberRoleSchema.default("member"),
});

export const UpdateWorkspaceMemberRoleSchema = z.object({
  role: WorkspaceMemberRoleSchema,
});

// --- Projects ---
export const CreateProjectSchema = z.object({
  workspace_id: z.string().uuid({ message: "Valid workspace ID (UUID) is required" }),
  name: z.string().min(1, { message: "Project name is required" }),
  identifier: z.string().min(1, { message: "Project identifier is required" }),
  description: z.string().optional().nullable(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }).optional(),
  identifier: z.string().min(1, { message: "Project identifier is required" }).optional(),
  description: z.string().optional().nullable(),
});

// --- Workflow States ---
export const StateCategoryEnumSchema = z.enum(["todo", "in_progress", "done"]);

export const CreateWorkflowStateSchema = z.object({
  name: z.string().min(1, { message: "State name is required" }),
  position: z.number(),
  category: StateCategoryEnumSchema,
});

export const UpdateWorkflowStateSchema = CreateWorkflowStateSchema.partial();
