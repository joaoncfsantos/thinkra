import { useEffect, useRef, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { DailyCard } from "./components/DailyCard";
import { EntryFormModal } from "./components/EntryFormModal";

import type { DailyEntry } from "./interfaces/DailyEntry";
import { Button } from "./components/ui/button";

function Content() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [gapsAndGains, setGapsAndGains] = useState<{
    goals: string[];
    gains: string[];
  }>({ goals: [], gains: [] });
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string>("");
  const [recordingDate, setRecordingDate] = useState<string>("");
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchEntries = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("Fetching from:", `${API_URL}/api/daily-entry`);

      const response = await fetch(`${API_URL}/api/daily-entry`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      setDailyEntries(data as DailyEntry[]);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsTranscribing(true);
    setError("");
    setTranscribedText("");
    setRecordingDate(new Date().toLocaleDateString());

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
      setTranscribedText(data.text);
      setGapsAndGains(data.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to transcribe audio"
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCreateDailyEntry = async (formData: {
    date: string;
    goals: string[];
    gains: string[];
  }) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/daily-entry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(formData.date),
          goals: formData.goals,
          gains: formData.gains,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Created entry:", data);
      await fetchEntries();
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        className="mb-4"
      />

      <Button onClick={() => setIsModalOpen(true)}>Create Entry</Button>

      <EntryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateDailyEntry}
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

        {transcribedText && (
          <div className="text-center text-muted-foreground">
            <p>Transcribed text:</p>
            <p>{transcribedText}</p>
          </div>
        )}

        {dailyEntries.map((entry, index) => (
          <div className="mb-4">
            <DailyCard
              key={entry.id || index}
              date={entry.date}
              goals={entry.goals}
              gains={entry.gains}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Content;
