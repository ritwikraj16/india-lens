"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { spots as curatedSpots, ALL_REGIONS, ALL_SHOT_TYPES, MONTH_NAMES } from "@/lib/spots";
import { dbRowToPhotoSpot } from "@/lib/community";
import { PhotoSpot } from "@/types/spot";
import SpotCard from "@/components/SpotCard";
import { Search, SlidersHorizontal, X, MapPin, Camera, ChevronLeft, ChevronRight } from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const CURRENT_MONTH = new Date().getMonth() + 1;

function FeaturedCarousel({ spots, onSelect }: { spots: PhotoSpot[]; onSelect: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoIdx, setAutoIdx] = useState(0);

  const scroll = useCallback((dir: number) => {
    if (!scrollRef.current) return;
    const cardW = 340;
    scrollRef.current.scrollBy({ left: dir * cardW, behavior: "smooth" });
  }, []);

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoIdx((prev) => {
        const next = (prev + 1) % spots.length;
        if (scrollRef.current) {
          const cardW = 340;
          scrollRef.current.scrollTo({ left: next * cardW, behavior: "smooth" });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [spots.length]);

  // Reset auto-timer on manual scroll
  const handleManual = (dir: number) => {
    scroll(dir);
    setAutoIdx((prev) => Math.max(0, prev + dir));
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {spots.map((spot) => (
          <Link
            key={spot.id}
            href={`/spots/${spot.id}`}
            onClick={() => onSelect(spot.id)}
            className="flex-shrink-0 snap-start relative w-[320px] h-[200px] rounded-xl overflow-hidden group/card cursor-pointer"
          >
            <img
              src={spot.coverImage}
              alt={spot.name}
              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold bg-amber-500 text-stone-900 px-2 py-0.5 rounded-full">
                  FEATURED
                </span>
                {spot.source === "community" && (
                  <span className="text-[10px] font-bold bg-emerald-500/80 text-white px-2 py-0.5 rounded-full">
                    COMMUNITY
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-base leading-tight line-clamp-1">{spot.name}</h3>
              <p className="text-stone-300 text-xs flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" /> {spot.region}, {spot.state}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={() => handleManual(-1)}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-stone-900/80 hover:bg-stone-800 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleManual(1)}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-stone-900/80 hover:bg-stone-800 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Home() {
  const [communitySpots, setCommunitySpots] = useState<PhotoSpot[]>([]);

  useEffect(() => {
    fetch("/api/spots?status=approved")
      .then((r) => r.json())
      .then((data) => {
        if (data.spots) setCommunitySpots(data.spots.map(dbRowToPhotoSpot));
      })
      .catch(() => {});
  }, []);

  const spots = useMemo(
    () => [...curatedSpots, ...communitySpots],
    [communitySpots]
  );

  const featuredSpots = useMemo(
    () => spots.filter((s) => s.featured),
    [spots]
  );

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [shotType, setShotType] = useState("");
  const [month, setMonth] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"split" | "map" | "grid">("split");

  const filtered = useMemo(
    () =>
      spots.filter((s) => {
        if (region && s.region !== region) return false;
        if (shotType && !s.shotTypes.includes(shotType as never)) return false;
        if (month && !s.bestMonths.includes(month)) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !s.name.toLowerCase().includes(q) &&
            !s.region.toLowerCase().includes(q) &&
            !s.tags.join(" ").toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      }),
    [spots, region, shotType, month, search]
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
      {/* Featured Carousel */}
      {featuredSpots.length > 0 && !hasFilters && (
        <div className="bg-stone-900 border-b border-stone-800">
          <FeaturedCarousel spots={featuredSpots} onSelect={(id) => setSelectedId(id)} />
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-stone-900 border-b border-stone-800 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            placeholder="Search spots, regions, tags..."
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

        {/* View toggle */}
        <div className="ml-auto flex rounded-lg overflow-hidden border border-stone-700">
          {(["split", "grid", "map"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                view === v ? "bg-amber-500 text-stone-900" : "bg-stone-800 text-stone-400 hover:text-white"
              }`}
            >
              {v === "split" ? "Split" : v === "grid" ? "Photos" : "Map"}
            </button>
          ))}
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
                {name} {i + 1 === CURRENT_MONTH ? "<- This month" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Photo grid — shown in split & grid views */}
        {(view === "split" || view === "grid") && (
          <div
            className={`overflow-y-auto bg-stone-950 ${
              view === "split" ? "w-1/2 lg:w-3/5 border-r border-stone-800" : "w-full"
            }`}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-stone-500 gap-2">
                <Camera className="w-8 h-8" />
                <p className="text-sm">No spots match your filters</p>
                <button onClick={clearFilters} className="text-amber-400 text-xs hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className={`p-3 grid gap-3 ${
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}>
                {filtered.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => { setSelectedId(spot.id); }}
                    className={`cursor-pointer rounded-xl ring-2 transition-all ${
                      selectedId === spot.id ? "ring-amber-500" : "ring-transparent"
                    }`}
                  >
                    <SpotCard spot={spot} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map — shown in split & map views */}
        {(view === "split" || view === "map") && (
          <div className={`relative ${view === "split" ? "w-1/2 lg:w-2/5" : "flex-1"}`}>
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
                    View Full Details
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
