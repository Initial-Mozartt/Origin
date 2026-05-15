import { useState, useEffect } from "react";

interface Props {
  enabled: boolean;
  progressColor: string;
  bgColor: string;
}

const S = {
  bar: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    zIndex: 2000,
    transition: "width 0.5s ease-out",
  }
};

export function DayProgress({ enabled, progressColor, bgColor }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const updateProgress = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const current = now.getTime();
      const percent = ((current - midnight) / 86400000) * 100;
      setProgress(percent);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div 
      style={{ 
        ...S.bar, 
        width: `${progress}%`, 
        backgroundColor: progressColor || "#ff79c6" 
      }} 
      data-testid="day-progress-bar"
    />
  );
}
