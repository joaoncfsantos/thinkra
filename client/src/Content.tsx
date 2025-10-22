import { useEffect, useRef, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";
import { DailyCard } from "./components/DailyCard";

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

  // Add mock data for dev
  useEffect(() => {
    setGapsAndGains({
      goals: [
        "Start working on the presentation for next week's client meeting",
        "Call mom",
        "Go to the gym",
      ],
      gains: [
        "Had a great conversation with my colleague about the new project",
        "Finished reading that book I've been working on for weeks",
        "Took a nice walk in the park during lunch break with perfect weather",
      ],
    });
    setRecordingDate(new Date().toLocaleDateString());
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

        <DailyCard
          date={recordingDate}
          goals={gapsAndGains.goals}
          gains={gapsAndGains.gains}
        />
      </div>
    </div>
  );
}

export default Content;
