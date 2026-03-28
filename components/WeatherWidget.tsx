"use client";

import { useEffect, useState } from "react";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface Props {
  lat: number;
  lng: number;
}

export default function WeatherWidget({ lat, lng }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // Open-Meteo — no API key needed
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=auto`
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          description: wmoDescription(c.weather_code),
          icon: wmoIcon(c.weather_code),
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) return (
    <div className="bg-stone-800/60 rounded-xl p-4 border border-stone-700 animate-pulse">
      <div className="h-4 bg-stone-700 rounded w-1/2 mb-3" />
      <div className="h-8 bg-stone-700 rounded w-1/3" />
    </div>
  );

  if (error || !weather) return (
    <div className="bg-stone-800/60 rounded-xl p-4 border border-stone-700 text-stone-400 text-sm">
      Unable to load weather data.
    </div>
  );

  return (
    <div className="bg-stone-800/60 rounded-xl p-4 border border-stone-700">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
        <Cloud className="w-4 h-4 text-sky-400" />
        Current Weather
      </h3>

      <div className="flex items-center gap-4 mb-3">
        <div className="text-4xl">{weather.icon}</div>
        <div>
          <div className="text-3xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-sm text-stone-400 capitalize">{weather.description}</div>
          <div className="text-xs text-stone-500">Feels like {weather.feelsLike}°C</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-stone-700/50 rounded-lg px-3 py-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-xs text-stone-400">Humidity</div>
            <div className="text-sm font-semibold text-white">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-stone-700/50 rounded-lg px-3 py-2">
          <Wind className="w-4 h-4 text-teal-400" />
          <div>
            <div className="text-xs text-stone-400">Wind</div>
            <div className="text-sm font-semibold text-white">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-stone-600 mt-2 text-right">via Open-Meteo</p>
    </div>
  );
}

function wmoDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight showers", 81: "Moderate showers", 82: "Heavy showers",
    95: "Thunderstorm", 99: "Hailstorm",
  };
  return map[code] ?? "Unknown";
}

function wmoIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}
