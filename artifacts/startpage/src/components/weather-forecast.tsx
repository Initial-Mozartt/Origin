import { useState, useEffect } from "react";

interface Props {
  enabled: boolean;
  days: number;
  unit: "f" | "c";
  lat: number;
  lon: number;
  foregroundColor: string;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
}

const WMO_MAP: Record<number, string> = {
  0: "○", // clear
  1: "○", // clear
  2: "◑", // cloudy
  3: "◑", // cloudy
  45: "≈", // foggy
  48: "≈", // foggy
  51: "↓", // rainy
  53: "↓",
  55: "↓",
  56: "↓",
  57: "↓",
  61: "↓",
  63: "↓",
  65: "↓",
  66: "↓",
  67: "↓",
  71: "❄", // snowy
  73: "❄",
  75: "❄",
  77: "❄",
  80: "↓",
  81: "↓",
  82: "↓",
  85: "❄",
  86: "❄",
  95: "↯", // stormy
  96: "↯",
  99: "↯",
};

const S = {
  container: {
    display: "flex",
    gap: "16px",
    marginTop: "8px",
    opacity: 0.7,
    fontSize: "0.8rem",
    justifyContent: "center",
  },
  day: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "2px",
    minWidth: "40px",
  },
  icon: {
    fontSize: "1.1rem",
    margin: "2px 0",
  },
  temps: {
    display: "flex",
    gap: "4px",
    fontSize: "0.7rem",
  }
};

export function WeatherForecast({ enabled, days, unit, lat, lon, foregroundColor }: Props) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);

  useEffect(() => {
    if (!enabled || !lat || !lon) return;

    const fetchForecast = async () => {
      try {
        const tempUnit = unit === "f" ? "fahrenheit" : "celsius";
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=${tempUnit}&forecast_days=${days}&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        
        const days_data = data.daily.time.map((time: string, i: number) => ({
          date: time,
          maxTemp: Math.round(data.daily.temperature_2m_max[i]),
          minTemp: Math.round(data.daily.temperature_2m_min[i]),
          code: data.daily.weathercode[i],
        }));
        
        setForecast(days_data);
      } catch (err) {
        console.error("Failed to fetch forecast", err);
      }
    };

    fetchForecast();
  }, [enabled, days, unit, lat, lon]);

  if (!enabled || forecast.length === 0) return null;

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "short" });
  };

  return (
    <div style={{ ...S.container, color: foregroundColor }} data-testid="weather-forecast">
      {forecast.map((day) => (
        <div key={day.date} style={S.day}>
          <span>{getDayName(day.date)}</span>
          <span style={S.icon} title={`WMO: ${day.code}`}>{WMO_MAP[day.code] || "?"}</span>
          <div style={S.temps}>
            <span>{day.maxTemp}°</span>
            <span style={{ opacity: 0.5 }}>{day.minTemp}°</span>
          </div>
        </div>
      ))}
    </div>
  );
}
