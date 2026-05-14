import { useState } from "react";
import type { Settings, Column, LinkItem, Background, ClockSettings } from "@/hooks/use-settings";

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
  sectionTitle: {
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "#ff79c6",
    borderBottom: "1px solid #333",
    paddingBottom: "6px",
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
  columnBlock: {
    backgroundColor: "#111111",
    border: "1px solid #2a2a3a",
    borderRadius: "2px",
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
  linkRow: {
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
  onUpdate: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  onUpdateBackground,
  onUpdateClock,
  onUpdateColumns,
  onUpdate,
  onReset,
  onClose,
}: Props) {
  const [imgUrlDraft, setImgUrlDraft] = useState(settings.background.imageUrl);

  function updateColumnHeading(colIdx: number, heading: string) {
    const cols = settings.columns.map((c, i) =>
      i === colIdx ? { ...c, heading } : c
    );
    onUpdateColumns(cols);
  }

  function updateLink(colIdx: number, linkIdx: number, patch: Partial<LinkItem>) {
    const cols = settings.columns.map((c, i) =>
      i === colIdx
        ? {
            ...c,
            links: c.links.map((l, j) => (j === linkIdx ? { ...l, ...patch } : l)),
          }
        : c
    );
    onUpdateColumns(cols);
  }

  function addLink(colIdx: number) {
    const cols = settings.columns.map((c, i) =>
      i === colIdx ? { ...c, links: [...c.links, { name: "New link", url: "https://" }] } : c
    );
    onUpdateColumns(cols);
  }

  function removeLink(colIdx: number, linkIdx: number) {
    const cols = settings.columns.map((c, i) =>
      i === colIdx ? { ...c, links: c.links.filter((_, j) => j !== linkIdx) } : c
    );
    onUpdateColumns(cols);
  }

  function addColumn() {
    onUpdateColumns([
      ...settings.columns,
      { heading: "New Column", links: [{ name: "New link", url: "https://" }] },
    ]);
  }

  function removeColumn(colIdx: number) {
    onUpdateColumns(settings.columns.filter((_, i) => i !== colIdx));
  }

  function applyImageUrl() {
    onUpdateBackground({ imageUrl: imgUrlDraft, type: "image" });
  }

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={S.panel}>
        <div style={S.header}>
          <span style={S.title}>Settings</span>
          <button style={S.closeBtn} onClick={onClose} data-testid="button-close-settings">
            ✕
          </button>
        </div>

        {/* BACKGROUND */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Background</div>

          <div style={S.radioGroup}>
            <label style={S.radioLabel}>
              <input
                type="radio"
                name="bg-type"
                value="color"
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
                value="image"
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
                    data-testid="input-bg-image-url"
                  />
                  <button style={S.btnPink} onClick={applyImageUrl} data-testid="button-apply-image">
                    Apply
                  </button>
                </div>
              </div>
              <div>
                <span style={S.label}>Image fit</span>
                <div style={S.radioGroup}>
                  {(["cover", "contain", "repeat"] as const).map((fit) => (
                    <label key={fit} style={S.radioLabel}>
                      <input
                        type="radio"
                        name="img-fit"
                        value={fit}
                        checked={settings.background.imageFit === fit}
                        onChange={() => onUpdateBackground({ imageFit: fit })}
                        style={S.checkbox}
                      />
                      {fit}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* CLOCK */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Clock</div>
          <div>
            <span style={S.label}>Time format</span>
            <div style={S.radioGroup}>
              <label style={S.radioLabel}>
                <input
                  type="radio"
                  name="clock-format"
                  value="24h"
                  checked={settings.clock.format === "24h"}
                  onChange={() => onUpdateClock({ format: "24h" })}
                  style={S.checkbox}
                />
                24-hour
              </label>
              <label style={S.radioLabel}>
                <input
                  type="radio"
                  name="clock-format"
                  value="12h"
                  checked={settings.clock.format === "12h"}
                  onChange={() => onUpdateClock({ format: "12h" })}
                  style={S.checkbox}
                />
                12-hour
              </label>
            </div>
          </div>
          <label style={{ ...S.radioLabel, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.clock.showSeconds}
              onChange={(e) => onUpdateClock({ showSeconds: e.target.checked })}
              style={S.checkbox}
              data-testid="checkbox-show-seconds"
            />
            Show seconds
          </label>
        </div>

        {/* WEATHER */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Weather</div>
          <label style={{ ...S.radioLabel, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.showWeather}
              onChange={(e) => onUpdate({ showWeather: e.target.checked })}
              style={S.checkbox}
              data-testid="checkbox-show-weather"
            />
            Show weather
          </label>
          {settings.showWeather && (
            <div>
              <span style={S.label}>Temperature unit</span>
              <div style={S.radioGroup}>
                <label style={S.radioLabel}>
                  <input
                    type="radio"
                    name="weather-unit"
                    value="f"
                    checked={settings.weatherUnit === "f"}
                    onChange={() => onUpdate({ weatherUnit: "f" })}
                    style={S.checkbox}
                  />
                  Fahrenheit (°F)
                </label>
                <label style={S.radioLabel}>
                  <input
                    type="radio"
                    name="weather-unit"
                    value="c"
                    checked={settings.weatherUnit === "c"}
                    onChange={() => onUpdate({ weatherUnit: "c" })}
                    style={S.checkbox}
                  />
                  Celsius (°C)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* LINKS */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Link Columns</div>
          {settings.columns.map((col, colIdx) => (
            <div key={colIdx} style={S.columnBlock}>
              <div style={S.columnHeader}>
                <input
                  type="text"
                  value={col.heading}
                  onChange={(e) => updateColumnHeading(colIdx, e.target.value)}
                  style={{ ...S.input, fontWeight: 700 }}
                  data-testid={`input-column-heading-${colIdx}`}
                />
                <button
                  style={S.btnDanger}
                  onClick={() => removeColumn(colIdx)}
                  data-testid={`button-remove-column-${colIdx}`}
                >
                  Remove
                </button>
              </div>
              <div style={S.divider} />
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} style={S.linkRow}>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateLink(colIdx, linkIdx, { name: e.target.value })}
                    placeholder="Label"
                    style={{ ...S.input, flex: "1" }}
                    data-testid={`input-link-name-${colIdx}-${linkIdx}`}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(colIdx, linkIdx, { url: e.target.value })}
                    placeholder="https://"
                    style={{ ...S.input, flex: "2" }}
                    data-testid={`input-link-url-${colIdx}-${linkIdx}`}
                  />
                  <button
                    style={S.btnDanger}
                    onClick={() => removeLink(colIdx, linkIdx)}
                    data-testid={`button-remove-link-${colIdx}-${linkIdx}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                style={S.btn}
                onClick={() => addLink(colIdx)}
                data-testid={`button-add-link-${colIdx}`}
              >
                + Add link
              </button>
            </div>
          ))}
          <button style={S.btnPink} onClick={addColumn} data-testid="button-add-column">
            + Add column
          </button>
        </div>

        {/* RESET */}
        <div style={S.section}>
          <div style={S.sectionTitle}>Reset</div>
          <button
            style={S.btnDanger}
            onClick={() => {
              if (confirm("Reset all settings to defaults?")) onReset();
            }}
            data-testid="button-reset-settings"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
