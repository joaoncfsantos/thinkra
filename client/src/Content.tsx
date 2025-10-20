import { useRef, useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";

function Content() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsTranscribing(true);
    setError("");
    setTranscribedText("");

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
          <div className="text-gray-900 dark:text-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Transcribed Text:</h3>
            <p className="text-sm">{transcribedText}</p>
          </div>
        )}
      </div>

      <audio ref={audioRef} controls className="mt-4" />
    </div>
  );
}

export default Content;
