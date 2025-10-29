import { Button } from "./ui/button";
import { Square } from "lucide-react";

const OVERLAY_CONFIG = {
  CIRCLE: {
    MIN_SIZE: 100,
    MAX_SIZE: 300,
    COLOR: "bg-black dark:bg-white",
    TRANSITION_DURATION: "duration-500",
  },
  BACKGROUND: {
    OVERLAY_COLOR: "bg-white/80 dark:bg-black/80",
    BACKDROP_BLUR: "backdrop-blur-sm",
  },
  BUTTON: {
    SIZE: "w-16 h-16",
    POSITION: "bottom-20",
  },
} as const;

interface ScreenOverlayProps {
  volume: number;
  handleRecordClick: () => void;
  minCircleSize?: number;
  maxCircleSize?: number;
  circleColor?: string;
}

export function ScreenOverlay({
  volume,
  handleRecordClick,
  minCircleSize = OVERLAY_CONFIG.CIRCLE.MIN_SIZE,
  maxCircleSize = OVERLAY_CONFIG.CIRCLE.MAX_SIZE,
  circleColor = OVERLAY_CONFIG.CIRCLE.COLOR,
}: ScreenOverlayProps) {
  // Calculate circle size based on volume
  const circleSize =
    minCircleSize + (volume / 100) * (maxCircleSize - minCircleSize);

  return (
    <div
      className={`fixed inset-0 z-50 ${OVERLAY_CONFIG.BACKGROUND.OVERLAY_COLOR} ${OVERLAY_CONFIG.BACKGROUND.BACKDROP_BLUR} flex items-center justify-center`}
    >
      {/* Volume-responsive circle in the center */}
      <div
        className={`rounded-full ${circleColor} transition-all ${OVERLAY_CONFIG.CIRCLE.TRANSITION_DURATION} ease-out shadow-2xl`}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
        }}
      />

      {/* Stop recording button */}
      <div
        className={`flex flex-col items-center justify-center gap-2 absolute ${OVERLAY_CONFIG.BUTTON.POSITION} left-1/2 transform -translate-x-1/2`}
      >
        <Button
          onClick={handleRecordClick}
          variant="destructive"
          size="icon"
          className={`${OVERLAY_CONFIG.BUTTON.SIZE} rounded-full shadow-2xl`}
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
  );
}
