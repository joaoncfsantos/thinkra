import supabase from "../utils/supabase";

export async function getDailyEntries() {
  const { data, error } = await supabase
    .from("daily_entries")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(`Failed to get daily entries: ${error.message}`);
  }

  return data;
}

export async function createDailyEntry(
  date: string,
  goals: string[],
  gains: string[]
) {
  const { data, error } = await supabase.from("daily_entries").insert({
    date,
    goals,
    gains,
  });

  if (error) {
    console.error("Error saving daily entry:", error);
    throw new Error(`Failed to save daily entry: ${error.message}`);
  }

  return data;
}

export async function deleteDailyEntry(id: string) {
  const { data, error } = await supabase
    .from("daily_entries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting daily entry:", error);
    throw new Error(`Failed to delete daily entry: ${error.message}`);
  }

  return data;
}
