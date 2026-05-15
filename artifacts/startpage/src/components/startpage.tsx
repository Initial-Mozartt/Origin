import { useState, useEffect, useRef, useCallback } from "react";
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
import { SnakeGame } from "@/components/snake-game";
import { TodoList } from "@/components/todo-list";
import { HabitTracker } from "@/components/habit-tracker";
import { DayProgress } from "@/components/day-progress";
import { WeatherForecast } from "@/components/weather-forecast";
import { HackerNews } from "@/components/hacker-news";
import { Converter } from "@/components/converter";
import { ReadingList } from "@/components/reading-list";
import { PasswordGen } from "@/components/password-gen";
import { StatusBar } from "@/components/status-bar";

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

const WORDS_OF_DAY = [
  { word: "serendipity", def: "the occurrence of fortunate events by chance" },
  { word: "ephemeral", def: "lasting a very short time" },
  { word: "mellifluous", def: "pleasantly smooth and musical to hear" },
  { word: "sonder", def: "the realization that each passerby has a vivid life as complex as your own" },
  { word: "hiraeth", def: "a longing for home that no longer exists" },
  { word: "petrichor", def: "the pleasant smell after rain falls on dry earth" },
  { word: "schadenfreude", def: "pleasure derived from another's misfortune" },
  { word: "ineffable", def: "too great or extreme to be expressed in words" },
  { word: "halcyon", def: "denoting a period of time that was idyllically happy and peaceful" },
  { word: "soliloquy", def: "an act of speaking one's thoughts aloud when alone" },
  { word: "laconic", def: "using very few words to express much" },
  { word: "numinous", def: "having a strong religious or spiritual quality" },
  { word: "oblivion", def: "the state of being unaware or forgotten" },
  { word: "penumbra", def: "the partially shaded outer region of a shadow" },
  { word: "quixotic", def: "exceedingly idealistic and impractical" },
  { word: "reverie", def: "a state of being pleasantly lost in one's thoughts" },
  { word: "sanguine", def: "optimistic, especially in a difficult situation" },
  { word: "tenacious", def: "holding firmly to something, not easily discouraged" },
  { word: "umbra", def: "the fully shaded inner region of a shadow" },
  { word: "verisimilitude", def: "the appearance of being true or real" },
  { word: "wabi-sabi", def: "a Japanese worldview centered on acceptance of transience and imperfection" },
  { word: "xenial", def: "of or relating to hospitality toward guests" },
  { word: "yugen", def: "a profound awareness of the universe that triggers emotional responses" },
  { word: "zephyr", def: "a soft gentle breeze" },
  { word: "liminal", def: "relating to a transitional period between two states" },
  { word: "apophenia", def: "the tendency to perceive meaningful connections between unrelated things" },
  { word: "gossamer", def: "something light, delicate, and insubstantial" },
  { word: "iridescent", def: "showing luminous colors that seem to change when seen from different angles" },
  { word: "lassitude", def: "physical or mental weariness; lack of energy" },
  { word: "nebulous", def: "unclear, vague, or ill-defined" },
  { word: "ossify", def: "to become rigid or inflexible in habits, attitudes, or opinions" },
];

