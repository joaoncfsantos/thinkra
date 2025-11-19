import { useRef, useState } from "react";
import { DailyCard } from "./components/DailyCard";
import { EntryFormModal } from "./components/Modals/Entries/EntryFormModal";
import { DeleteConfirmationModal } from "./components/Modals/Entries/DeleteConfirmationModal";
import LandingPage from "./LandingPage";

import { Button } from "./components/ui/button";
import { NotebookPen, RefreshCcw } from "lucide-react";
import { Spinner } from "./components/ui/shadcn-io/spinner";
import Calendar from "./Calendar";

import { toast } from "sonner";
import { useAuth } from "./context/AuthContext";
import { motion } from "motion/react";
import { resetViewport } from "./utils/utils";
import { useEntries } from "./hooks/useEntries";

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

  const handleRefreshEntries = async () => {
    window.location.reload();
    resetViewport();
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
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="flex flex-row gap-6 w-full">
        <div className="flex flex-col gap-2 flex-1">
          <motion.div
            className="px-1 w-full flex flex-row items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
          >
            <p className="text-2xl font-bold text-black dark:text-white">
              Hi{user ? `, ${user.user_metadata.name}` : ""}!
            </p>
            <div className="flex flex-row items-center justify-end gap-2 ">
              <Button
                onClick={() => handleRefreshEntries()}
                disabled={isCreatingEntry}
              >
                <RefreshCcw className="size-4" />
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={isCreatingEntry}
              >
                {isCreatingEntry ? (
                  <Spinner variant="circle" className="h-4 w-4" />
                ) : (
                  <NotebookPen className="size-4" />
                )}
              </Button>
            </div>
          </motion.div>
          {isLoadingEntries ? (
            <div className="flex justify-center items-center py-8">
              <Spinner
                variant="circle"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <motion.div
                className="mb-4"
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
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
            <div className="text-muted-foreground text-center text-sm py-4">
              {selectedDates.length > 0
                ? "No entries found for this date."
                : "No entries found. Start by creating a new entry!"}
            </div>
          )}
        </div>
        <div className="hidden sm:flex">
          <Calendar
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            handleDateSelect={handleDateSelect}
            datesWithEntries={datesWithEntries}
          />
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
