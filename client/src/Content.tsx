import { useEffect, useRef, useState } from "react";
import { DailyCard } from "./components/DailyCard";
import { EntryFormModal } from "./components/Modals/Entries/EntryFormModal";
import { DeleteConfirmationModal } from "./components/Modals/Entries/DeleteConfirmationModal";
import LandingPage from "./LandingPage";

import type { DailyEntry } from "./interfaces/DailyEntry";
import { Button } from "./components/ui/button";
import { NotebookPen } from "lucide-react";
import { Spinner } from "./components/ui/shadcn-io/spinner";

import { toast } from "sonner";
import { useAuth } from "./context/AuthContext";
import { motion } from "motion/react";

function Content() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

  const [isCreatingEntry, setIsCreatingEntry] = useState(false);

  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user?.token) {
      console.log("No token found");
      return;
    }

    setIsLoadingEntries(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/daily-entry`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setDailyEntries(data as DailyEntry[]);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

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

      await handleCreateDailyEntry(
        {
          date: new Date().toISOString().split("T")[0],
          goals: data.result.goals || [],
          gains: data.result.gains || [],
        },
        true
      );
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
    setIsCreatingEntry(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const dateString = formData.date.includes("/")
        ? new Date(formData.date).toISOString().split("T")[0]
        : formData.date;

      const response = await fetch(`${API_URL}/api/daily-entry`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateString,
          goals: formData.goals,
          gains: formData.gains,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEntries();

      if (closeModal) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create entry:", error);
      throw error;
    } finally {
      setIsCreatingEntry(false);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setEntryToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/api/daily-entry/${entryToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEntries();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete entry:", error);
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
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/daily-entry/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          goals: newGoals,
          gains: newGains,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Entry not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.modified) {
        await fetchEntries();
      }

      return result;
    } catch (error) {
      console.error("Failed to update entry:", error);
      throw error;
    }
  };

  return user ? (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <motion.div
        className="max-w-2xl w-full flex flex-row items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
      >
        <p className="text-2xl font-bold text-black dark:text-white">
          Hi{user ? `, ${user.name}` : ""}!
        </p>
        <div className="flex flex-row items-center justify-end gap-2 ">
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

      <EntryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateDailyEntry}
        handleAudioSubmission={handleAudioSubmission}
        isTranscribing={isTranscribing}
      />

      <div className="w-full max-w-2xl">
        {isLoadingEntries ? (
          <div className="flex justify-center items-center py-8">
            <Spinner
              variant="circle"
              className="h-8 w-8 text-muted-foreground"
            />
          </div>
        ) : dailyEntries.length > 0 ? (
          dailyEntries.map((entry) => (
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
            No entries found. Start by creating a new entry!
          </div>
        )}
      </div>

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
