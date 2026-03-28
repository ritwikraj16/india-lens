"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { spots, filterSpots, ALL_REGIONS, ALL_SHOT_TYPES, MONTH_NAMES } from "@/lib/spots";
import SpotCard from "@/components/SpotCard";
import { Search, SlidersHorizontal, X, MapPin, Camera } from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const CURRENT_MONTH = new Date().getMonth() + 1;

export default function Home() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [shotType, setShotType] = useState("");
  const [month, setMonth] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapMode, setMapMode] = useState(true);

  const filtered = useMemo(
    () =>
      filterSpots({
        region: region || undefined,
        shotType: shotType || undefined,
        month: month || undefined,
        search: search || undefined,
      }),
    [region, shotType, month, search]
  );

  const hasFilters = region || shotType || month || search;

  const clearFilters = () => {
    setRegion("");
    setShotType("");
    setMonth(0);
    setSearch("");
  };

  return (
    <main className="h-screen flex flex-col bg-stone-950 pt-14">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-stone-900 border-b border-stone-800 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            placeholder="Search spots, regions, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-800 text-white text-sm pl-8 pr-3 py-1.5 rounded-lg border border-stone-700 focus:border-amber-500 focus:outline-none placeholder:text-stone-500"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            showFilters || hasFilters
              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
              : "bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasFilters && (
            <span className="bg-amber-500 text-stone-900 text-[10px] font-bold px-1.5 rounded-full">
              {[region, shotType, month, search].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasFilters && (
          <button onClick={clearFilters} className="text-stone-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Map / List toggle */}
        <div className="ml-auto flex rounded-lg overflow-hidden border border-stone-700">
          <button
            onClick={() => setMapMode(true)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${mapMode ? "bg-amber-500 text-stone-900" : "bg-stone-800 text-stone-400 hover:text-white"}`}
          >
            Map
          </button>
          <button
            onClick={() => setMapMode(false)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${!mapMode ? "bg-amber-500 text-stone-900" : "bg-stone-800 text-stone-400 hover:text-white"}`}
          >
            List
          </button>
        </div>

        <div className="text-xs text-stone-500">
          <span className="text-stone-300 font-medium">{filtered.length}</span> spots
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 px-4 py-3 bg-stone-900/80 border-b border-stone-800">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-stone-800 text-white text-sm border border-stone-700 rounded-lg px-3 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="">All Regions</option>
            {ALL_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={shotType}
            onChange={(e) => setShotType(e.target.value)}
            className="bg-stone-800 text-white text-sm border border-stone-700 rounded-lg px-3 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value="">All Shot Types</option>
            {ALL_SHOT_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-stone-800 text-white text-sm border border-stone-700 rounded-lg px-3 py-1.5 focus:border-amber-500 focus:outline-none"
          >
            <option value={0}>Any Month</option>
            {MONTH_NAMES.slice(1).map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {name} {i + 1 === CURRENT_MONTH ? "← This month" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-80 flex-shrink-0 overflow-y-auto bg-stone-950 border-r border-stone-800 ${mapMode ? "hidden md:block" : "block w-full"}`}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-stone-500 gap-2">
              <Camera className="w-8 h-8" />
              <p className="text-sm">No spots match your filters</p>
              <button onClick={clearFilters} className="text-amber-400 text-xs hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="p-3 grid grid-cols-1 gap-3">
              {filtered.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => { setSelectedId(spot.id); setMapMode(true); }}
                  className={`cursor-pointer rounded-xl ring-2 transition-all ${selectedId === spot.id ? "ring-amber-500" : "ring-transparent"}`}
                >
                  <SpotCard spot={spot} />
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Map */}
        {mapMode && (
          <div className="flex-1 relative">
            <MapView
              spots={filtered}
              selectedId={selectedId}
              onSpotClick={(id) => setSelectedId(id)}
            />

            {/* Selected spot overlay */}
            {selectedId && (() => {
              const spot = spots.find((s) => s.id === selectedId);
              if (!spot) return null;
              return (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 bg-stone-900/95 backdrop-blur-sm rounded-xl border border-stone-700 shadow-xl p-3 z-40">
                  <button
                    className="absolute top-2 right-2 text-stone-500 hover:text-white"
                    onClick={() => setSelectedId(null)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex gap-3">
                    <img src={spot.coverImage} alt={spot.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{spot.name}</h3>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {spot.region}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/spots/${spot.id}`}
                    className="mt-3 flex items-center justify-center w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold text-sm py-1.5 rounded-lg transition-colors"
                  >
                    View Full Details →
                  </Link>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </main>
  );
}
