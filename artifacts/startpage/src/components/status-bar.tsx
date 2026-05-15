import { useState, useEffect } from "react";

interface Props {
  enabled: boolean;
  text: string;
  foregroundColor: string;
  bgColor: string;
}

const S = {
  bar: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 12px",
    fontSize: "0.7rem",
    zIndex: 2000,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backdropFilter: "blur(4px)",
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }
};

export function StatusBar({ enabled, text, foregroundColor, bgColor }: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const formatDate = (d: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div 
      style={{ 
        ...S.bar, 
        backgroundColor: bgColor ? `${bgColor}cc` : "rgba(0,0,0,0.5)", 
        color: foregroundColor,
        opacity: 0.8
      }}
      data-testid="status-bar"
    >
      <div style={S.section}>{formatDate(now)}</div>
      <div style={{ ...S.section, flex: 1, justifyContent: "center", opacity: 0.6 }}>{text}</div>
      <div style={S.section}>{formatTime(now)}</div>
    </div>
  );
}
