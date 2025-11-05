export interface DailyEntry {
  id: string;
  date: string;
  goals: string[];
  gains: string[];
  created_at: string;
  updated_at?: string;
  user_id: string;
}
