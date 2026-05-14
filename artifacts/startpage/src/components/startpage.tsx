import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/hooks/use-settings";
import { SettingsPanel } from "@/components/settings-panel";
import { useWeather } from "@/hooks/use-weather";
import { SearchBar } from "@/components/search-bar";
import { Pomodoro } from "@/components/pomodoro";
import { ScratchPad } from "@/components/scratch-pad";
import { RssFeed } from "@/components/rss-feed";

const QUOTES = [
  "The quieter you become, the more you can hear.",
  "Do what you can, with what you have, where you are.",
  "Simplicity is the ultimate sophistication.",
  "Make it work, make it right, make it fast.",
  "Less, but better.",
  "Stay hungry, stay foolish.",
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "The best way to predict the future is to invent it.",
  "Quality is not an act, it is a habit.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "Knowledge is power.",
  "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
  "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Fix the cause, not the symptom.",
  "Before software can be reusable it first has to be usable.",
  "In order to be irreplaceable, one must always be different.",
  "The only way to do great work is to love what you do.",
];

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
  const [scratchPadOpen, setScratchPadOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dragSourceIndex = useRef<number | null>(null);

  const {
    settings,
    update,
    updateBackground,
    updateClock,
    updateColumns,
    updateKeybinds,
    applyThemePreset,
    resetToDefaults,
  } = useSettings();

  const weather = useWeather(settings.weatherUnit, settings.showWeather);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Custom CSS Injection
  useEffect(() => {
    let styleTag = document.getElementById("origin-custom-css");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "origin-custom-css";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = settings.customCss;
  }, [settings.customCss]);

  // Font Injection
  useEffect(() => {
    const googleFonts = ["JetBrains Mono", "IBM Plex Mono", "Inter"];
    const fontName = settings.fontFamily.split(",")[0].replace(/['"]/g, "");
    
    if (googleFonts.includes(fontName)) {
      const linkId = `font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [settings.fontFamily]);

  // Keybinds
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if (e.key === settings.keybinds.openSettings) {
        setSettingsOpen((prev) => !prev);
      } else if (e.key === settings.keybinds.focusSearch && settings.showSearchBar) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === settings.keybinds.toggleScratchPad && settings.scratchPadEnabled) {
        setScratchPadOpen((prev) => !prev);
      }
      // Pomodoro toggle is handled inside Pomodoro component or we could add it here if we want global toggle of visibility? 
      // Spec says: "Keybind toggles running state (if pomodoroEnabled)" - so it's about running the timer.
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.keybinds, settings.showSearchBar, settings.scratchPadEnabled]);

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

  const dateString = time.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = time.getHours();
    let base = "Good morning.";
    if (hour >= 12 && hour < 17) base = "Good afternoon.";
    if (hour >= 17 || hour < 5) base = "Good evening.";

    if (settings.greeting.enabled && settings.greeting.name) {
      return base.replace(".", `, ${settings.greeting.name}.`);
    }
    return base;
  };

  const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  const bgStyle: React.CSSProperties =
    settings.background.type === "image" && settings.background.imageUrl
      ? {
          backgroundImage: `url(${settings.background.imageUrl})`,
          backgroundSize: settings.background.imageFit === "repeat" ? "auto" : settings.background.imageFit,
          backgroundRepeat: settings.background.imageFit === "repeat" ? "repeat" : "no-repeat",
          backgroundPosition: "center",
        }
      : { backgroundColor: settings.background.color };

  const boxBg = settings.background.type === "image" ? "rgba(0,0,0,0.6)" : settings.columnBgColor;

  const handleDragStart = (index: number) => {
    dragSourceIndex.current = index;
  };

  const handleDrop = (targetIndex: number) => {
    if (dragSourceIndex.current === null) return;
    const newColumns = [...settings.columns];
    const [removed] = newColumns.splice(dragSourceIndex.current, 1);
    newColumns.splice(targetIndex, 0, removed);
    updateColumns(newColumns);
    dragSourceIndex.current = null;
  };

  return (
    <>
      <div
        style={{
          ...bgStyle,
          color: settings.foregroundColor,
          fontFamily: settings.fontFamily,
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          overflowX: "hidden",
          position: "relative",
        }}
      >
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
            zIndex: 10,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
          aria-label="Open settings"
        >
          <GearIcon />
        </button>

        {settings.showSearchBar && (
          <SearchBar 
            ref={searchInputRef} 
            engine={settings.searchEngine} 
            foregroundColor={settings.foregroundColor} 
          />
        )}

        <div
          data-testid="text-clock"
          style={{
            fontSize: "5rem",
            fontWeight: 700,
            marginBottom: settings.showDate ? "5px" : "10px",
            letterSpacing: "2px",
          }}
        >
          {timeString}
        </div>

        {settings.showDate && (
          <div
            data-testid="text-date"
            style={{
              fontSize: "1.2rem",
              marginBottom: "10px",
              opacity: 0.8,
            }}
          >
            {dateString}
          </div>
        )}

        {settings.greeting.enabled && (
          <div
            data-testid="text-greeting"
            style={{
              fontSize: "1.5rem",
              marginBottom: "20px",
              opacity: 0.9,
            }}
          >
            {getGreeting()}
          </div>
        )}

        {settings.showWeather && weather && (
          <div
            data-testid="text-weather"
            style={{
              backgroundColor: boxBg,
              padding: "8px 60px",
              borderRadius: "2px",
              fontSize: "1.2rem",
              marginBottom: "20px",
              color: settings.foregroundColor,
              textTransform: "lowercase",
            }}
          >
            {weather}
          </div>
        )}

        {settings.showQuote && (
          <div
            data-testid="text-quote"
            style={{
              fontSize: "0.9rem",
              fontStyle: "italic",
              opacity: 0.6,
              marginBottom: "20px",
              maxWidth: "600px",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            {quote}
          </div>
        )}

        {settings.pomodoroEnabled && (
          <Pomodoro 
            workMinutes={settings.pomodoroWorkMinutes} 
            breakMinutes={settings.pomodoroBreakMinutes} 
            foregroundColor={settings.foregroundColor}
            columnBgColor={boxBg}
          />
        )}

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center", padding: "20px" }}>
          {settings.columns.map((col, colIdx) => (
            <div
              key={colIdx}
              draggable
              onDragStart={() => handleDragStart(colIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(colIdx)}
              style={{
                backgroundColor: boxBg,
                padding: "20px",
                width: "140px",
                borderRadius: "2px",
                cursor: "default",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1rem",
                  marginBottom: "15px",
                  color: settings.foregroundColor,
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
                      onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {settings.rssFeeds.map((feed, idx) => (
            <RssFeed
              key={`rss-${idx}`}
              url={feed.url}
              label={feed.label}
              maxItems={feed.maxItems}
              columnBgColor={boxBg}
              hoverColor={settings.hoverColor}
              foregroundColor={settings.foregroundColor}
            />
          ))}
        </div>
      </div>

      <ScratchPad 
        isOpen={scratchPadOpen} 
        onClose={() => setScratchPadOpen(false)} 
        foregroundColor={settings.foregroundColor}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateBackground={updateBackground}
          onUpdateClock={updateClock}
          onUpdateColumns={updateColumns}
          onUpdateKeybinds={updateKeybinds}
          onApplyThemePreset={applyThemePreset}
          onUpdate={update}
          onReset={resetToDefaults}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
