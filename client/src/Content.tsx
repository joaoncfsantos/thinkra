import { useEffect, useRef, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { DailyCard } from "./components/DailyCard";
import { EntryFormModal } from "./components/EntryFormModal";
import { ConfirmationModal } from "./components/DeleteConfirmationModal";

import type { DailyEntry } from "./interfaces/DailyEntry";
import { Button } from "./components/ui/button";
import {
  Edit,
  FileText,
  NotebookPen,
  PenTool,
  Plus,
  PlusCircle,
} from "lucide-react";

function Content() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string>("");
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/daily-entry`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setDailyEntries(data as DailyEntry[]);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAudioSubmission = async (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsTranscribing(true);
    setError("");

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
        setError(
          "No goals or gains were found in the transcription. Please try recording again with clearer content about your goals and gains."
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
      setError(
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
      const API_URL = import.meta.env.VITE_API_URL;

      const dateString = formData.date.includes("/")
        ? new Date(formData.date).toISOString().split("T")[0]
        : formData.date;

      const response = await fetch(`${API_URL}/api/daily-entry`, {
        method: "POST",
        headers: {
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
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchEntries();
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

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="max-w-2xl w-full flex flex-row items-center justify-between">
        <p className="text-3xl font-bold text-black dark:text-white">Hi!</p>
        <div className="flex flex-row items-center justify-end gap-2 ">
          <Button onClick={() => setIsModalOpen(true)}>
            <NotebookPen className="size-4" />
          </Button>
        </div>
      </div>

      <EntryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateDailyEntry}
        handleAudioSubmission={handleAudioSubmission}
        isTranscribing={isTranscribing}
      />

      <div className="w-full max-w-2xl">
        {isTranscribing && (
          <div className="text-center text-muted-foreground">
            <p>Transcribing audio...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <p>Error: {error}</p>
          </div>
        )}

        {dailyEntries.map((entry) => (
          <div className="mb-4" key={entry.id}>
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
          </div>
        ))}
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
      />
    </div>
  );
}

export default Content;
