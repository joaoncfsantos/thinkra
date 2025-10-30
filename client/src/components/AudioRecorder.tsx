import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { ScreenOverlay } from "./ScreenOverlay";

// Configuration constants
const AUDIO_CONFIG = {
  FFT_SIZE: 2048,
  SMOOTHING_TIME_CONSTANT: 0.6,
  VOLUME_AMPLIFICATION: 2,
  NOISE_THRESHOLD: 2,
  SMOOTHING_FACTOR: 0.8,
} as const;

// Define the recording states as an enum
type RecordingState = "idle" | "recording" | "processing" | "transcribing";

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  isTranscribing?: boolean;
}

interface AudioRefs {
  mediaRecorder: React.RefObject<MediaRecorder | null>;
  audioContext: React.RefObject<AudioContext | null>;
  analyser: React.RefObject<AnalyserNode | null>;
  animationFrame: React.RefObject<number | null>;
  isRecording: React.RefObject<boolean>;
}

export function AudioRecorder({
  onRecordingComplete,
  onVolumeChange,
  className,
  isTranscribing = false,
}: AudioRecorderProps) {
  // Use a single state machine instead of multiple boolean states
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [volume, setVolume] = useState(0);
  const [smoothedVolume, setSmoothedVolume] = useState(0);

  // Refs
  const refs: AudioRefs = {
    mediaRecorder: useRef<MediaRecorder | null>(null),
    audioContext: useRef<AudioContext | null>(null),
    analyser: useRef<AnalyserNode | null>(null),
    animationFrame: useRef<number | null>(null),
    isRecording: useRef(false),
  };

  // Derived states for cleaner logic
  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";
  const showOverlay = recordingState !== "idle";

  // Volume smoothing effect
  useEffect(() => {
    const targetVolume = volume * AUDIO_CONFIG.VOLUME_AMPLIFICATION;
    setSmoothedVolume(
      (prev) => prev + (targetVolume - prev) * AUDIO_CONFIG.SMOOTHING_FACTOR
    );
  }, [volume]);

  // Update body scroll effect
  useEffect(() => {
    if (showOverlay || isTranscribing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showOverlay, isTranscribing]);

  // Handle external transcription state changes
  useEffect(() => {
    if (isTranscribing && recordingState === "processing") {
      setRecordingState("transcribing");
    } else if (!isTranscribing && recordingState === "transcribing") {
      setRecordingState("idle");
    }
  }, [isTranscribing, recordingState]);

  // Audio analysis function
  const analyzeAudio = useCallback(() => {
    if (!refs.analyser.current || !refs.isRecording.current) {
      return;
    }

    const analyser = refs.analyser.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    // Calculate RMS for volume level
    const rms = calculateRMS(dataArray);
    let volumeLevel = Math.min(100, rms * 100);

    // Apply noise gate
    if (volumeLevel < AUDIO_CONFIG.NOISE_THRESHOLD) {
      volumeLevel = 0;
    }

    setVolume(volumeLevel);
    onVolumeChange?.(volumeLevel);

    // Continue analysis loop
    if (refs.isRecording.current) {
      refs.animationFrame.current = requestAnimationFrame(analyzeAudio);
    }
  }, [onVolumeChange]);

  // Helper function to calculate RMS
  const calculateRMS = (dataArray: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const sample = (dataArray[i] - 128) / 128; // Convert to -1 to 1 range
      sum += sample * sample;
    }
    return Math.sqrt(sum / dataArray.length);
  };

  // Setup audio context and analyser
  const setupAudioAnalysis = async (stream: MediaStream): Promise<void> => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

    refs.audioContext.current = new AudioContextClass();

    // Resume context if suspended
    if (refs.audioContext.current.state === "suspended") {
      await refs.audioContext.current.resume();
    }

    const source = refs.audioContext.current.createMediaStreamSource(stream);
    refs.analyser.current = refs.audioContext.current.createAnalyser();

    // Configure analyser
    refs.analyser.current.fftSize = AUDIO_CONFIG.FFT_SIZE;
    refs.analyser.current.smoothingTimeConstant =
      AUDIO_CONFIG.SMOOTHING_TIME_CONSTANT;

    source.connect(refs.analyser.current);
  };

  // Setup media recorder
  const setupMediaRecorder = (stream: MediaStream): MediaRecorder => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: mediaRecorder.mimeType });
      // Set processing state immediately - this prevents the blink
      setRecordingState("processing");
      onRecordingComplete?.(audioBlob);
      cleanup(stream);
    };

    return mediaRecorder;
  };

  // Cleanup function
  const cleanup = (stream?: MediaStream) => {
    // Stop media tracks
    stream?.getTracks().forEach((track) => track.stop());

    // Close audio context
    if (refs.audioContext.current) {
      refs.audioContext.current.close();
    }

    // Cancel animation frame
    if (refs.animationFrame.current) {
      cancelAnimationFrame(refs.animationFrame.current);
    }

    // Reset state
    setVolume(0);
    setSmoothedVolume(0);
    refs.isRecording.current = false;
  };

  // Start recording
  const startRecording = async (): Promise<void> => {
    try {
      setRecordingState("recording");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      await setupAudioAnalysis(stream);
      refs.mediaRecorder.current = setupMediaRecorder(stream);

      // Start recording and analysis
      refs.mediaRecorder.current.start();
      refs.isRecording.current = true;
      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingState("idle");
    }
  };

  // Stop recording
  const stopRecording = (): void => {
    if (refs.mediaRecorder.current && isRecording) {
      refs.isRecording.current = false;
      refs.mediaRecorder.current.stop();
      // Don't set state here - let the onstop callback handle it
    }
  };

  // Toggle recording
  const handleRecordClick = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      refs.isRecording.current = false;
      cleanup();
    };
  }, []);

  return (
    <>
      {/* Recording button */}
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${
          className || ""
        }`}
      >
        <Button
          onClick={handleRecordClick}
          variant="default"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg"
          disabled={recordingState !== "idle" && recordingState !== "recording"}
          type="button"
        >
          <Mic className="w-5 h-5" />
        </Button>
      </div>

      {/* Full-screen overlay */}
      {showOverlay && (
        <ScreenOverlay
          volume={smoothedVolume}
          handleRecordClick={handleRecordClick}
          isRecording={isRecording}
          isTranscribing={isProcessing || isTranscribing}
        />
      )}
    </>
  );
}
