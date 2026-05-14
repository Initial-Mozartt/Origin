import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/hooks/use-settings";
import { SettingsPanel } from "@/components/settings-panel";
import { useWeather } from "@/hooks/use-weather";
import { SearchBar } from "@/components/search-bar";
import { Pomodoro } from "@/components/pomodoro";
import { ScratchPad } from "@/components/scratch-pad";
import { RssFeed } from "@/components/rss-feed";
import { QuickOpen } from "@/components/quick-open";
import { WorldClocks } from "@/components/world-clocks";
import { Calculator } from "@/components/calculator";

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
  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [focusedCol, setFocusedCol] = useState<number | null>(null);
  const [focusedLink, setFocusedLink] = useState<number | null>(null);
  const [isEditingMotd, setIsEditingMotd] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dragSourceIndex = useRef<number | null>(null);

  const {
    settings,
    update,
    updateBackground,
    updateClock,
    updateColumns,
    updateKeybinds,
    updateActiveColumns,
    setCurrentPage,
    addPage,
    removePage,
    renamePage,
    importSettings,
    updateBackgroundCycle,
    applyThemePreset,
    resetToDefaults,
  } = useSettings();

  const activeColumns = settings.pages.length > 0 && settings.pages[settings.currentPage]
    ? settings.pages[settings.currentPage].columns
    : settings.columns;

  const weather = useWeather(settings.weatherUnit, settings.showWeather);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayOfYear = Math.floor((time.getTime() - new Date(time.getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = QUOTES[dayOfYear % QUOTES.length];

  // Background cycling
  useEffect(() => {
    if (settings.backgroundCycle.enabled && settings.backgroundCycle.urls.length > 0 && settings.backgroundCycle.intervalSeconds > 0) {
      const interval = setInterval(() => {
        const nextIdx = (settings.backgroundCycle.currentIndex + 1) % settings.backgroundCycle.urls.length;
        updateBackgroundCycle({ currentIndex: nextIdx });
        updateBackground({ imageUrl: settings.backgroundCycle.urls[nextIdx], type: "image" });
      }, settings.backgroundCycle.intervalSeconds * 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [settings.backgroundCycle.enabled, settings.backgroundCycle.urls, settings.backgroundCycle.intervalSeconds, settings.backgroundCycle.currentIndex]);

  // Handle manual background cycle keybind
  const cycleBg = () => {
    if (settings.backgroundCycle.urls.length === 0) return;
    const nextIdx = (settings.backgroundCycle.currentIndex + 1) % settings.backgroundCycle.urls.length;
    updateBackgroundCycle({ currentIndex: nextIdx });
    updateBackground({ imageUrl: settings.backgroundCycle.urls[nextIdx], type: "image" });
  };

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

  // Keybinds — each key toggles its feature on/off
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      const kb = settings.keybinds;
      
      // Keyboard Navigation
      if (settings.keyboardNavEnabled) {
        if (e.key === "Escape") {
          setFocusedCol(null);
          setFocusedLink(null);
          return;
        }

        if (focusedCol === null) {
          if (e.key === "ArrowRight") {
            setFocusedCol(0);
            return;
          }
          if (e.key === "ArrowLeft") {
            setFocusedCol(activeColumns.length - 1);
            return;
          }
        } else {
          if (e.key === "ArrowRight") {
            setFocusedCol((focusedCol + 1) % activeColumns.length);
            setFocusedLink(null);
            return;
          }
          if (e.key === "ArrowLeft") {
            setFocusedCol((focusedCol - 1 + activeColumns.length) % activeColumns.length);
            setFocusedLink(null);
            return;
          }
          if (e.key === "ArrowDown") {
            const links = activeColumns[focusedCol].links;
            if (focusedLink === null) setFocusedLink(0);
            else setFocusedLink((focusedLink + 1) % links.length);
            return;
          }
          if (e.key === "ArrowUp") {
            const links = activeColumns[focusedCol].links;
            if (focusedLink === null) setFocusedLink(links.length - 1);
            else setFocusedLink((focusedLink - 1 + links.length) % links.length);
            return;
          }
          if (e.key >= "1" && e.key <= "9") {
            const idx = parseInt(e.key) - 1;
            const link = activeColumns[focusedCol].links[idx];
            if (link) {
              window.open(link.url, settings.openLinksInNewTab ? "_blank" : "_self", settings.openLinksInNewTab ? "noopener noreferrer" : undefined);
            }
            return;
          }
          if (e.key === "Enter" && focusedLink !== null) {
            const link = activeColumns[focusedCol].links[focusedLink];
            if (link) {
              window.open(link.url, settings.openLinksInNewTab ? "_blank" : "_self", settings.openLinksInNewTab ? "noopener noreferrer" : undefined);
            }
            return;
          }
        }
      }

      if (e.key === kb.openSettings) {
        setSettingsOpen((prev) => !prev);
      } else if (e.key === kb.toggleSearch) {
        update({ showSearchBar: !settings.showSearchBar });
      } else if (e.key === kb.toggleWeather) {
        update({ showWeather: !settings.showWeather });
      } else if (e.key === kb.toggleDate) {
        update({ showDate: !settings.showDate });
      } else if (e.key === kb.toggleGreeting) {
        update({ greeting: { ...settings.greeting, enabled: !settings.greeting.enabled } });
      } else if (e.key === kb.toggleQuote) {
        update({ showQuote: !settings.showQuote });
      } else if (e.key === kb.toggleScratchPad) {
        setScratchPadOpen((prev) => !prev);
      } else if (e.key === kb.togglePomodoro) {
        update({ pomodoroEnabled: !settings.pomodoroEnabled });
      } else if (e.key === kb.toggleCalculator) {
        setCalculatorVisible(prev => !prev);
      } else if (e.key === kb.toggleQuickOpen) {
        setQuickOpenVisible(prev => !prev);
      } else if (e.key === kb.cycleBackground) {
        cycleBg();
      } else if (e.key === kb.nextPage && settings.pages.length > 1) {
        setCurrentPage((settings.currentPage + 1) % settings.pages.length);
      } else if (e.key === kb.prevPage && settings.pages.length > 1) {
        setCurrentPage((settings.currentPage - 1 + settings.pages.length) % settings.pages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings, activeColumns, focusedCol, focusedLink, update, setCurrentPage]);

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

  const countdownString = (() => {
    if (!settings.countdown.enabled || !settings.countdown.date) return null;
    const target = new Date(settings.countdown.date);
    target.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return `${settings.countdown.label}: today!`;
    if (diffDays > 0) return `${diffDays} days until ${settings.countdown.label}`;
    return `${Math.abs(diffDays)} days since ${settings.countdown.label}`;
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

  const boxBg = settings.frostedGlass 
    ? (settings.background.type === "image" ? "rgba(0,0,0,0.6)" : settings.columnBgColor.replace("rgb", "rgba").replace(")", ", 0.6)")) 
    : (settings.background.type === "image" ? "rgba(0,0,0,0.6)" : settings.columnBgColor);

  const glassStyle: React.CSSProperties = settings.frostedGlass ? {
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  } : {};

  // Simple hex to rgba for frosted glass if it's hex
  const getBoxBg = () => {
    if (!settings.frostedGlass) return boxBg;
    if (boxBg.startsWith("#")) {
      const r = parseInt(boxBg.slice(1, 3), 16);
      const g = parseInt(boxBg.slice(3, 5), 16);
      const b = parseInt(boxBg.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }
    return boxBg;
  };

  const finalBoxBg = getBoxBg();

  const handleDragStart = (index: number) => {
    dragSourceIndex.current = index;
  };

  const handleDrop = (targetIndex: number) => {
    if (dragSourceIndex.current === null) return;
    const newColumns = [...activeColumns];
    const [removed] = newColumns.splice(dragSourceIndex.current, 1);
    newColumns.splice(targetIndex, 0, removed);
    updateActiveColumns(newColumns);
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
            fontSize: settings.compactMode ? "3.5rem" : "5rem",
            fontWeight: 700,
            marginBottom: settings.showDate ? "5px" : "10px",
            letterSpacing: "2px",
          }}
        >
          {timeString}
        </div>

        <WorldClocks 
          clocks={settings.worldClocks} 
          format={settings.clock.format} 
          foregroundColor={settings.foregroundColor} 
          time={time} 
        />

        {settings.motd.enabled && (
          <div
            data-testid="text-motd"
            style={{
              fontSize: "0.9rem",
              fontStyle: "italic",
              opacity: 0.6,
              marginBottom: "10px",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            {isEditingMotd ? (
              <input
                autoFocus
                value={settings.motd.text}
                onChange={(e) => update({ motd: { ...settings.motd, text: e.target.value } })}
                onBlur={() => setIsEditingMotd(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingMotd(false)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: `1px solid ${settings.foregroundColor}`,
                  color: "inherit",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontStyle: "inherit",
                  textAlign: "center",
                  outline: "none"
                }}
              />
            ) : (
              <span onClick={() => setIsEditingMotd(true)}>{settings.motd.text || "Click to set MOTD"}</span>
            )}
          </div>
        )}

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
              fontSize: settings.compactMode ? "1.2rem" : "1.5rem",
              marginBottom: settings.compactMode ? "10px" : "20px",
              opacity: 0.9,
            }}
          >
            {getGreeting()}
          </div>
        )}

        {countdownString && (
          <div
            data-testid="text-countdown"
            style={{
              fontSize: "1rem",
              marginBottom: "10px",
              opacity: 0.7,
            }}
          >
            {countdownString}
          </div>
        )}

        {settings.showWeather && weather && (
          <div
            data-testid="text-weather"
            style={{
              backgroundColor: finalBoxBg,
              ...glassStyle,
              padding: settings.compactMode ? "6px 40px" : "8px 60px",
              borderRadius: "2px",
              fontSize: settings.compactMode ? "1rem" : "1.2rem",
              marginBottom: settings.compactMode ? "10px" : "20px",
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
            columnBgColor={finalBoxBg}
          />
        )}

        <div style={{ 
          display: "flex", 
          gap: settings.compactMode ? "10px" : "15px", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          padding: settings.compactMode ? "10px" : "20px" 
        }}>
          {activeColumns.map((col, colIdx) => (
            <div
              key={colIdx}
              draggable
              onDragStart={() => handleDragStart(colIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(colIdx)}
              style={{
                backgroundColor: finalBoxBg,
                ...glassStyle,
                padding: settings.compactMode ? "12px" : "20px",
                width: settings.compactMode ? "120px" : "140px",
                borderRadius: "2px",
                cursor: "default",
                border: settings.keyboardNavEnabled && focusedCol === colIdx ? `1px solid ${settings.hoverColor}` : "1px solid transparent",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1rem",
                  marginBottom: settings.compactMode ? "10px" : "15px",
                  color: settings.columnHeaderColor || settings.foregroundColor,
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
                      target={settings.openLinksInNewTab ? "_blank" : undefined}
                      rel={settings.openLinksInNewTab ? "noopener noreferrer" : undefined}
                      data-testid={`link-${colIdx}-${linkIdx}`}
                      style={{
                        color: settings.keyboardNavEnabled && focusedCol === colIdx && focusedLink === linkIdx ? settings.hoverColor : settings.linkColor,
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        transition: "color 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = settings.keyboardNavEnabled && focusedCol === colIdx && focusedLink === linkIdx ? settings.hoverColor : settings.linkColor)}
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
              columnBgColor={finalBoxBg}
              hoverColor={settings.hoverColor}
              foregroundColor={settings.foregroundColor}
              linkColor={settings.linkColor}
              columnHeaderColor={settings.columnHeaderColor}
              openLinksInNewTab={settings.openLinksInNewTab}
            />
          ))}
        </div>

        {settings.pages.length > 1 && (
          <div
            style={{
              marginTop: "20px",
              opacity: 0.4,
              fontSize: "0.8rem",
            }}
          >
            {settings.currentPage + 1} / {settings.pages.length}
          </div>
        )}
      </div>

      <ScratchPad 
        isOpen={scratchPadOpen} 
        onClose={() => setScratchPadOpen(false)} 
        foregroundColor={settings.foregroundColor}
        historyEnabled={settings.scratchHistoryEnabled}
        onSaveToHistory={(text) => {
          const history = JSON.parse(localStorage.getItem("origin_scratch_history") || "[]");
          const newHistory = [text, ...history.filter((h: string) => h !== text)].slice(0, 20);
          localStorage.setItem("origin_scratch_history", JSON.stringify(newHistory));
        }}
      />

      <QuickOpen
        isOpen={quickOpenVisible}
        onClose={() => setQuickOpenVisible(false)}
        pages={settings.pages}
        fallbackColumns={settings.columns}
        onOpenLink={(url) => window.open(url, settings.openLinksInNewTab ? "_blank" : "_self", settings.openLinksInNewTab ? "noopener noreferrer" : undefined)}
        foregroundColor={settings.foregroundColor}
      />

      <Calculator
        isOpen={calculatorVisible}
        onClose={() => setCalculatorVisible(false)}
        foregroundColor={settings.foregroundColor}
      />

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdateBackground={updateBackground}
          onUpdateClock={updateClock}
          onUpdateColumns={updateColumns}
          onUpdateKeybinds={updateKeybinds}
          onUpdateActiveColumns={updateActiveColumns}
          onSetCurrentPage={setCurrentPage}
          onAddPage={addPage}
          onRemovePage={removePage}
          onRenamePage={renamePage}
          onImportSettings={importSettings}
          onUpdateBackgroundCycle={updateBackgroundCycle}
          onApplyThemePreset={applyThemePreset}
          onUpdate={update}
          onReset={resetToDefaults}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}
