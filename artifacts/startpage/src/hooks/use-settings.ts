import { useState, useEffect } from "react";

export interface LinkItem {
  name: string;
  url: string;
}

export interface Column {
  heading: string;
  links: LinkItem[];
  bgColor?: string;
  headerColor?: string;
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
  toggleSearch: string;
  toggleWeather: string;
  toggleDate: string;
  toggleGreeting: string;
  toggleQuote: string;
  toggleScratchPad: string;
  togglePomodoro: string;
  toggleCalculator: string;
  toggleQuickOpen: string;
  cycleBackground: string;
  nextPage: string;
  prevPage: string;
  toggleTodo: string;
  toggleHabits: string;
  toggleFocusMode: string;
  toggleConverter: string;
  toggleReadingList: string;
  togglePasswordGen: string;
}

export interface Page {
  name: string;
  columns: Column[];
}

export interface WorldClock {
  label: string;
  timezone: string;
}

export interface BackgroundCycle {
  enabled: boolean;
  urls: string[];
  intervalSeconds: number;
  currentIndex: number;
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
  openLinksInNewTab: boolean;
  keyboardNavEnabled: boolean;
  quickOpenEnabled: boolean;
  pages: Page[];
  currentPage: number;
  worldClocks: WorldClock[];
  countdown: { enabled: boolean; label: string; date: string };
  calculatorEnabled: boolean;
  motd: { enabled: boolean; text: string };
  frostedGlass: boolean;
  linkColor: string;
  columnHeaderColor: string;
  compactMode: boolean;
  scratchHistoryEnabled: boolean;
  backgroundCycle: BackgroundCycle;
  todoEnabled: boolean;
  todos: Array<{ id: string; text: string; completed: boolean; createdAt: number }>;
  habitsEnabled: boolean;
  habits: Array<{ id: string; name: string; completedDates: string[] }>;
  dayProgressEnabled: boolean;
  dayProgressColor: string;
  weatherForecastEnabled: boolean;
  weatherForecastDays: number;
  wordOfDayEnabled: boolean;
  moonPhaseEnabled: boolean;
  hackerNewsEnabled: boolean;
  hackerNewsCount: number;
  showFavicons: boolean;
  animatedBg: { enabled: boolean; type: "particles" | "gradient" | "none" };
  autoTheme: boolean;
  statusBarEnabled: boolean;
  statusBarText: string;
  converterEnabled: boolean;
  readingListEnabled: boolean;
  readingList: Array<{ id: string; title: string; url: string; addedAt: number }>;
  passwordGenEnabled: boolean;
  clipboardHistoryEnabled: boolean;
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
    toggleSearch: "/",
    toggleWeather: "w",
    toggleDate: "d",
    toggleGreeting: "g",
    toggleQuote: "q",
    toggleScratchPad: "n",
    togglePomodoro: "p",
    toggleCalculator: "c",
    toggleQuickOpen: "o",
    cycleBackground: "b",
    nextPage: "]",
    prevPage: "[",
    toggleTodo: "t",
    toggleHabits: "h",
    toggleFocusMode: "f",
    toggleConverter: "u",
    toggleReadingList: "r",
    togglePasswordGen: "k",
  },
  openLinksInNewTab: false,
  keyboardNavEnabled: false,
  quickOpenEnabled: false,
  pages: [],
  currentPage: 0,
  worldClocks: [],
  countdown: { enabled: false, label: "", date: "" },
  calculatorEnabled: false,
  motd: { enabled: false, text: "" },
  frostedGlass: false,
  linkColor: "#999999",
  columnHeaderColor: "",
  compactMode: false,
  scratchHistoryEnabled: false,
  backgroundCycle: { enabled: false, urls: [], intervalSeconds: 0, currentIndex: 0 },
  todoEnabled: false,
  todos: [],
  habitsEnabled: false,
  habits: [],
  dayProgressEnabled: false,
  dayProgressColor: "",
  weatherForecastEnabled: false,
  weatherForecastDays: 3,
  wordOfDayEnabled: false,
  moonPhaseEnabled: false,
  hackerNewsEnabled: false,
  hackerNewsCount: 5,
  showFavicons: false,
  animatedBg: { enabled: false, type: "particles" },
  autoTheme: false,
  statusBarEnabled: false,
  statusBarText: "",
  converterEnabled: false,
  readingListEnabled: false,
  readingList: [],
  passwordGenEnabled: false,
  clipboardHistoryEnabled: false,
};

