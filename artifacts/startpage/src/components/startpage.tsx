import { useState, useEffect } from "react";

const COLUMNS = [
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

function useWeather() {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
          const res = await fetch(url);
          const data = await res.json();
          const code: number = data.current.weather_code;
          const temp: number = Math.round(data.current.temperature_2m);
          const desc = WMO_CODES[code] ?? "unknown";
          setWeather(`${desc} - ${temp} f`);
        } catch {
          setWeather(null);
        }
      },
      () => setWeather(null)
    );
  }, []);

  return weather;
}

export function Startpage() {
  const [time, setTime] = useState(new Date());
  const weather = useWeather();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div
      style={{
        backgroundColor: "#282a36",
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
      }}
    >
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

      {weather && (
        <div
          data-testid="text-weather"
          style={{
            backgroundColor: "#111111",
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

      {!weather && (
        <div style={{ marginBottom: "40px", height: "42px" }} />
      )}

      <div style={{ display: "flex", gap: "15px" }}>
        {COLUMNS.map((col) => (
          <div
            key={col.heading}
            style={{
              backgroundColor: "#111111",
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
              {col.links.map((link) => (
                <li key={link.name} style={{ marginBottom: "6px" }}>
                  <a
                    href={link.url}
                    data-testid={`link-${link.name.toLowerCase().replace(/[\s/]+/g, "-")}`}
                    style={{
                      color: "#999",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      transition: "color 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#ff79c6")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "#999")
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
  );
}
