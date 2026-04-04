import { notFound } from "next/navigation";
import Link from "next/link";
import { getSpotById, MONTH_NAMES } from "@/lib/spots";
import { getDb } from "@/lib/db";
import { dbRowToPhotoSpot } from "@/lib/community";
import SunInfo from "@/components/SunInfo";
import WeatherWidget from "@/components/WeatherWidget";
import {
  ArrowLeft, MapPin, Mountain, Users, Clock, Lightbulb,
  ParkingSquare, CalendarDays, Star, CheckCircle, AlertTriangle,
} from "lucide-react";

const crowdConfig = {
  low: { label: "Low Crowd", icon: "🟢", class: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  medium: { label: "Moderate Crowd", icon: "🟡", class: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  high: { label: "High Crowd", icon: "🔴", class: "text-rose-400 bg-rose-400/10 border-rose-400/30" },
};

const accessConfig = {
  easy: { label: "Easy Access", color: "text-emerald-400" },
  moderate: { label: "Moderate Trek", color: "text-amber-400" },
  difficult: { label: "Difficult / Remote", color: "text-rose-400" },
};

const timeLabels: Record<string, string> = {
  sunrise: "🌅 Sunrise",
  golden_hour_am: "🌄 Golden Hour AM",
  midday: "☀️ Midday",
  golden_hour_pm: "🌇 Golden Hour PM",
  sunset: "🌆 Sunset",
  blue_hour: "🌃 Blue Hour",
  night: "🌌 Night / Astro",
};

const shotColour: Record<string, string> = {
  landscape: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  architecture: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  wildlife: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  street: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  astro: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  portrait: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  aerial: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  waterscape: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpotPage({ params }: PageProps) {
  const { id } = await params;
  let spot = getSpotById(id);

  // Check community spots if not found in curated
  if (!spot && id.startsWith("community-")) {
    const slug = id.replace("community-", "");
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT * FROM community_spots WHERE slug = ${slug} AND status = 'approved'
      `;
      if (rows.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spot = dbRowToPhotoSpot(rows[0] as any);
      }
    } catch {
      // DB not available, skip
    }
  }

  if (!spot) notFound();

  const crowd = crowdConfig[spot.crowdLevel];
  const access = accessConfig[spot.accessibility];

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;

  return (
    <div className="min-h-screen bg-stone-950 pt-14">
      {/* Hero image */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <img
          src={spot.coverImage}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-stone-900/80 hover:bg-stone-800 text-white text-sm px-3 py-1.5 rounded-lg border border-stone-700 transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>

        {/* Featured badge */}
        {spot.featured && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500 text-stone-900 text-xs font-bold px-3 py-1 rounded-full">
            <Star className="w-3 h-3" />
            Featured Spot
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{spot.name}</h1>
          <div className="flex items-center gap-2 text-stone-300 text-sm">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{spot.region}, {spot.state}</span>
            {spot.elevation && (
              <>
                <span className="text-stone-600">·</span>
                <Mountain className="w-4 h-4 text-stone-400" />
                <span>{spot.elevation.toLocaleString()}m</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
            <p className="text-stone-300 leading-relaxed">{spot.description}</p>
          </div>

          {/* Shot types + badges */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
            <h2 className="font-semibold text-white mb-3">Shot Types</h2>
            <div className="flex flex-wrap gap-2">
              {spot.shotTypes.map((t) => (
                <span key={t} className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${shotColour[t] ?? "bg-stone-700 text-stone-300 border-stone-600"}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Best time */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              Best Time to Visit
            </h2>
            <div className="mb-4">
              <h3 className="text-xs text-stone-500 uppercase tracking-wide mb-2">Months</h3>
              <div className="grid grid-cols-12 gap-1">
                {MONTH_NAMES.slice(1).map((name, i) => {
                  const active = spot.bestMonths.includes(i + 1);
                  return (
                    <div
                      key={name}
                      className={`col-span-1 text-center py-2 rounded-md text-[10px] font-medium transition-colors ${
                        active
                          ? "bg-amber-500 text-stone-900"
                          : "bg-stone-800 text-stone-500"
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-xs text-stone-500 uppercase tracking-wide mb-2">Time of Day</h3>
              <div className="flex flex-wrap gap-2">
                {spot.bestTimeOfDay.map((t) => (
                  <span key={t} className="text-sm bg-stone-800 border border-stone-700 text-stone-300 px-3 py-1 rounded-full">
                    {timeLabels[t] ?? t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Photographer Tips
            </h2>
            <p className="text-stone-300 leading-relaxed">{spot.tips}</p>
            {spot.parkingNotes && (
              <div className="mt-3 flex items-start gap-2 text-stone-400 text-sm bg-stone-800/50 rounded-lg p-3">
                <ParkingSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-sky-400" />
                <span>{spot.parkingNotes}</span>
              </div>
            )}
          </div>

          {/* Festivals */}
          {spot.festivalNearby && spot.festivalNearby.length > 0 && (
            <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
              <h2 className="font-semibold text-white mb-3">🎉 Nearby Festivals</h2>
              <div className="flex flex-wrap gap-2">
                {spot.festivalNearby.map((f) => (
                  <span key={f} className="bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm px-3 py-1 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Coordinates */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              GPS Coordinates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-800/50 rounded-lg p-3">
                <div className="text-stone-500 text-xs mb-1">📍 Spot Location</div>
                <div className="font-mono text-stone-300">{spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}</div>
              </div>
              {spot.cameraLat && (
                <div className="bg-stone-800/50 rounded-lg p-3">
                  <div className="text-stone-500 text-xs mb-1">📷 Camera Position</div>
                  <div className="font-mono text-stone-300">{spot.cameraLat.toFixed(5)}, {spot.cameraLng?.toFixed(5)}</div>
                </div>
              )}
              {spot.subjectLat && (
                <div className="bg-stone-800/50 rounded-lg p-3">
                  <div className="text-stone-500 text-xs mb-1">🎯 Subject Position</div>
                  <div className="font-mono text-stone-300">{spot.subjectLat.toFixed(5)}, {spot.subjectLng?.toFixed(5)}</div>
                </div>
              )}
            </div>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full bg-stone-800 hover:bg-stone-700 text-white text-sm py-2 rounded-lg transition-colors border border-stone-700"
            >
              <MapPin className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Right column — info cards */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 space-y-3">
            <div className={`flex items-center justify-between p-2 rounded-lg border ${crowd.class}`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                {crowd.label}
              </div>
              <span>{crowd.icon}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg bg-stone-800/50 text-sm font-medium ${access.color}`}>
              <CheckCircle className="w-4 h-4" />
              {access.label}
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg bg-stone-800/50 text-sm font-medium ${spot.monsoonAccessible ? "text-emerald-400" : "text-rose-400"}`}>
              {spot.monsoonAccessible ? (
                <><CheckCircle className="w-4 h-4" /> Monsoon accessible</>
              ) : (
                <><AlertTriangle className="w-4 h-4" /> Avoid in monsoon</>
              )}
            </div>
            {spot.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="inline-flex mr-1 text-[11px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Sun calculator */}
          <SunInfo lat={spot.lat} lng={spot.lng} />

          {/* Weather */}
          <WeatherWidget lat={spot.lat} lng={spot.lng} />
        </div>
      </div>
    </div>
  );
}
