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

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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

// --- Issues ---
export const CreateIssueSchema = z.object({
  workspace_id: z.string().uuid({ message: "Valid workspace ID is required" }),
  project_id: z.string().uuid({ message: "Valid project ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  issue_type: z.enum(["task", "bug", "story"]).default("task"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  sprint_id: z.string().uuid().optional().nullable(),
  epic_id: z.string().uuid().optional().nullable(),
  release_id: z.string().uuid().optional().nullable(),
  state_id: z.string().uuid().optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  estimate: z.number().int().optional().nullable(),
  description: z.any().optional().nullable(),
});

export const UpdateIssueSchema = z.object({
  title: z.string().min(1).optional(),
  issue_type: z.enum(["task", "bug", "story"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  sprint_id: z.string().uuid().optional().nullable(),
  epic_id: z.string().uuid().optional().nullable(),
  release_id: z.string().uuid().optional().nullable(),
  state_id: z.string().uuid().optional().nullable(),
  assignee_id: z.string().uuid().optional().nullable(),
  estimate: z.number().int().optional().nullable(),
  description: z.any().optional().nullable(),
});

// --- Search ---
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  workspaceId: z.string().uuid(),
});
