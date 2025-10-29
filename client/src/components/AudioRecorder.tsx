import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Mic, Square } from "lucide-react";

// Configuration constants
const AUDIO_CONFIG = {
  FFT_SIZE: 2048,
  SMOOTHING_TIME_CONSTANT: 0.6,
  VOLUME_AMPLIFICATION: 2,
  NOISE_THRESHOLD: 2,
  SMOOTHING_FACTOR: 0.8,
} as const;

const DEFAULT_CIRCLE_CONFIG = {
  MIN_SIZE: 100,
  MAX_SIZE: 300,
  COLOR: "bg-black dark:bg-white",
  TRANSITION_DURATION: "duration-200",
} as const;

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  minCircleSize?: number;
  maxCircleSize?: number;
  circleColor?: string;
}

interface AudioRefs {
  mediaRecorder: React.MutableRefObject<MediaRecorder | null>;
  audioContext: React.MutableRefObject<AudioContext | null>;
  analyser: React.MutableRefObject<AnalyserNode | null>;
  animationFrame: React.MutableRefObject<number | null>;
  isRecording: React.MutableRefObject<boolean>;
}

export function AudioRecorder({
  onRecordingComplete,
  onVolumeChange,
  className,
  minCircleSize = DEFAULT_CIRCLE_CONFIG.MIN_SIZE,
  maxCircleSize = DEFAULT_CIRCLE_CONFIG.MAX_SIZE,
  circleColor = DEFAULT_CIRCLE_CONFIG.COLOR,
}: AudioRecorderProps) {
  // State
  const [isRecording, setIsRecording] = useState(false);
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

  // Computed values
  const circleSize =
    minCircleSize + (smoothedVolume / 100) * (maxCircleSize - minCircleSize);

  // Volume smoothing effect
  useEffect(() => {
    const targetVolume = volume * AUDIO_CONFIG.VOLUME_AMPLIFICATION;
    setSmoothedVolume(
      (prev) => prev + (targetVolume - prev) * AUDIO_CONFIG.SMOOTHING_FACTOR
    );
  }, [volume]);

  // Prevent body scroll when recording
  useEffect(() => {
    if (isRecording) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isRecording]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      await setupAudioAnalysis(stream);
      refs.mediaRecorder.current = setupMediaRecorder(stream);

      // Start recording and analysis
      refs.mediaRecorder.current.start();
      setIsRecording(true);
      refs.isRecording.current = true;
      analyzeAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const stopRecording = (): void => {
    if (refs.mediaRecorder.current && isRecording) {
      refs.isRecording.current = false;
      refs.mediaRecorder.current.stop();
      setIsRecording(false);
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
        >
          <Mic className="w-5 h-5" />
        </Button>
      </div>

      {/* Full-screen overlay when recording */}
      {isRecording && (
        <div className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center">
          {/* Volume-responsive circle in the center */}
          <div
            className={`rounded-full ${circleColor} transition-all ${DEFAULT_CIRCLE_CONFIG.TRANSITION_DURATION} ease-out shadow-2xl`}
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
            }}
          />

          {/* Stop recording button */}
          <div className="flex flex-col items-center justify-center gap-2 absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={handleRecordClick}
              variant="destructive"
              size="icon"
              className="w-16 h-16 rounded-full shadow-2xl"
            >
              <Square className="w-6 h-6" />
            </Button>
            <span className="text-xs font-medium text-muted-foreground">
              Click to stop or press spacebar
            </span>
          </div>

          {/* Recording indicator */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 text-black dark:text-white rounded-full">
              <div className="w-3 h-3 bg-black dark:bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium animate-pulse">
                Tell me about your day
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
