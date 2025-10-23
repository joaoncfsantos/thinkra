import { useEffect, useRef, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { DailyCard } from "./components/DailyCard";

import type { DailyEntry } from "./interfaces/DailyEntry";

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

  useEffect(() => {
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

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-4">
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        className="mb-4"
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
          <DailyCard
            date={recordingDate}
            goals={gapsAndGains.goals}
            gains={gapsAndGains.gains}
          />
        )}

        {dailyEntries.map((entry, index) => (
          <DailyCard
            key={entry.id || index}
            date={entry.date}
            goals={entry.goals}
            gains={entry.gains}
          />
        ))}
      </div>
    </div>
  );
}

export default Content;
