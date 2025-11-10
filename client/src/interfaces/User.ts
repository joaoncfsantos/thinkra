import type { User as SupabaseUser } from "@supabase/supabase-js";

export type User = SupabaseUser;

// Helper to get user name from metadata
export function getUserName(user: User | null): string {
  return user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
}
