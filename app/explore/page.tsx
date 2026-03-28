"use client";

import { useState, useMemo } from "react";
import { spots, ALL_REGIONS, ALL_SHOT_TYPES, MONTH_NAMES } from "@/lib/spots";
import SpotCard from "@/components/SpotCard";
import { Camera, Telescope } from "lucide-react";

const CURRENT_MONTH = new Date().getMonth() + 1;

export default function ExplorePage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeShotType, setActiveShotType] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return spots.filter((s) => {
      if (activeRegion && s.region !== activeRegion) return false;
      if (activeShotType && !s.shotTypes.includes(activeShotType as never)) return false;
      if (activeMonth && !s.bestMonths.includes(activeMonth)) return false;
      return true;
    });
  }, [activeRegion, activeShotType, activeMonth]);

  const featuredSpots = spots.filter((s) => s.featured);

  const shotTypeIcons: Record<string, string> = {
    landscape: "🏔️",
    architecture: "🏛️",
    wildlife: "🐯",
    street: "🚶",
    astro: "🌌",
    portrait: "👤",
    aerial: "🚁",
    waterscape: "🌊",
  };

  const regionFlags: Record<string, string> = {
    "Rajasthan": "🏜️",
    "Ladakh": "⛰️",
    "Himachal Pradesh": "🏔️",
    "Uttarakhand": "🌸",
    "Kerala": "🌴",
    "Goa": "🏖️",
    "Tamil Nadu": "🛕",
    "Karnataka": "🪨",
    "Maharashtra": "🗺️",
    "Uttar Pradesh": "🕌",
    "West Bengal": "🌿",
    "Meghalaya": "💧",
    "Andhra Pradesh": "☕",
    "Sikkim": "❄️",
    "Gujarat": "🧂",
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-14">
      {/* Hero */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-800 px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Telescope className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Explore India</h1>
        </div>
        <p className="text-stone-400 max-w-lg mx-auto">
          {spots.length} curated photography locations across India — filter by region, shot type, or the best month to visit.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Month strip */}
          <div>
            <h2 className="text-xs text-stone-500 uppercase tracking-widest mb-2">Best Month</h2>
            <div className="flex flex-wrap gap-1.5">
              {MONTH_NAMES.slice(1).map((name, i) => {
                const m = i + 1;
                const isCurrent = m === CURRENT_MONTH;
                const isActive = activeMonth === m;
                return (
                  <button
                    key={name}
                    onClick={() => setActiveMonth(isActive ? null : m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? "bg-amber-500 text-stone-900 border-amber-500"
                        : isCurrent
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/40 hover:border-amber-500"
                        : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-white"
                    }`}
                  >
                    {name}{isCurrent && !isActive ? " ★" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shot type strip */}
          <div>
            <h2 className="text-xs text-stone-500 uppercase tracking-widest mb-2">Shot Type</h2>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SHOT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveShotType(activeShotType === t ? null : t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                    activeShotType === t
                      ? "bg-amber-500 text-stone-900 border-amber-500"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-white"
                  }`}
                >
                  <span>{shotTypeIcons[t]}</span>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Region strip */}
          <div>
            <h2 className="text-xs text-stone-500 uppercase tracking-widest mb-2">Region</h2>
            <div className="flex flex-wrap gap-1.5">
              {ALL_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(activeRegion === r ? null : r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    activeRegion === r
                      ? "bg-amber-500 text-stone-900 border-amber-500"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500 hover:text-white"
                  }`}
                >
                  <span>{regionFlags[r] ?? "📍"}</span>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">
            {activeRegion || activeShotType || activeMonth
              ? `${filtered.length} matching spots`
              : "All Spots"}
          </h2>
          {(activeRegion || activeShotType || activeMonth) && (
            <button
              onClick={() => { setActiveRegion(null); setActiveShotType(null); setActiveMonth(null); }}
              className="text-xs text-amber-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-stone-500">
            <Camera className="w-12 h-12" />
            <p>No spots match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}

        {/* Featured section */}
        {!activeRegion && !activeShotType && !activeMonth && (
          <div className="mt-12">
            <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              ⭐ Featured Spots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
