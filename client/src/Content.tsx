import { useRef, useState } from "react";
import { DailyCard } from "./components/DailyCard";
import { EntryFormModal } from "./components/Modals/Entries/EntryFormModal";
import { DeleteConfirmationModal } from "./components/Modals/Entries/DeleteConfirmationModal";
import LandingPage from "./LandingPage";

import { Button } from "./components/ui/button";
import { NotebookPen } from "lucide-react";
import { Spinner } from "./components/ui/shadcn-io/spinner";
import Calendar from "./Calendar";

import { toast } from "sonner";
import { useAuth } from "./context/AuthContext";
import { motion } from "motion/react";
import { useEntries } from "./hooks/useEntries";
import { isDemoMode } from "@/lib/demoMode";

function Content() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const { user, session, loading } = useAuth(); // Get session for API calls
  const {
    entries: dailyEntries,
    isLoadingEntries,
    //refetchEntries,
    createEntry,
    isCreatingEntry,
    deleteEntry,
    updateEntry,
  } = useEntries();

  const handleAudioSubmission = async (audioBlob: Blob) => {
    if (isDemoMode) {
      toast.error("Voice transcription isn't available in the demo.");
      setIsModalOpen(false);
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsTranscribing(true);

    try {
      const fd = new FormData();
      fd.append("audio", audioBlob, "recording.webm");
      const API_URL = import.meta.env.VITE_API_URL;
      const r = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: fd,
      });

      if (!r.ok) {
        const error = await r.json();
        throw new Error(error.error || "Server error");
      }

      const data = await r.json();

      const hasValidGoals =
        data.result.goals &&
        data.result.goals.length > 0 &&
        data.result.goals.some((goal: string) => goal.trim() !== "");
      const hasValidGains =
        data.result.gains &&
        data.result.gains.length > 0 &&
        data.result.gains.some((gain: string) => gain.trim() !== "");

      if (!hasValidGoals && !hasValidGains) {
        toast.error(
          "No goals or gains were found in the recording. Please try recording again with clearer content about your goals and gains."
        );
        setIsModalOpen(false);
        return;
      }

      // Create entry directly through Supabase
      await createEntry({
        date: new Date().toISOString().split("T")[0],
        goals: data.result.goals || [],
        gains: data.result.gains || [],
      });

      setIsModalOpen(false);
      toast.success("Entry created successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to transcribe audio"
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCreateDailyEntry = async (
    formData: {
      date: string;
      goals: string[];
      gains: string[];
    },
    closeModal: boolean = true
  ) => {
    try {
      await createEntry(formData);

      if (closeModal) {
        setIsModalOpen(false);
      }

      toast.success("Entry created successfully!");
    } catch (error) {
      console.error("Failed to create entry:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create entry"
      );
      throw error;
    }
  };

  const handleDeleteRequest = (id: string) => {
    setEntryToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      await deleteEntry(entryToDelete);
      toast.success("Entry deleted successfully!");
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast.error("Failed to delete entry");
    } finally {
      setEntryToDelete(null);
    }
  };

  const handleUpdateDailyEntry = async (
    id: string,
    newGoals: string[],
    newGains: string[]
  ) => {
    try {
      await updateEntry({
        id,
        goals: newGoals,
        gains: newGains,
      });
      toast.success("Entry updated successfully!");
    } catch (error) {
      toast.error("Failed to update entry");
      throw error;
    }
  };

  if (loading) {
    return <></>;
  }

  const datesWithEntries = dailyEntries.map((e) => new Date(e.date));

  const filteredEntries =
    selectedDates.length > 0
      ? dailyEntries.filter((entry) =>
          selectedDates.some(
            (selectedDate) =>
              new Date(entry.date).toDateString() ===
              selectedDate.toDateString()
          )
        )
      : dailyEntries;

  const handleDateSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates || []);
  };

  return user ? (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-1 space-y-6">
          <motion.div
            className="flex items-center justify-between flex-col sm:flex-row gap-0 text-center sm:text-left"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Good{" "}
                {new Date().getHours() < 12
                  ? "Morning,"
                  : new Date().getHours() < 18
                  ? "Afternoon,"
                  : "Evening,"}
                {" " +
                  (user?.user_metadata?.name
                    ? `${user.user_metadata.name}`
                    : "")}
              </h2>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Here's your progress for today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={isCreatingEntry}
                className="h-10 gap-2 rounded-full px-4 hidden sm:flex"
              >
                {isCreatingEntry ? (
                  <Spinner variant="circle" className="h-4 w-4" />
                ) : (
                  <>
                    <NotebookPen className="h-4 w-4" />
                    <span>New Entry</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isCreatingEntry}
            className="h-10 gap-2 rounded-full px-4 fixed bottom-4 right-4 z-10 sm:hidden"
          >
            {isCreatingEntry ? (
              <Spinner variant="circle" className="h-4 w-4" />
            ) : (
              <>
                <NotebookPen className="h-4 w-4" />
                <span>New Entry</span>
              </>
            )}
          </Button>

          <div className="space-y-4">
            {isLoadingEntries ? (
              <div className="flex justify-center items-center py-12">
                <Spinner
                  variant="circle"
                  className="h-8 w-8 text-muted-foreground"
                />
              </div>
            ) : filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <DailyCard
                    date={entry.date}
                    goals={entry.goals}
                    gains={entry.gains}
                    id={entry.id}
                    onDelete={handleDeleteRequest}
                    onUpdate={(newGoals, newGains) =>
                      handleUpdateDailyEntry(entry.id, newGoals, newGains)
                    }
                  />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 py-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <NotebookPen className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  No entries found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                  {selectedDates.length > 0
                    ? "Try selecting a different date or clearing the filter."
                    : "Start by capturing your daily gains and goals using the button above."}
                </p>
                {selectedDates.length > 0 && (
                  <Button
                    variant="link"
                    onClick={() => setSelectedDates([])}
                    className="mt-2 text-blue-600 dark:text-blue-400"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden w-full max-w-[320px] shrink-0 md:block">
          <div className="sticky top-24 space-y-6">
            <Calendar
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              handleDateSelect={handleDateSelect}
              datesWithEntries={datesWithEntries}
            />
          </div>
        </div>
      </div>

      <EntryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateDailyEntry}
        handleAudioSubmission={handleAudioSubmission}
        isTranscribing={isTranscribing}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
      />
    </div>
  ) : (
    <LandingPage />
  );
}

export default Content;
