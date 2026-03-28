import Link from "next/link";
import { PhotoSpot } from "@/types/spot";
import { MONTH_NAMES } from "@/lib/spots";
import { MapPin, Clock, Users, Mountain } from "lucide-react";

const crowdColor = {
  low: "text-emerald-400 bg-emerald-400/10",
  medium: "text-amber-400 bg-amber-400/10",
  high: "text-rose-400 bg-rose-400/10",
};

const shotTypeColor: Record<string, string> = {
  landscape: "bg-sky-500/20 text-sky-300",
  architecture: "bg-violet-500/20 text-violet-300",
  wildlife: "bg-emerald-500/20 text-emerald-300",
  street: "bg-orange-500/20 text-orange-300",
  astro: "bg-indigo-500/20 text-indigo-300",
  portrait: "bg-rose-500/20 text-rose-300",
  aerial: "bg-cyan-500/20 text-cyan-300",
  waterscape: "bg-blue-500/20 text-blue-300",
};

export default function SpotCard({ spot }: { spot: PhotoSpot }) {
  const bestMonthLabel = spot.bestMonths
    .slice(0, 3)
    .map((m) => MONTH_NAMES[m])
    .join(", ");

  return (
    <Link href={`/spots/${spot.id}`} className="group block">
      <div className="bg-stone-800 border border-stone-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/5">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={spot.coverImage}
            alt={spot.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {spot.featured && (
            <span className="absolute top-2 left-2 text-xs font-semibold bg-amber-500 text-stone-900 px-2 py-0.5 rounded-full">
              ★ Featured
            </span>
          )}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-stone-900/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors">
              {spot.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-stone-400 text-xs mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{spot.region}, {spot.state}</span>
          </div>

          {/* Shot types */}
          <div className="flex flex-wrap gap-1 mb-2">
            {spot.shotTypes.slice(0, 3).map((t) => (
              <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${shotTypeColor[t] ?? "bg-stone-700 text-stone-300"}`}>
                {t}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{bestMonthLabel}{spot.bestMonths.length > 3 ? "…" : ""}</span>
            </div>
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${crowdColor[spot.crowdLevel]}`}>
              <Users className="w-3 h-3" />
              {spot.crowdLevel}
            </span>
          </div>

          {spot.elevation && (
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              <Mountain className="w-3 h-3" />
              <span>{spot.elevation.toLocaleString()}m</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
