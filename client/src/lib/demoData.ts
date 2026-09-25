import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { DailyEntry } from "@/interfaces/DailyEntry";

const dayOffset = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

export const DEMO_USER = {
  id: "demo-user",
  email: "demo@thinkra.app",
  user_metadata: { name: "Demo" },
} as unknown as SupabaseUser;

export const DEMO_ENTRIES: DailyEntry[] = [
  {
    id: "demo-1",
    date: dayOffset(0),
    goals: ["Finish the Thinkra walkthrough", "Go for a 20 minute walk"],
    gains: ["Shipped the calendar view", "Had a great workout"],
    created_at: new Date().toISOString(),
    user_id: DEMO_USER.id,
  },
  {
    id: "demo-2",
    date: dayOffset(-1),
    goals: ["Review open pull requests", "Plan next week"],
    gains: ["Fixed the login bug", "Read for 30 minutes"],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: DEMO_USER.id,
  },
];
