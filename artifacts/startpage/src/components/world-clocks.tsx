import type { WorldClock } from "@/hooks/use-settings";

interface WorldClocksProps {
  clocks: WorldClock[];
  format: "12h" | "24h";
  foregroundColor: string;
  time: Date;
}

export function WorldClocks({ clocks, format, foregroundColor, time }: WorldClocksProps) {
  if (clocks.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "10px",
        opacity: 0.6,
        fontSize: "0.9rem",
        color: foregroundColor,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
      data-testid="world-clocks-container"
    >
      {clocks.map((clock, idx) => {
        try {
          const timeStr = time.toLocaleTimeString("en-US", {
            timeZone: clock.timezone,
            hour12: format === "12h",
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div key={idx} data-testid={`world-clock-${idx}`}>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>{clock.label}</span>
              <span>{timeStr}</span>
            </div>
          );
        } catch (e) {
          return null;
        }
      })}
    </div>
  );
}
