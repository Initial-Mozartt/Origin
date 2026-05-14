import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { SettingsPanel } from "@/components/settings-panel";

const WMO_CODES: Record<number, string> = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "icy fog",
  51: "light drizzle",
  53: "drizzle",
  55: "heavy drizzle",
  61: "light rain",
  63: "moderate rain",
  65: "heavy rain",
  71: "light snow",
  73: "moderate snow",
  75: "heavy snow",
  77: "snow grains",
  80: "rain showers",
  81: "moderate showers",
  82: "violent showers",
  85: "snow showers",
  86: "heavy snow showers",
  95: "thunderstorm",
  96: "thunderstorm with hail",
  99: "heavy thunderstorm",
};

function useWeather(unit: "f" | "c", enabled: boolean) {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const tempUnit = unit === "f" ? "fahrenheit" : "celsius";
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&temperature_unit=${tempUnit}`;
          const res = await fetch(url);
          const data = await res.json();
          const code: number = data.current.weather_code;
          const temp: number = Math.round(data.current.temperature_2m);
          const desc = WMO_CODES[code] ?? "unknown";
          setWeather(`${desc} - ${temp} ${unit}`);
        } catch {
          setWeather(null);
        }
      },
      () => setWeather(null)
    );
  }, [unit, enabled]);

  return weather;
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function Startpage() {
  const [time, setTime] = useState(new Date());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, update, updateBackground, updateClock, updateColumns, resetToDefaults } = useSettings();

  const weather = useWeather(settings.weatherUnit, settings.showWeather);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = (() => {
    if (settings.clock.format === "12h") {
      const h = time.getHours() % 12 || 12;
      const m = String(time.getMinutes()).padStart(2, "0");
      const s = String(time.getSeconds()).padStart(2, "0");
      const ampm = time.getHours() < 12 ? "AM" : "PM";
      return settings.clock.showSeconds ? `${h}:${m}:${s} ${ampm}` : `${h}:${m} ${ampm}`;
    }
    return time.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      ...(settings.clock.showSeconds ? { second: "2-digit" } : {}),
    });
  })();

  const bgStyle: React.CSSProperties =
    settings.background.type === "image" && settings.background.imageUrl
      ? {
          backgroundImage: `url(${settings.background.imageUrl})`,
          backgroundSize: settings.background.imageFit === "repeat" ? "auto" : settings.background.imageFit,
          backgroundRepeat: settings.background.imageFit === "repeat" ? "repeat" : "no-repeat",
          backgroundPosition: "center",
        }
      : { backgroundColor: settings.background.color };

  return (
    <>
      <div
        style={{
          ...bgStyle,
          color: "#f8f8f2",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          data-testid="button-open-settings"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
            color: "#999",
            cursor: "pointer",
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#ff79c6")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#999")}
          aria-label="Open settings"
        >
          <GearIcon />
        </button>

        {/* Clock */}
        <div
          data-testid="text-clock"
          style={{
            fontSize: "5rem",
            fontWeight: 700,
            marginBottom: "10px",
            letterSpacing: "2px",
          }}
        >
          {timeString}
        </div>

        {/* Weather */}
        {settings.showWeather && weather && (
          <div
            data-testid="text-weather"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "8px 60px",
              borderRadius: "2px",
              fontSize: "1.2rem",
              marginBottom: "40px",
              color: "#f8f8f2",
              textTransform: "lowercase",
            }}
          >
            {weather}
          </div>
        )}

        {(!settings.showWeather || !weather) && (
          <div style={{ marginBottom: "40px", height: "42px" }} />
        )}

        {/* Link columns */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          {settings.columns.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: "20px",
                width: "140px",
                borderRadius: "2px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1rem",
                  marginBottom: "15px",
                  color: "#f8f8f2",
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                {col.heading}
              </h3>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {col.links.map((link, linkIdx) => (
                  <li key={linkIdx} style={{ marginBottom: "6px" }}>
                    <a
                      href={link.url}
                      data-testid={`link-${colIdx}-${linkIdx}`}
                      style={{
                        color: "#999",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        transition: "color 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "#ff79c6")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "#999")
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateBackground={updateBackground}
          onUpdateClock={updateClock}
          onUpdateColumns={updateColumns}
          onUpdate={update}
          onReset={resetToDefaults}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
