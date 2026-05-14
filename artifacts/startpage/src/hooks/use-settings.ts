import { useState, useEffect } from "react";

export interface LinkItem {
  name: string;
  url: string;
}

export interface Column {
  heading: string;
  links: LinkItem[];
}

export interface RssFeed {
  url: string;
  label: string;
  maxItems: number;
}

export interface Background {
  type: "color" | "image";
  color: string;
  imageUrl: string;
  imageFit: "cover" | "contain" | "repeat";
}

export interface ClockSettings {
  format: "12h" | "24h";
  showSeconds: boolean;
}

export interface Keybinds {
  openSettings: string;
  focusSearch: string;
  toggleScratchPad: string;
  togglePomodoro: string;
}

export interface Settings {
  columns: Column[];
  background: Background;
  clock: ClockSettings;
  showWeather: boolean;
  weatherUnit: "f" | "c";
  showDate: boolean;
  greeting: { enabled: boolean; name: string };
  showSearchBar: boolean;
  searchEngine: "google" | "duckduckgo" | "brave" | "bing";
  showQuote: boolean;
  scratchPadEnabled: boolean;
  pomodoroEnabled: boolean;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  rssFeeds: RssFeed[];
  themePreset: "custom" | "dracula" | "nord" | "gruvbox" | "catppuccin" | "tokyo-night";
  columnBgColor: string;
  hoverColor: string;
  foregroundColor: string;
  fontFamily: string;
  customCss: string;
  keybinds: Keybinds;
}

export const THEME_PRESETS = {
  dracula: { bg: "#282a36", col: "#111111", hover: "#ff79c6", fg: "#f8f8f2" },
  nord: { bg: "#2e3440", col: "#3b4252", hover: "#88c0d0", fg: "#eceff4" },
  gruvbox: { bg: "#282828", col: "#1d2021", hover: "#fabd2f", fg: "#ebdbb2" },
  catppuccin: { bg: "#1e1e2e", col: "#181825", hover: "#f38ba8", fg: "#cdd6f4" },
  "tokyo-night": { bg: "#1a1b26", col: "#16161e", hover: "#7aa2f7", fg: "#c0caf5" },
};

export const DEFAULT_COLUMNS: Column[] = [
  {
    heading: "Linux News",
    links: [
      { name: "DistroTube.com", url: "https://distrotube.com" },
      { name: "LinuxToday", url: "https://linuxtoday.com" },
      { name: "LinuxInsider", url: "https://linuxinsider.com" },
      { name: "OMG Ubuntu", url: "https://omgubuntu.co.uk" },
      { name: "Phoronix", url: "https://phoronix.com" },
    ],
  },
  {
    heading: "Arch Linux",
    links: [
      { name: "Arch Wiki", url: "https://wiki.archlinux.org" },
      { name: "Packages", url: "https://archlinux.org/packages" },
      { name: "AUR Home", url: "https://aur.archlinux.org" },
      { name: "Arch Forums", url: "https://bbs.archlinux.org" },
    ],
  },
  {
    heading: "Suckless",
    links: [
      { name: "Homepage", url: "https://suckless.org" },
      { name: "dwm", url: "https://dwm.suckless.org" },
      { name: "st", url: "https://st.suckless.org" },
      { name: "dmenu", url: "https://tools.suckless.org/dmenu" },
    ],
  },
  {
    heading: "Social",
    links: [
      { name: "YouTube", url: "https://youtube.com" },
      { name: "GitLab", url: "https://gitlab.com" },
      { name: "GitHub", url: "https://github.com" },
      { name: "Mastodon", url: "https://mastodon.social" },
    ],
  },
  {
    heading: "Reddit",
    links: [
      { name: "/r/linux", url: "https://reddit.com/r/linux" },
      { name: "/r/archlinux", url: "https://reddit.com/r/archlinux" },
      { name: "/r/suckless", url: "https://reddit.com/r/suckless" },
    ],
  },
];

export const DEFAULT_SETTINGS: Settings = {
  columns: DEFAULT_COLUMNS,
  background: {
    type: "color",
    color: "#282a36",
    imageUrl: "",
    imageFit: "cover",
  },
  clock: {
    format: "24h",
    showSeconds: true,
  },
  showWeather: true,
  weatherUnit: "f",
  showDate: false,
  greeting: { enabled: false, name: "" },
  showSearchBar: false,
  searchEngine: "google",
  showQuote: false,
  scratchPadEnabled: false,
  pomodoroEnabled: false,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  rssFeeds: [],
  themePreset: "dracula",
  columnBgColor: "#111111",
  hoverColor: "#ff79c6",
  foregroundColor: "#f8f8f2",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  customCss: "",
  keybinds: {
    openSettings: ",",
    focusSearch: "/",
    toggleScratchPad: "n",
    togglePomodoro: "p",
  },
};

const STORAGE_KEY = "startpage_settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      background: { ...DEFAULT_SETTINGS.background, ...parsed.background },
      clock: { ...DEFAULT_SETTINGS.clock, ...parsed.clock },
      greeting: { ...DEFAULT_SETTINGS.greeting, ...parsed.greeting },
      keybinds: { ...DEFAULT_SETTINGS.keybinds, ...parsed.keybinds },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  function update(patch: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function updateBackground(patch: Partial<Background>) {
    setSettings((prev) => ({
      ...prev,
      background: { ...prev.background, ...patch },
      themePreset: "custom",
    }));
  }

  function updateClock(patch: Partial<ClockSettings>) {
    setSettings((prev) => ({
      ...prev,
      clock: { ...prev.clock, ...patch },
    }));
  }

  function updateColumns(columns: Column[]) {
    setSettings((prev) => ({ ...prev, columns }));
  }

  function updateKeybinds(patch: Partial<Keybinds>) {
    setSettings((prev) => ({
      ...prev,
      keybinds: { ...prev.keybinds, ...patch },
    }));
  }

  function applyThemePreset(presetName: keyof typeof THEME_PRESETS) {
    const preset = THEME_PRESETS[presetName];
    setSettings((prev) => ({
      ...prev,
      themePreset: presetName,
      background: { ...prev.background, color: preset.bg },
      columnBgColor: preset.col,
      hoverColor: preset.hover,
      foregroundColor: preset.fg,
    }));
  }

  function resetToDefaults() {
    setSettings(DEFAULT_SETTINGS);
  }

  return {
    settings,
    update,
    updateBackground,
    updateClock,
    updateColumns,
    updateKeybinds,
    applyThemePreset,
    resetToDefaults,
  };
}
