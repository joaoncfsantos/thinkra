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

export async function updateDailyEntry(
  id: string,
  newGoals: string[],
  newGains: string[]
) {
  // First, get the current entry
  const { data: currentEntry, error: fetchError } = await supabase
    .from("daily_entries")
    .select("goals, gains")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching current entry:", fetchError);
    throw new Error(`Failed to fetch current entry: ${fetchError.message}`);
  }

  if (!currentEntry) {
    throw new Error("Entry not found");
  }

  // Clean and compare arrays
  const cleanArray = (arr: string[]) =>
    arr.filter((item) => item.trim() !== "");
  const arraysEqual = (a: string[], b: string[]) => {
    const cleanA = cleanArray(a);
    const cleanB = cleanArray(b);
    return (
      cleanA.length === cleanB.length &&
      cleanA.every((val, index) => val === cleanB[index])
    );
  };

  const goalsChanged = !arraysEqual(currentEntry.goals || [], newGoals);
  const gainsChanged = !arraysEqual(currentEntry.gains || [], newGains);

  // Return early if no changes detected
  if (!goalsChanged && !gainsChanged) {
    return {
      data: currentEntry,
      modified: false,
      message: "No changes detected",
    };
  }

  // Perform the update
  const { data, error } = await supabase
    .from("daily_entries")
    .update({
      goals: cleanArray(newGoals),
      gains: cleanArray(newGains),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating daily entry:", error);
    throw new Error(`Failed to update daily entry: ${error.message}`);
  }

  return {
    data: data?.[0],
    modified: true,
    message: "Entry updated successfully",
  };
}
