/**
 * User interface representing the public.users table
 */
export interface User {
  id: string; // UUID references auth.users(id)
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string; // TIMESTAMP WITH TIME ZONE
}
