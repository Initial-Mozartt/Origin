import { useState, useEffect } from "react";
import type { Settings, Column, LinkItem, Background, ClockSettings, Keybinds, RssFeed, BackgroundCycle } from "@/hooks/use-settings";
import { THEME_PRESETS } from "@/hooks/use-settings";

const S = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 100,
    display: "flex",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#1e1f29",
    width: "420px",
    maxWidth: "100vw",
    height: "100vh",
    overflowY: "auto" as const,
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    color: "#f8f8f2",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "0.9rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#f8f8f2",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    fontSize: "1.3rem",
    lineHeight: 1,
    padding: "4px 8px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    borderBottom: "1px solid #333",
    paddingBottom: "6px",
  },
  sectionTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#ff79c6",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    paddingTop: "4px",
  },
  label: {
    fontSize: "0.82rem",
    color: "#ccc",
    marginBottom: "4px",
    display: "block",
  },
  input: {
    width: "100%",
    backgroundColor: "#111111",
    border: "1px solid #333",
    borderRadius: "2px",
    color: "#f8f8f2",
    padding: "6px 8px",
    fontSize: "0.85rem",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  radioGroup: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap" as const,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    color: "#ccc",
    fontSize: "0.85rem",
  },
  checkbox: {
    accentColor: "#ff79c6",
    width: "14px",
    height: "14px",
  },
  btn: {
    backgroundColor: "#111111",
    border: "1px solid #333",
    borderRadius: "2px",
    color: "#f8f8f2",
    padding: "6px 12px",
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "border-color 0.1s",
  },
  btnPink: {
    backgroundColor: "#ff79c6",
    border: "none",
    borderRadius: "2px",
    color: "#282a36",
    padding: "6px 12px",
    fontSize: "0.82rem",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnDanger: {
    backgroundColor: "transparent",
    border: "1px solid #ff5555",
    borderRadius: "2px",
    color: "#ff5555",
    padding: "4px 8px",
    fontSize: "0.78rem",
    cursor: "pointer",
  },
  block: {
    backgroundColor: "#111111",
    border: "1px solid #2a2a3a",
    borderRadius: "2px",
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  row: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  divider: {
    borderTop: "1px solid #2a2a3a",
    margin: "4px 0",
  },
};

interface Props {
  settings: Settings;
  onUpdateBackground: (patch: Partial<Background>) => void;
  onUpdateClock: (patch: Partial<ClockSettings>) => void;
  onUpdateColumns: (cols: Column[]) => void;
  onUpdateKeybinds: (patch: Partial<Keybinds>) => void;
  onUpdateActiveColumns: (cols: Column[]) => void;
  onSetCurrentPage: (n: number) => void;
  onAddPage: (name: string) => void;
  onRemovePage: (n: number) => void;
  onRenamePage: (n: number, name: string) => void;
  onImportSettings: (data: any) => void;
  onUpdateBackgroundCycle: (patch: Partial<BackgroundCycle>) => void;
  onApplyThemePreset: (name: keyof typeof THEME_PRESETS) => void;
  onUpdate: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onClose: () => void;
}

const FONTS = [
  { label: "System", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { label: "Inter", value: "'Inter', sans-serif" },
];

export function SettingsPanel({
  settings,
  onUpdateBackground,
  onUpdateClock,
  onUpdateColumns,
  onUpdateKeybinds,
  onUpdateActiveColumns,
  onSetCurrentPage,
  onAddPage,
  onRemovePage,
  onRenamePage,
  onImportSettings,
  onUpdateBackgroundCycle,
  onApplyThemePreset,
  onUpdate,
  onReset,
  onClose,
}: Props) {
  const [imgUrlDraft, setImgUrlDraft] = useState(settings.background.imageUrl);
  const [bgCycleUrlDraft, setBgCycleUrlDraft] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("background");
  const [recordingKey, setRecordingKey] = useState<keyof Keybinds | null>(null);

  const activeColumns = settings.pages.length > 0 && settings.pages[settings.currentPage]
    ? settings.pages[settings.currentPage].columns
    : settings.columns;

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImportSettings(data);
      } catch (err) {
        alert("Invalid settings file");
      }
    };
    reader.readAsText(file);
  };

  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "origin-settings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBookmarks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const html = event.target?.result as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const h3s = Array.from(doc.querySelectorAll("h3"));
      
      const newCols: Column[] = h3s.map(h3 => {
        const dl = h3.nextElementSibling?.tagName === "DL" ? h3.nextElementSibling : h3.parentElement?.querySelector("dl");
        const links = dl ? Array.from(dl.querySelectorAll("a")).map(a => ({
          name: a.textContent || "",
          url: a.getAttribute("href") || ""
        })) : [];
        return { heading: h3.textContent || "Imported", links };
      }).filter(c => c.links.length > 0);

      if (newCols.length > 0) {
        onUpdateActiveColumns([...activeColumns, ...newCols]);
      } else {
        alert("No bookmarks found");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!recordingKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      onUpdateKeybinds({ [recordingKey]: e.key });
      setRecordingKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recordingKey, onUpdateKeybinds]);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div style={S.section}>
      <div style={S.sectionHeader} onClick={() => toggleSection(id)} data-testid={`section-header-${id}`}>
        <span style={S.sectionTitle}>{title}</span>
        <span style={{ color: "#ff79c6", fontSize: "0.7rem" }}>{openSection === id ? "▲" : "▼"}</span>
      </div>
      {openSection === id && <div style={S.sectionContent}>{children}</div>}
    </div>
  );

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.panel}>
        <div style={S.header}>
          <span style={S.title}>Settings</span>
          <button style={S.closeBtn} onClick={onClose} data-testid="button-close-settings">
            ✕
          </button>
        </div>

        <Section id="background" title="Background">
          <div style={S.radioGroup}>
            <label style={S.radioLabel}>
              <input
                type="radio"
                name="bg-type"
                checked={settings.background.type === "color"}
                onChange={() => onUpdateBackground({ type: "color" })}
                style={S.checkbox}
              />
              Solid color
            </label>
            <label style={S.radioLabel}>
              <input
                type="radio"
                name="bg-type"
                checked={settings.background.type === "image"}
                onChange={() => onUpdateBackground({ type: "image" })}
                style={S.checkbox}
              />
              Image URL
            </label>
          </div>

          {settings.background.type === "color" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={settings.background.color}
                onChange={(e) => onUpdateBackground({ color: e.target.value })}
                style={{ width: "44px", height: "32px", border: "none", cursor: "pointer", background: "none" }}
                data-testid="input-bg-color"
              />
              <input
                type="text"
                value={settings.background.color}
                onChange={(e) => onUpdateBackground({ color: e.target.value })}
                style={{ ...S.input, width: "110px" }}
                data-testid="input-bg-color-hex"
              />
            </div>
          )}

          {settings.background.type === "image" && (
            <>
              <div>
                <span style={S.label}>Image URL</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    value={imgUrlDraft}
                    onChange={(e) => setImgUrlDraft(e.target.value)}
                    placeholder="https://example.com/bg.jpg"
                    style={S.input}
                  />
                  <button style={S.btnPink} onClick={() => onUpdateBackground({ imageUrl: imgUrlDraft, type: "image" })}>
                    Apply
                  </button>
                </div>
              </div>
              <div style={S.radioGroup}>
                {(["cover", "contain", "repeat"] as const).map((fit) => (
                  <label key={fit} style={S.radioLabel}>
                    <input
                      type="radio"
                      name="img-fit"
                      checked={settings.background.imageFit === fit}
                      onChange={() => onUpdateBackground({ imageFit: fit })}
                      style={S.checkbox}
                    />
                    {fit}
                  </label>
                ))}
              </div>
            </>
          )}

          <div style={S.divider} />
          
          <div style={S.block}>
            <span style={S.label}>Background Cycling</span>
            <label style={S.radioLabel}>
              <input
                type="checkbox"
                checked={settings.backgroundCycle.enabled}
                onChange={(e) => onUpdateBackgroundCycle({ enabled: e.target.checked })}
                style={S.checkbox}
              />
              Enable cycling
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={bgCycleUrlDraft}
                onChange={(e) => setBgCycleUrlDraft(e.target.value)}
                placeholder="Image URL"
                style={S.input}
              />
              <button 
                style={S.btnPink} 
                onClick={() => {
                  if (bgCycleUrlDraft) {
                    onUpdateBackgroundCycle({ urls: [...settings.backgroundCycle.urls, bgCycleUrlDraft] });
                    setBgCycleUrlDraft("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {settings.backgroundCycle.urls.map((url, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", opacity: 0.8 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{url}</span>
                  <button 
                    style={{ ...S.btnDanger, padding: "2px 4px", fontSize: "0.6rem" }} 
                    onClick={() => onUpdateBackgroundCycle({ urls: settings.backgroundCycle.urls.filter((_, idx) => idx !== i) })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div style={S.row}>
              <span style={S.label}>Interval (sec, 0=manual):</span>
              <input
                type="number"
                value={settings.backgroundCycle.intervalSeconds}
                onChange={(e) => onUpdateBackgroundCycle({ intervalSeconds: parseInt(e.target.value) || 0 })}
                style={{ ...S.input, width: "60px" }}
              />
            </div>
            <button 
              style={S.btn} 
              onClick={() => {
                const nextIdx = (settings.backgroundCycle.currentIndex + 1) % settings.backgroundCycle.urls.length;
                onUpdateBackgroundCycle({ currentIndex: nextIdx });
                onUpdateBackground({ imageUrl: settings.backgroundCycle.urls[nextIdx], type: "image" });
              }}
              disabled={settings.backgroundCycle.urls.length === 0}
            >
              Cycle Now
            </button>
          </div>

          <div style={S.divider} />

          <div style={S.block}>
            <span style={S.label}>Animated Background</span>
            <label style={S.radioLabel}>
              <input
                type="checkbox"
                checked={settings.animatedBg.enabled}
                onChange={(e) => onUpdate({ animatedBg: { ...settings.animatedBg, enabled: e.target.checked } })}
                style={S.checkbox}
              />
              Enable animation
            </label>
            <div style={S.radioGroup}>
              {(["particles", "gradient"] as const).map((type) => (
                <label key={type} style={S.radioLabel}>
                  <input
                    type="radio"
                    checked={settings.animatedBg.type === type}
                    onChange={() => onUpdate({ animatedBg: { ...settings.animatedBg, type } })}
                    style={S.checkbox}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section id="pages" title="Pages">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {settings.pages.map((page, i) => (
              <div key={i} style={{ ...S.block, borderColor: settings.currentPage === i ? "#ff79c6" : "#2a2a3a" }}>
                <div style={S.blockHeader}>
                  <input
                    type="text"
                    value={page.name}
                    onChange={(e) => onRenamePage(i, e.target.value)}
                    style={{ ...S.input, flex: 1 }}
                  />
                  <div style={S.row}>
                    <button 
                      style={{ ...S.btn, borderColor: settings.currentPage === i ? "#ff79c6" : "#333" }} 
                      onClick={() => onSetCurrentPage(i)}
                    >
                      Select
                    </button>
                    <button style={S.btnDanger} onClick={() => onRemovePage(i)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <button style={S.btnPink} onClick={() => onAddPage("New Page")}>+ Add Page</button>
          </div>
        </Section>

        <Section id="navigation" title="Navigation">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.openLinksInNewTab}
              onChange={(e) => onUpdate({ openLinksInNewTab: e.target.checked })}
              style={S.checkbox}
            />
            Open links in new tab
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.keyboardNavEnabled}
              onChange={(e) => onUpdate({ keyboardNavEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Keyboard column navigation (arrows + numbers)
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.quickOpenEnabled}
              onChange={(e) => onUpdate({ quickOpenEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Quick-open overlay
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.showFavicons}
              onChange={(e) => onUpdate({ showFavicons: e.target.checked })}
              style={S.checkbox}
            />
            Show favicons next to links
          </label>
        </Section>

        <Section id="clock" title="Clock">
          <div style={S.radioGroup}>
            <label style={S.radioLabel}>
              <input
                type="radio"
                checked={settings.clock.format === "24h"}
                onChange={() => onUpdateClock({ format: "24h" })}
                style={S.checkbox}
              />
              24-hour
            </label>
            <label style={S.radioLabel}>
              <input
                type="radio"
                checked={settings.clock.format === "12h"}
                onChange={() => onUpdateClock({ format: "12h" })}
                style={S.checkbox}
              />
              12-hour
            </label>
          </div>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.clock.showSeconds}
              onChange={(e) => onUpdateClock({ showSeconds: e.target.checked })}
              style={S.checkbox}
            />
            Show seconds
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.showDate}
              onChange={(e) => onUpdate({ showDate: e.target.checked })}
              style={S.checkbox}
            />
            Show date
          </label>

          <div style={S.divider} />
          <span style={S.label}>World Clocks</span>
          {settings.worldClocks.map((clock, i) => (
            <div key={i} style={S.row}>
              <input
                type="text"
                value={clock.label}
                onChange={(e) => {
                  const newClocks = [...settings.worldClocks];
                  newClocks[i].label = e.target.value;
                  onUpdate({ worldClocks: newClocks });
                }}
                placeholder="Label"
                style={{ ...S.input, flex: 1 }}
              />
              <input
                type="text"
                value={clock.timezone}
                onChange={(e) => {
                  const newClocks = [...settings.worldClocks];
                  newClocks[i].timezone = e.target.value;
                  onUpdate({ worldClocks: newClocks });
                }}
                placeholder="America/New_York"
                style={{ ...S.input, flex: 2 }}
              />
              <button style={S.btnDanger} onClick={() => onUpdate({ worldClocks: settings.worldClocks.filter((_, idx) => idx !== i) })}>✕</button>
            </div>
          ))}
          <button style={S.btn} onClick={() => onUpdate({ worldClocks: [...settings.worldClocks, { label: "Local", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }] })}>+ Add Clock</button>
        </Section>

        <Section id="countdown" title="Countdown">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.countdown.enabled}
              onChange={(e) => onUpdate({ countdown: { ...settings.countdown, enabled: e.target.checked } })}
              style={S.checkbox}
            />
            Enable countdown
          </label>
          <input
            type="text"
            value={settings.countdown.label}
            onChange={(e) => onUpdate({ countdown: { ...settings.countdown, label: e.target.value } })}
            placeholder="Label"
            style={S.input}
          />
          <input
            type="date"
            value={settings.countdown.date}
            onChange={(e) => onUpdate({ countdown: { ...settings.countdown, date: e.target.value } })}
            style={S.input}
          />
        </Section>

        <Section id="calculator" title="Calculator">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.calculatorEnabled}
              onChange={(e) => onUpdate({ calculatorEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable calculator overlay
          </label>
        </Section>

        <Section id="todo" title="To-Do & Habits">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.todoEnabled}
              onChange={(e) => onUpdate({ todoEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable to-do list ({settings.keybinds.toggleTodo})
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.habitsEnabled}
              onChange={(e) => onUpdate({ habitsEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable habit tracker ({settings.keybinds.toggleHabits})
          </label>
        </Section>

        <Section id="widgets" title="Widgets">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.wordOfDayEnabled}
              onChange={(e) => onUpdate({ wordOfDayEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Word of the day
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.moonPhaseEnabled}
              onChange={(e) => onUpdate({ moonPhaseEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Moon phase
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.dayProgressEnabled}
              onChange={(e) => onUpdate({ dayProgressEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Day progress bar
          </label>
          {settings.dayProgressEnabled && (
            <div style={S.row}>
              <span style={S.label}>Color:</span>
              <input
                type="color"
                value={settings.dayProgressColor || settings.hoverColor}
                onChange={(e) => onUpdate({ dayProgressColor: e.target.value })}
                style={{ width: "44px", height: "32px", border: "none", cursor: "pointer", background: "none" }}
              />
            </div>
          )}
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.statusBarEnabled}
              onChange={(e) => onUpdate({ statusBarEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Status bar
          </label>
          {settings.statusBarEnabled && (
            <input
              type="text"
              value={settings.statusBarText}
              onChange={(e) => onUpdate({ statusBarText: e.target.value })}
              placeholder="Status bar text"
              style={S.input}
            />
          )}
        </Section>

        <Section id="feeds" title="Feeds">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.hackerNewsEnabled}
              onChange={(e) => onUpdate({ hackerNewsEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Hacker News feed
          </label>
          {settings.hackerNewsEnabled && (
            <div style={S.row}>
              <span style={S.label}>Count:</span>
              <input
                type="number"
                value={settings.hackerNewsCount}
                onChange={(e) => onUpdate({ hackerNewsCount: parseInt(e.target.value) || 5 })}
                style={{ ...S.input, width: "60px" }}
              />
            </div>
          )}
        </Section>

        <Section id="tools" title="Tools">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.converterEnabled}
              onChange={(e) => onUpdate({ converterEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Converter ({settings.keybinds.toggleConverter})
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.readingListEnabled}
              onChange={(e) => onUpdate({ readingListEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Reading list ({settings.keybinds.toggleReadingList})
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.passwordGenEnabled}
              onChange={(e) => onUpdate({ passwordGenEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Password generator ({settings.keybinds.togglePasswordGen})
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.clipboardHistoryEnabled}
              onChange={(e) => onUpdate({ clipboardHistoryEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Clipboard history (in-session)
          </label>
        </Section>

        <Section id="display" title="Display">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.autoTheme}
              onChange={(e) => onUpdate({ autoTheme: e.target.checked })}
              style={S.checkbox}
            />
            Auto dark/light mode
          </label>
        </Section>

        <Section id="weather" title="Weather">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.showWeather}
              onChange={(e) => onUpdate({ showWeather: e.target.checked })}
              style={S.checkbox}
            />
            Show weather
          </label>
          {settings.showWeather && (
            <>
              <div style={S.radioGroup}>
                <label style={S.radioLabel}>
                  <input
                    type="radio"
                    checked={settings.weatherUnit === "f"}
                    onChange={() => onUpdate({ weatherUnit: "f" })}
                    style={S.checkbox}
                  />
                  Fahrenheit (°F)
                </label>
                <label style={S.radioLabel}>
                  <input
                    type="radio"
                    checked={settings.weatherUnit === "c"}
                    onChange={() => onUpdate({ weatherUnit: "c" })}
                    style={S.checkbox}
                  />
                  Celsius (°C)
                </label>
              </div>
              <div style={S.divider} />
              <label style={S.radioLabel}>
                <input
                  type="checkbox"
                  checked={settings.weatherForecastEnabled}
                  onChange={(e) => onUpdate({ weatherForecastEnabled: e.target.checked })}
                  style={S.checkbox}
                />
                Show forecast
              </label>
              {settings.weatherForecastEnabled && (
                <div style={S.row}>
                  <span style={S.label}>Days (1-7):</span>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={settings.weatherForecastDays}
                    onChange={(e) => onUpdate({ weatherForecastDays: parseInt(e.target.value) || 3 })}
                    style={{ ...S.input, width: "60px" }}
                  />
                </div>
              )}
            </>
          )}
        </Section>

        <Section id="themes" title="Visual & Themes">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.keys(THEME_PRESETS).map((name) => (
              <button
                key={name}
                style={{
                  ...S.btn,
                  borderColor: settings.themePreset === name ? "#ff79c6" : "#333",
                  color: settings.themePreset === name ? "#ff79c6" : "#f8f8f2",
                }}
                onClick={() => onApplyThemePreset(name as keyof typeof THEME_PRESETS)}
              >
                {name}
              </button>
            ))}
          </div>
          <div>
            <span style={S.label}>Font Family</span>
            <select
              value={settings.fontFamily}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              style={S.input}
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={S.divider} />
          
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.frostedGlass}
              onChange={(e) => onUpdate({ frostedGlass: e.target.checked })}
              style={S.checkbox}
            />
            Frosted glass effect
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => onUpdate({ compactMode: e.target.checked })}
              style={S.checkbox}
            />
            Compact mode
          </label>

          <div style={S.row}>
            <div style={{ flex: 1 }}>
              <span style={S.label}>Link Color</span>
              <input
                type="color"
                value={settings.linkColor}
                onChange={(e) => onUpdate({ linkColor: e.target.value })}
                style={{ width: "100%", height: "32px", border: "none", cursor: "pointer", background: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={S.label}>Header Color</span>
              <input
                type="color"
                value={settings.columnHeaderColor || settings.foregroundColor}
                onChange={(e) => onUpdate({ columnHeaderColor: e.target.value })}
                style={{ width: "100%", height: "32px", border: "none", cursor: "pointer", background: "none" }}
              />
              <button 
                style={{ ...S.btn, width: "100%", marginTop: "4px", fontSize: "0.7rem" }} 
                onClick={() => onUpdate({ columnHeaderColor: "" })}
              >
                Reset to text color
              </button>
            </div>
          </div>

          <div style={S.divider} />
          <div>
            <span style={S.label}>Column Background Color</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="color"
                value={settings.columnBgColor}
                onChange={(e) => onUpdate({ columnBgColor: e.target.value, themePreset: "custom" })}
                style={{ width: "44px", height: "32px", border: "none", cursor: "pointer", background: "none" }}
              />
              <input
                type="text"
                value={settings.columnBgColor}
                onChange={(e) => onUpdate({ columnBgColor: e.target.value, themePreset: "custom" })}
                style={{ ...S.input, width: "110px" }}
              />
            </div>
          </div>
          <div>
            <span style={S.label}>Foreground Color</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="color"
                value={settings.foregroundColor}
                onChange={(e) => onUpdate({ foregroundColor: e.target.value, themePreset: "custom" })}
                style={{ width: "44px", height: "32px", border: "none", cursor: "pointer", background: "none" }}
              />
              <input
                type="text"
                value={settings.foregroundColor}
                onChange={(e) => onUpdate({ foregroundColor: e.target.value, themePreset: "custom" })}
                style={{ ...S.input, width: "110px" }}
              />
            </div>
          </div>
        </Section>

        <Section id="search" title="Search Bar">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.showSearchBar}
              onChange={(e) => onUpdate({ showSearchBar: e.target.checked })}
              style={S.checkbox}
            />
            Show search bar
          </label>
          {settings.showSearchBar && (
            <div style={S.radioGroup}>
              {(["google", "duckduckgo", "brave", "bing"] as const).map((engine) => (
                <label key={engine} style={S.radioLabel}>
                  <input
                    type="radio"
                    checked={settings.searchEngine === engine}
                    onChange={() => onUpdate({ searchEngine: engine })}
                    style={S.checkbox}
                  />
                  {engine}
                </label>
              ))}
            </div>
          )}
        </Section>

        <Section id="greeting" title="Greeting">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.greeting.enabled}
              onChange={(e) => onUpdate({ greeting: { ...settings.greeting, enabled: e.target.checked } })}
              style={S.checkbox}
            />
            Show greeting
          </label>
          {settings.greeting.enabled && (
            <input
              type="text"
              value={settings.greeting.name}
              onChange={(e) => onUpdate({ greeting: { ...settings.greeting, name: e.target.value } })}
              placeholder="Your name"
              style={S.input}
            />
          )}
        </Section>

        <Section id="quote" title="Quote">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.showQuote}
              onChange={(e) => onUpdate({ showQuote: e.target.checked })}
              style={S.checkbox}
            />
            Show daily quote
          </label>
        </Section>

        <Section id="scratchpad" title="Scratch Pad">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.scratchPadEnabled}
              onChange={(e) => onUpdate({ scratchPadEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable scratch pad
          </label>
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.scratchHistoryEnabled}
              onChange={(e) => onUpdate({ scratchHistoryEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable scratch history
          </label>
        </Section>

        <Section id="pomodoro" title="Pomodoro">
          <label style={S.radioLabel}>
            <input
              type="checkbox"
              checked={settings.pomodoroEnabled}
              onChange={(e) => onUpdate({ pomodoroEnabled: e.target.checked })}
              style={S.checkbox}
            />
            Enable pomodoro
          </label>
          {settings.pomodoroEnabled && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <span style={S.label}>Work (min)</span>
                <input
                  type="number"
                  value={settings.pomodoroWorkMinutes}
                  onChange={(e) => onUpdate({ pomodoroWorkMinutes: parseInt(e.target.value) || 1 })}
                  style={S.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={S.label}>Break (min)</span>
                <input
                  type="number"
                  value={settings.pomodoroBreakMinutes}
                  onChange={(e) => onUpdate({ pomodoroBreakMinutes: parseInt(e.target.value) || 1 })}
                  style={S.input}
                />
              </div>
            </div>
          )}
        </Section>

        <Section id="rss" title="RSS Feeds">
          {settings.rssFeeds.map((feed, idx) => (
            <div key={idx} style={S.block}>
              <div style={S.blockHeader}>
                <span style={S.label}>Feed {idx + 1}</span>
                <button
                  style={S.btnDanger}
                  onClick={() => onUpdate({ rssFeeds: settings.rssFeeds.filter((_, i) => i !== idx) })}
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={feed.label}
                onChange={(e) => {
                  const newFeeds = [...settings.rssFeeds];
                  newFeeds[idx].label = e.target.value;
                  onUpdate({ rssFeeds: newFeeds });
                }}
                placeholder="Label"
                style={S.input}
              />
              <input
                type="text"
                value={feed.url}
                onChange={(e) => {
                  const newFeeds = [...settings.rssFeeds];
                  newFeeds[idx].url = e.target.value;
                  onUpdate({ rssFeeds: newFeeds });
                }}
                placeholder="RSS URL"
                style={S.input}
              />
              <div style={S.row}>
                <span style={S.label}>Max items:</span>
                <input
                  type="number"
                  value={feed.maxItems}
                  onChange={(e) => {
                    const newFeeds = [...settings.rssFeeds];
                    newFeeds[idx].maxItems = parseInt(e.target.value) || 1;
                    onUpdate({ rssFeeds: newFeeds });
                  }}
                  style={{ ...S.input, width: "60px" }}
                />
              </div>
            </div>
          ))}
          <button
            style={S.btnPink}
            onClick={() => onUpdate({ rssFeeds: [...settings.rssFeeds, { url: "", label: "New Feed", maxItems: 5 }] })}
          >
            + Add Feed
          </button>
        </Section>

        <Section id="links" title="Link Columns">
          <div style={S.row}>
            <button style={{ ...S.btn, flex: 1 }} onClick={() => document.getElementById("bookmark-import")?.click()}>
              Import Bookmarks HTML
            </button>
            <input
              id="bookmark-import"
              type="file"
              accept=".html"
              style={{ display: "none" }}
              onChange={handleImportBookmarks}
            />
          </div>
          {activeColumns.map((col, colIdx) => (
            <div key={colIdx} style={S.block}>
              <div style={S.blockHeader}>
                <input
                  type="text"
                  value={col.heading}
                  onChange={(e) => {
                    const cols = [...activeColumns];
                    cols[colIdx].heading = e.target.value;
                    onUpdateActiveColumns(cols);
                  }}
                  style={{ ...S.input, fontWeight: 700 }}
                />
                <button
                  style={S.btnDanger}
                  onClick={() => onUpdateActiveColumns(activeColumns.filter((_, i) => i !== colIdx))}
                >
                  Remove
                </button>
              </div>
              <div style={S.row}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                  <span style={S.label}>BG</span>
                  <input
                    type="color"
                    value={col.bgColor || "#111111"}
                    onChange={(e) => {
                      const newCols = [...activeColumns];
                      newCols[colIdx].bgColor = e.target.value;
                      onUpdateActiveColumns(newCols);
                    }}
                    style={{ width: "24px", height: "24px", border: "none", background: "none", padding: 0 }}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                  <span style={S.label}>Header</span>
                  <input
                    type="color"
                    value={col.headerColor || "#ff79c6"}
                    onChange={(e) => {
                      const newCols = [...activeColumns];
                      newCols[colIdx].headerColor = e.target.value;
                      onUpdateActiveColumns(newCols);
                    }}
                    style={{ width: "24px", height: "24px", border: "none", background: "none", padding: 0 }}
                  />
                </div>
              </div>
              <div style={S.divider} />
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} style={S.row}>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const cols = [...activeColumns];
                      cols[colIdx].links[linkIdx].name = e.target.value;
                      onUpdateActiveColumns(cols);
                    }}
                    placeholder="Label"
                    style={{ ...S.input, flex: "1" }}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const cols = [...activeColumns];
                      cols[colIdx].links[linkIdx].url = e.target.value;
                      onUpdateActiveColumns(cols);
                    }}
                    placeholder="https://"
                    style={{ ...S.input, flex: "2" }}
                  />
                  <button
                    style={S.btnDanger}
                    onClick={() => {
                      const cols = [...activeColumns];
                      cols[colIdx].links = cols[colIdx].links.filter((_, i) => i !== linkIdx);
                      onUpdateActiveColumns(cols);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                style={S.btn}
                onClick={() => {
                  const cols = [...activeColumns];
                  cols[colIdx].links.push({ name: "", url: "" });
                  onUpdateActiveColumns(cols);
                }}
              >
                + Add Link
              </button>
            </div>
          ))}
          <button
            style={S.btnPink}
            onClick={() => onUpdateActiveColumns([...activeColumns, { heading: "New Column", links: [] }])}
          >
            + Add Column
          </button>
        </Section>

        <Section id="keybinds" title="Keybinds">
          <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "4px" }}>
            Each key toggles its feature on or off. Does not fire when typing in an input.
          </div>
          {(
            [
              ["openSettings",   "Open / close settings"],
              ["toggleSearch",   "Show / hide search bar"],
              ["toggleWeather",  "Show / hide weather"],
              ["toggleDate",     "Show / hide date"],
              ["toggleGreeting", "Show / hide greeting"],
              ["toggleQuote",    "Show / hide quote"],
              ["toggleScratchPad", "Open / close scratch pad"],
              ["togglePomodoro", "Show / hide pomodoro"],
              ["toggleCalculator", "Show / hide calculator"],
              ["toggleQuickOpen", "Open / close quick open"],
              ["cycleBackground", "Cycle background image"],
              ["nextPage", "Next page"],
              ["prevPage", "Previous page"],
            ] as [keyof Keybinds, string][]
          ).map(([action, label]) => (
            <div key={action} style={{ ...S.row, justifyContent: "space-between" }}>
              <span style={{ ...S.label, marginBottom: 0 }}>{label}</span>
              <div style={S.row}>
                <code style={{ backgroundColor: "#111", padding: "2px 8px", borderRadius: "2px", fontSize: "0.85rem", minWidth: "28px", textAlign: "center" }}>
                  {recordingKey === action ? "..." : (settings.keybinds[action] || "—")}
                </code>
                <button
                  style={{ ...S.btn, padding: "3px 8px", fontSize: "0.78rem" }}
                  onClick={() => setRecordingKey(action)}
                  data-testid={`button-record-keybind-${action}`}
                >
                  {recordingKey === action ? "press a key" : "change"}
                </button>
              </div>
            </div>
          ))}
        </Section>

        <Section id="data" title="Data">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={S.btnPink} onClick={handleExportSettings}>Export Settings (JSON)</button>
            <div style={S.divider} />
            <span style={S.label}>Import Settings (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              style={{ ...S.input, padding: "4px" }}
            />
          </div>
        </Section>

        <Section id="custom-css" title="Custom CSS">
          <textarea
            value={settings.customCss}
            onChange={(e) => onUpdate({ customCss: e.target.value })}
            placeholder="/* Your CSS here */"
            style={{ ...S.input, height: "120px", fontFamily: "monospace" }}
          />
        </Section>

        <Section id="reset" title="Reset">
          <button
            style={S.btnDanger}
            onClick={() => {
              if (confirm("Reset all settings to defaults?")) onReset();
            }}
          >
            Reset to defaults
          </button>
        </Section>
      </div>
    </div>
  );
}
