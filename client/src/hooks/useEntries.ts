import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/utils/supabase";
import { isDemoMode } from "@/lib/demoMode";
import { DEMO_ENTRIES } from "@/lib/demoData";
import type { DailyEntry } from "../interfaces/DailyEntry";

export const useEntries = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch entries query - Direct from Supabase!
  const entriesQuery = useQuery({
    queryKey: ["daily-entries", user?.id],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_ENTRIES;
      } else {
        if (!user?.id) {
          throw new Error("No user found");
        }

        const { data, error } = await supabase
          .from("daily_entries")
          .select("*")
          .order("date", { ascending: false });

        if (error) {
          throw new Error(`Failed to fetch entries: ${error.message}`);
        }

        return data as DailyEntry[];
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Create entry mutation
  const createMutation = useMutation({
    mutationFn: async (formData: {
      date: string;
      goals: string[];
      gains: string[];
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const dateString = formData.date.includes("/")
        ? new Date(formData.date).toISOString().split("T")[0]
        : formData.date;

      if (isDemoMode) {
        return {
          id: `demo-${Date.now()}`,
          date: dateString,
          goals: formData.goals,
          gains: formData.gains,
          created_at: new Date().toISOString(),
          user_id: user.id,
        } satisfies DailyEntry;
      } else {
        const { data, error } = await supabase
          .from("daily_entries")
          .insert({
            date: dateString,
            goals: formData.goals,
            gains: formData.gains,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to create entry: ${error.message}`);
        }

        return data;
      }
    },
    onSuccess: (newEntry) => {
      if (isDemoMode) {
        queryClient.setQueryData<DailyEntry[]>(
          ["daily-entries", user?.id],
          (old) => [newEntry as DailyEntry, ...(old ?? [])]
        );
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["daily-entries"] });
    },
  });

  // Delete entry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isDemoMode) {
        const { error } = await supabase
          .from("daily_entries")
          .delete()
          .eq("id", id);

        if (error) {
          throw new Error(`Failed to delete entry: ${error.message}`);
        }
      }
    },
    onSuccess: (_data, id) => {
      if (isDemoMode) {
        queryClient.setQueryData<DailyEntry[]>(
          ["daily-entries", user?.id],
          (old) => old?.filter((entry) => entry.id !== id)
        );
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["daily-entries"] });
    },
  });

  // Update entry mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      goals,
      gains,
    }: {
      id: string;
      goals: string[];
      gains: string[];
    }) => {
      if (isDemoMode) {
        return { id, goals, gains, updated_at: new Date().toISOString() };
      } else {
        const { data, error } = await supabase
          .from("daily_entries")
          .update({
            goals,
            gains,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update entry: ${error.message}`);
        }

        return data;
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["daily-entries"] });

      const previousEntries = queryClient.getQueryData<DailyEntry[]>([
        "daily-entries",
        user?.id,
      ]);

      queryClient.setQueryData<DailyEntry[]>(
        ["daily-entries", user?.id],
        (old) => {
          if (!old) return old;
          return old.map((entry) =>
            entry.id === variables.id
              ? { ...entry, goals: variables.goals, gains: variables.gains }
              : entry
          );
        }
      );

      return { previousEntries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(
          ["daily-entries", user?.id],
          context.previousEntries
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-entries"] });
    },
  });

  return {
    entries: entriesQuery.data ?? [],
    isLoadingEntries: entriesQuery.isLoading,
    refetchEntries: entriesQuery.refetch,
    createEntry: createMutation.mutateAsync,
    isCreatingEntry: createMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeletingEntry: deleteMutation.isPending,
    updateEntry: updateMutation.mutateAsync,
    isUpdatingEntry: updateMutation.isPending,
  };
};
