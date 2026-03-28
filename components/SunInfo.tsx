"use client";

import { useMemo, useState } from "react";
import SunCalc from "suncalc";
import { format } from "date-fns";
import { Sun, Sunrise, Sunset, Moon } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
}

export default function SunInfo({ lat, lng }: Props) {
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const sun = useMemo(() => {
    const d = new Date(date + "T00:00:00");
    const times = SunCalc.getTimes(d, lat, lng);
    const goldenAM = SunCalc.getTimes(d, lat, lng);
    const sunPos = SunCalc.getPosition(times.sunrise, lat, lng);
    const sunSetPos = SunCalc.getPosition(times.sunset, lat, lng);

    const fmtTime = (t: Date) => {
      if (!t || isNaN(t.getTime())) return "--:--";
      return t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    const toDeg = (rad: number) => ((rad * 180) / Math.PI + 360) % 360;

    return {
      sunrise: fmtTime(times.sunrise),
      sunset: fmtTime(times.sunset),
      goldenAMEnd: fmtTime(times.goldenHourEnd),
      goldenPMStart: fmtTime(times.goldenHour),
      solarNoon: fmtTime(times.solarNoon),
      dusk: fmtTime(times.dusk),
      nadir: fmtTime(times.nadir),
      sunriseAzimuth: Math.round(toDeg(sunPos.azimuth + Math.PI)),
      sunsetAzimuth: Math.round(toDeg(sunSetPos.azimuth + Math.PI)),
    };
  }, [date, lat, lng]);

  const AzimuthDial = ({ deg, label, color }: { deg: number; label: string; color: string }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="28" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
          {/* compass ticks */}
          {["N","E","S","W"].map((d, i) => {
            const a = (i * 90 - 90) * (Math.PI / 180);
            return (
              <text key={d} x={32 + 20 * Math.cos(a)} y={32 + 20 * Math.sin(a) + 4} textAnchor="middle" fontSize="7" fill="#78716c">{d}</text>
            );
          })}
          {/* direction arrow */}
          <line
            x1="32" y1="32"
            x2={32 + 22 * Math.cos((deg - 90) * (Math.PI / 180))}
            y2={32 + 22 * Math.sin((deg - 90) * (Math.PI / 180))}
            stroke={color} strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="3" fill={color} />
        </svg>
      </div>
      <span className="text-xs text-stone-400">{label}</span>
      <span className="text-xs font-mono text-stone-300">{deg}°</span>
    </div>
  );

  return (
    <div className="bg-stone-800/60 rounded-xl p-4 border border-stone-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          Sun Calculator
        </h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-xs bg-stone-700 text-white border border-stone-600 rounded-lg px-2 py-1 cursor-pointer"
        />
      </div>

      {/* Times grid */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-stone-700/50 rounded-lg p-2">
          <Sunrise className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Sunrise</div>
          <div className="text-sm font-semibold text-white">{sun.sunrise}</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/30">
          <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Golden AM ends</div>
          <div className="text-sm font-semibold text-amber-300">{sun.goldenAMEnd}</div>
        </div>
        <div className="bg-stone-700/50 rounded-lg p-2">
          <Sun className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Solar Noon</div>
          <div className="text-sm font-semibold text-white">{sun.solarNoon}</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/30">
          <Sunset className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Golden PM starts</div>
          <div className="text-sm font-semibold text-orange-300">{sun.goldenPMStart}</div>
        </div>
        <div className="bg-stone-700/50 rounded-lg p-2">
          <Sunset className="w-4 h-4 text-rose-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Sunset</div>
          <div className="text-sm font-semibold text-white">{sun.sunset}</div>
        </div>
        <div className="bg-stone-700/50 rounded-lg p-2">
          <Moon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <div className="text-xs text-stone-400">Dusk</div>
          <div className="text-sm font-semibold text-white">{sun.dusk}</div>
        </div>
      </div>

      {/* Azimuth dials */}
      <div className="flex justify-around pt-2 border-t border-stone-700">
        <AzimuthDial deg={sun.sunriseAzimuth} label="Sunrise dir." color="#f59e0b" />
        <AzimuthDial deg={sun.sunsetAzimuth} label="Sunset dir." color="#f97316" />
      </div>
    </div>
  );
}