const STORAGE_KEY = "startpage_settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    
    // Deep merge for nested objects
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      background: { ...DEFAULT_SETTINGS.background, ...parsed.background },
      clock: { ...DEFAULT_SETTINGS.clock, ...parsed.clock },
      greeting: { ...DEFAULT_SETTINGS.greeting, ...parsed.greeting },
      keybinds: { ...DEFAULT_SETTINGS.keybinds, ...parsed.keybinds },
      countdown: { ...DEFAULT_SETTINGS.countdown, ...parsed.countdown },
      motd: { ...DEFAULT_SETTINGS.motd, ...parsed.motd },
      backgroundCycle: { ...DEFAULT_SETTINGS.backgroundCycle, ...parsed.backgroundCycle },
      animatedBg: { ...DEFAULT_SETTINGS.animatedBg, ...parsed.animatedBg },
      pages: parsed.pages || DEFAULT_SETTINGS.pages,
      worldClocks: parsed.worldClocks || DEFAULT_SETTINGS.worldClocks,
      todos: parsed.todos || DEFAULT_SETTINGS.todos,
      habits: parsed.habits || DEFAULT_SETTINGS.habits,
      readingList: parsed.readingList || DEFAULT_SETTINGS.readingList,
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

  function updateActiveColumns(columns: Column[]) {
    setSettings((prev) => {
      if (prev.pages.length > 0) {
        const newPages = [...prev.pages];
        newPages[prev.currentPage] = { ...newPages[prev.currentPage], columns };
        return { ...prev, pages: newPages };
      }
      return { ...prev, columns };
    });
  }

  function setCurrentPage(n: number) {
    setSettings((prev) => ({ ...prev, currentPage: n }));
  }

  function addPage(name: string) {
    setSettings((prev) => {
      const initialColumns = prev.pages.length === 0 ? prev.columns : [];
      const newPages = prev.pages.length === 0 
        ? [{ name: "Home", columns: prev.columns }, { name, columns: [] }]
        : [...prev.pages, { name, columns: [] }];
      return {
        ...prev,
        pages: newPages,
        currentPage: newPages.length - 1
      };
    });
  }

  function removePage(n: number) {
    setSettings((prev) => {
      const newPages = prev.pages.filter((_, i) => i !== n);
      let newCurrent = prev.currentPage;
      if (newCurrent >= newPages.length) newCurrent = Math.max(0, newPages.length - 1);
      return {
        ...prev,
        pages: newPages,
        currentPage: newCurrent
      };
    });
  }

  function renamePage(n: number, name: string) {
    setSettings((prev) => {
      const newPages = [...prev.pages];
      newPages[n] = { ...newPages[n], name };
      return { ...prev, pages: newPages };
    });
  }

  function importSettings(data: any) {
    setSettings((prev) => ({
      ...prev,
      ...data,
      // Ensure nested objects are merged or at least present
      background: { ...DEFAULT_SETTINGS.background, ...data.background },
      clock: { ...DEFAULT_SETTINGS.clock, ...data.clock },
      keybinds: { ...DEFAULT_SETTINGS.keybinds, ...data.keybinds },
    }));
  }

  function updateBackgroundCycle(patch: Partial<BackgroundCycle>) {
    setSettings((prev) => ({
      ...prev,
      backgroundCycle: { ...prev.backgroundCycle, ...patch }
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
    updateActiveColumns,
    setCurrentPage,
    addPage,
    removePage,
    renamePage,
    importSettings,
    updateBackgroundCycle,
    applyThemePreset,
    resetToDefaults,
  };
}