function getMoonPhase(date: Date): string {
  const known = new Date(2000, 0, 6);
  const days = (date.getTime() - known.getTime()) / 86400000;
  const phase = ((days % 29.53) + 29.53) % 29.53;
  if (phase < 1.85) return "● New Moon";
  if (phase < 7.38) return "◑ Waxing Crescent";
  if (phase < 9.22) return "◑ First Quarter";
  if (phase < 14.77) return "◕ Waxing Gibbous";
  if (phase < 16.62) return "○ Full Moon";
  if (phase < 22.15) return "◔ Waning Gibbous";
  if (phase < 24.0) return "◔ Last Quarter";
  return "◐ Waning Crescent";
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
  const [scratchPadOpen, setScratchPadOpen] = useState(false);
  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [focusedCol, setFocusedCol] = useState<number | null>(null);
  const [focusedLink, setFocusedLink] = useState<number | null>(null);
  const [isEditingMotd, setIsEditingMotd] = useState(false);
  const [snakeVisible, setSnakeVisible] = useState(false);
  const [todoVisible, setTodoVisible] = useState(false);
  const [habitsVisible, setHabitsVisible] = useState(false);
  const [hnVisible, setHnVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);
  const [readingListVisible, setReadingListVisible] = useState(false);
  const [passwordGenVisible, setPasswordGenVisible] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);
  const [clipboardHudVisible, setClipboardHudVisible] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dragSourceIndex = useRef<number | null>(null);
  const konamiSeq = useRef<string[]>([]);

  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

  const handleKonami = useCallback((key: string) => {
    konamiSeq.current = [...konamiSeq.current, key].slice(-KONAMI.length);
    if (konamiSeq.current.join(",") === KONAMI.join(",")) {
      konamiSeq.current = [];
      setSnakeVisible(true);
    }
  }, []);

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

  const { weather, coords: weatherCoords } = useWeather(settings.weatherUnit, settings.showWeather);

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

  // Clipboard history
  useEffect(() => {
    if (!settings.clipboardHistoryEnabled) return;
    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text");
      if (text) setClipboardHistory(prev => [text, ...prev.filter(t => t !== text)].slice(0, 10));
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [settings.clipboardHistoryEnabled]);

  // Keybinds — each key toggles its feature on/off
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      handleKonami(e.key);

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
      } else if (e.key === kb.toggleTodo) {
        setTodoVisible(prev => !prev);
      } else if (e.key === kb.toggleHabits) {
        setHabitsVisible(prev => !prev);
      } else if (e.key === kb.toggleFocusMode) {
        setFocusMode(prev => !prev);
      } else if (e.key === kb.toggleConverter) {
        setConverterVisible(prev => !prev);
      } else if (e.key === kb.toggleReadingList) {
        setReadingListVisible(prev => !prev);
      } else if (e.key === kb.togglePasswordGen) {
        setPasswordGenVisible(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings, activeColumns, focusedCol, focusedLink, update, setCurrentPage, handleKonami]);

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

        {!focusMode && settings.showSearchBar && (
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

        {!focusMode && (
          <WorldClocks 
            clocks={settings.worldClocks} 
            format={settings.clock.format} 
            foregroundColor={settings.foregroundColor} 
            time={time} 
          />
        )}

        {!focusMode && settings.motd.enabled && (
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

        {!focusMode && settings.showDate && (
          <div
            data-testid="text-date"
            style={{
              fontSize: "1.2rem",
              marginBottom: "10px",
              opacity: 0.8,
            }}
          >
            {dateString}
            {settings.moonPhaseEnabled && (
              <span style={{ fontSize: "0.8rem", opacity: 0.6, marginLeft: "12px" }}>
                {getMoonPhase(time)}
              </span>
            )}
          </div>
        )}

        {!focusMode && settings.moonPhaseEnabled && !settings.showDate && (
          <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "10px" }}>
            {getMoonPhase(time)}
          </div>
        )}

        {!focusMode && settings.wordOfDayEnabled && (
          <div
            data-testid="text-word-of-day"
            style={{
              fontSize: "0.85rem",
              fontStyle: "italic",
              opacity: 0.55,
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            <span style={{ fontStyle: "normal", opacity: 0.8 }}>
              {WORDS_OF_DAY[dayOfYear % WORDS_OF_DAY.length].word}
            </span>
            {" · "}
            {WORDS_OF_DAY[dayOfYear % WORDS_OF_DAY.length].def}
          </div>
        )}

        {!focusMode && settings.greeting.enabled && (
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

        {!focusMode && countdownString && (
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

        {!focusMode && settings.showWeather && weather && (
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

        {!focusMode && settings.weatherForecastEnabled && weatherCoords && (
          <WeatherForecast
            enabled={settings.weatherForecastEnabled}
            days={settings.weatherForecastDays}
            unit={settings.weatherUnit}
            lat={weatherCoords.latitude}
            lon={weatherCoords.longitude}
            foregroundColor={settings.foregroundColor}
          />
        )}

        {!focusMode && settings.showQuote && (
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

        {!focusMode && settings.pomodoroEnabled && (
          <Pomodoro 
            workMinutes={settings.pomodoroWorkMinutes} 
            breakMinutes={settings.pomodoroBreakMinutes} 
            foregroundColor={settings.foregroundColor}
            columnBgColor={finalBoxBg}
          />
        )}

        {!focusMode && (
        <div style={{ 
          display: "flex", 
          gap: settings.compactMode ? "10px" : "15px", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          padding: settings.compactMode ? "10px" : "20px" 
        }}>
          {activeColumns.map((col, colIdx) => {
            const colBg = col.bgColor
              ? (settings.frostedGlass ? col.bgColor + "99" : col.bgColor)
              : finalBoxBg;
            const colHeaderClr = col.headerColor || settings.columnHeaderColor || settings.foregroundColor;
            return (
            <div
              key={colIdx}
              draggable
              onDragStart={() => handleDragStart(colIdx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(colIdx)}
              style={{
                backgroundColor: colBg,
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
                  color: colHeaderClr,
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
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = settings.keyboardNavEnabled && focusedCol === colIdx && focusedLink === linkIdx ? settings.hoverColor : settings.linkColor)}
                    >
                      {settings.showFavicons && (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=16`}
                          width={14}
                          height={14}
                          style={{ flexShrink: 0, opacity: 0.8 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          alt=""
                        />
                      )}
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}

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
        )}

        {!focusMode && settings.pages.length > 1 && (
          <div style={{ marginTop: "20px", opacity: 0.4, fontSize: "0.8rem" }}>
            {settings.currentPage + 1} / {settings.pages.length}
          </div>
        )}

        {settings.hackerNewsEnabled && (
          <button
            data-testid="button-open-hn"
            onClick={() => setHnVisible(prev => !prev)}
            style={{
              position: "absolute",
              top: "16px",
              right: "56px",
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              color: "#999",
              cursor: "pointer",
              padding: "5px 8px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
          >
            HN
          </button>
        )}

        {settings.clipboardHistoryEnabled && clipboardHistory.length > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: settings.statusBarEnabled ? "36px" : "16px",
              left: "16px",
              zIndex: 500,
            }}
          >
            <button
              data-testid="button-clipboard-history"
              onClick={() => setClipboardHudVisible(prev => !prev)}
              style={{
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                color: "#666",
                cursor: "pointer",
                padding: "4px 8px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              clip ({clipboardHistory.length})
            </button>
            {clipboardHudVisible && (
              <div style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                marginBottom: "4px",
                background: settings.columnBgColor,
                border: "1px solid #44475a",
                borderRadius: "4px",
                padding: "8px",
                minWidth: "200px",
                maxWidth: "300px",
                maxHeight: "200px",
                overflowY: "auto",
              }}>
                {clipboardHistory.map((item, i) => (
                  <div
                    key={i}
                    data-testid={`clipboard-item-${i}`}
                    onClick={() => { navigator.clipboard.writeText(item); setClipboardHudVisible(false); }}
                    style={{
                      padding: "4px 6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      color: settings.linkColor,
                      borderRadius: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = settings.hoverColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = settings.linkColor)}
                  >
                    {item.slice(0, 60)}{item.length > 60 ? "…" : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <DayProgress
        enabled={settings.dayProgressEnabled}
        progressColor={settings.dayProgressColor || settings.hoverColor}
        bgColor={settings.columnBgColor}
      />

      <StatusBar
        enabled={settings.statusBarEnabled}
        text={settings.statusBarText}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
      />

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

      <SnakeGame
        isVisible={snakeVisible}
        onClose={() => setSnakeVisible(false)}
        accentColor={settings.hoverColor}
        foregroundColor={settings.foregroundColor}
      />

      <TodoList
        isOpen={todoVisible}
        onClose={() => setTodoVisible(false)}
        todos={settings.todos}
        onUpdate={(todos) => update({ todos })}
        hoverColor={settings.hoverColor}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
      />

      <HabitTracker
        isOpen={habitsVisible}
        onClose={() => setHabitsVisible(false)}
        habits={settings.habits}
        onUpdate={(habits) => update({ habits })}
        hoverColor={settings.hoverColor}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
      />

      <HackerNews
        isOpen={hnVisible}
        onClose={() => setHnVisible(false)}
        count={settings.hackerNewsCount}
        hoverColor={settings.hoverColor}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
        openInNewTab={settings.openLinksInNewTab}
      />

      <Converter
        isVisible={converterVisible}
        onClose={() => setConverterVisible(false)}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
      />

      <ReadingList
        isOpen={readingListVisible}
        onClose={() => setReadingListVisible(false)}
        readingList={settings.readingList}
        onUpdate={(readingList) => update({ readingList })}
        hoverColor={settings.hoverColor}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
        openInNewTab={settings.openLinksInNewTab}
      />

      <PasswordGen
        isVisible={passwordGenVisible}
        onClose={() => setPasswordGenVisible(false)}
        foregroundColor={settings.foregroundColor}
        bgColor={settings.columnBgColor}
        accentColor={settings.hoverColor}
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
