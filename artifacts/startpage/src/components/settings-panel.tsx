import { useState, useEffect } from "react";
import type { Settings, Column, LinkItem, Background, ClockSettings, Keybinds, RssFeed } from "@/hooks/use-settings";
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
  onApplyThemePreset,
  onUpdate,
  onReset,
  onClose,
}: Props) {
  const [imgUrlDraft, setImgUrlDraft] = useState(settings.background.imageUrl);
  const [openSection, setOpenSection] = useState<string | null>("background");
  const [recordingKey, setRecordingKey] = useState<keyof Keybinds | null>(null);

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
          )}
        </Section>

        <Section id="themes" title="Theme Presets">
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
          {settings.columns.map((col, colIdx) => (
            <div key={colIdx} style={S.block}>
              <div style={S.blockHeader}>
                <input
                  type="text"
                  value={col.heading}
                  onChange={(e) => {
                    const cols = [...settings.columns];
                    cols[colIdx].heading = e.target.value;
                    onUpdateColumns(cols);
                  }}
                  style={{ ...S.input, fontWeight: 700 }}
                />
                <button
                  style={S.btnDanger}
                  onClick={() => onUpdateColumns(settings.columns.filter((_, i) => i !== colIdx))}
                >
                  Remove
                </button>
              </div>
              <div style={S.divider} />
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} style={S.row}>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => {
                      const cols = [...settings.columns];
                      cols[colIdx].links[linkIdx].name = e.target.value;
                      onUpdateColumns(cols);
                    }}
                    placeholder="Label"
                    style={{ ...S.input, flex: "1" }}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const cols = [...settings.columns];
                      cols[colIdx].links[linkIdx].url = e.target.value;
                      onUpdateColumns(cols);
                    }}
                    placeholder="https://"
                    style={{ ...S.input, flex: "2" }}
                  />
                  <button
                    style={S.btnDanger}
                    onClick={() => {
                      const cols = [...settings.columns];
                      cols[colIdx].links = cols[colIdx].links.filter((_, i) => i !== linkIdx);
                      onUpdateColumns(cols);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                style={S.btn}
                onClick={() => {
                  const cols = [...settings.columns];
                  cols[colIdx].links.push({ name: "New link", url: "https://" });
                  onUpdateColumns(cols);
                }}
              >
                + Add link
              </button>
            </div>
          ))}
          <button
            style={S.btnPink}
            onClick={() => onUpdateColumns([...settings.columns, { heading: "New Column", links: [] }])}
          >
            + Add column
          </button>
        </Section>

        <Section id="keybinds" title="Keybinds">
          {(Object.entries(settings.keybinds) as [keyof Keybinds, string][]).map(([action, key]) => (
            <div key={action} style={{ ...S.row, justifyContent: "space-between" }}>
              <span style={S.label}>{action.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
              <div style={S.row}>
                <code style={{ backgroundColor: "#111", padding: "2px 6px", borderRadius: "2px", fontSize: "0.8rem" }}>
                  {recordingKey === action ? "press a key..." : key}
                </code>
                <button style={S.btn} onClick={() => setRecordingKey(action)}>
                  Record
                </button>
              </div>
            </div>
          ))}
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
