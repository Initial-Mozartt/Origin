import { useState, useEffect } from "react";

interface PomodoroProps {
  workMinutes: number;
  breakMinutes: number;
  foregroundColor: string;
  columnBgColor: string;
}

export function Pomodoro({
  workMinutes,
  breakMinutes,
  foregroundColor,
  columnBgColor,
}: PomodoroProps) {
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(phase === "work" ? workMinutes * 60 : breakMinutes * 60);
  }, [workMinutes, breakMinutes, phase]);

  useEffect(() => {
    let timer: number;
    if (running && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setRunning(false);
      setPhase((prev) => (prev === "work" ? "break" : "work"));
    }
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        marginBottom: "20px",
        padding: "10px 20px",
        backgroundColor: columnBgColor,
        borderRadius: "2px",
        color: foregroundColor,
      }}
      data-testid="container-pomodoro"
    >
      <div style={{ fontSize: "1.5rem", fontWeight: "bold" }} data-testid="text-pomodoro-timer">
        {timeDisplay}
      </div>
      <div style={{ fontSize: "0.7rem", opacity: 0.7, textTransform: "lowercase" }}>
        {phase}
      </div>
      <button
        onClick={() => setRunning(!running)}
        style={{
          background: "none",
          border: "none",
          color: foregroundColor,
          cursor: "pointer",
          fontSize: "0.8rem",
          opacity: 0.8,
          textDecoration: "underline",
          padding: 0,
        }}
        data-testid="button-toggle-pomodoro"
      >
        {running ? "stop" : "start"}
      </button>
    </div>
  );
}
