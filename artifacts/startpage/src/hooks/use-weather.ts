import { useState, useEffect } from "react";

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

export function useWeather(unit: "f" | "c", enabled: boolean) {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      setWeather(null);
      return;
    }

    let isMounted = true;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const tempUnit = unit === "f" ? "fahrenheit" : "celsius";
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&temperature_unit=${tempUnit}`;
          const res = await fetch(url);
          const data = await res.json();
          if (!isMounted) return;
          const code: number = data.current.weather_code;
          const temp: number = Math.round(data.current.temperature_2m);
          const desc = WMO_CODES[code] ?? "unknown";
          setWeather(`${desc} - ${temp} ${unit}`);
        } catch {
          if (isMounted) setWeather(null);
        }
      },
      () => {
        if (isMounted) setWeather(null);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [unit, enabled]);

  return weather;
}
