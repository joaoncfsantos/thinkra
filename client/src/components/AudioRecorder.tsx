import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, Square } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  className?: string;
}

export function AudioRecorder({
  onRecordingComplete,
  className,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus", // or 'audio/mp4' if supported
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: mediaRecorder.mimeType });

        // Call the callback with the audio blob
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${
        className || ""
      }`}
    >
      <Button
        onClick={handleRecordClick}
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        className="w-10 h-10 rounded-full"
      >
        {isRecording ? (
          <Square className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
