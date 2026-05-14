import { useState, useEffect } from "react";

export interface LinkItem {
  name: string;
  url: string;
}

export interface Column {
  heading: string;
  links: LinkItem[];
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

export interface Settings {
  columns: Column[];
  background: Background;
  clock: ClockSettings;
  showWeather: boolean;
  weatherUnit: "f" | "c";
}

const DEFAULT_COLUMNS: Column[] = [
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

const DEFAULT_SETTINGS: Settings = {
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
};

const STORAGE_KEY = "startpage_settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      background: { ...DEFAULT_SETTINGS.background, ...parsed.background },
      clock: { ...DEFAULT_SETTINGS.clock, ...parsed.clock },
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

  function resetToDefaults() {
    setSettings(DEFAULT_SETTINGS);
  }

  return {
    settings,
    update,
    updateBackground,
    updateClock,
    updateColumns,
    resetToDefaults,
  };
}
