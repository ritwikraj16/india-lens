"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Trash2, Clock, Eye, MapPin, Loader2, RefreshCw } from "lucide-react";

interface Submission {
  id: number;
  slug: string;
  name: string;
  description: string;
  region: string;
  state: string;
  lat: number;
  lng: number;
  elevation: number | null;
  shot_types: string[];
  best_months: number[];
  best_time_of_day: string[];
  crowd_level: string;
  accessibility: string;
  monsoon_accessible: boolean;
  tips: string;
  parking_notes: string | null;
  tags: string[];
  cover_image: string;
  submitted_by: string | null;
  submitted_email: string | null;
  status: string;
  created_at: string;
}

const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  rejected: { label: "Rejected", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" },
};

export default function AdminPage() {
  const [spots, setSpots] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchSpots = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/spots?status=${filter}`);
      const data = await res.json();
      setSpots(data.spots || []);
    } catch {
      setSpots([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpots();
  }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/spots/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSpots((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
      }
    } catch {
      // ignore
    }
    setActionLoading(null);
  };

  const deleteSpot = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this submission?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/spots/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSpots((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      // ignore
    }
    setActionLoading(null);
  };

  const counts = {
    all: spots.length,
    pending: spots.filter((s) => s.status === "pending").length,
    approved: spots.filter((s) => s.status === "approved").length,
    rejected: spots.filter((s) => s.status === "rejected").length,
  };

  const filtered = filter === "all" ? spots : spots.filter((s) => s.status === filter);

  return (
    <div className="min-h-screen bg-stone-950 pt-14">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Admin — Submissions</h1>
          </div>
          <button
            onClick={fetchSpots}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700 hover:border-stone-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${
                filter === tab
                  ? "bg-amber-500 text-stone-900 border-amber-500"
                  : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500"
              }`}
            >
              {tab}
              {filter === "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({tab === "all" ? spots.length : counts[tab]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-stone-500">
            <Clock className="w-10 h-10" />
            <p>No {filter === "all" ? "" : filter} submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((spot) => {
              const st = statusConfig[spot.status] || statusConfig.pending;
              const isExpanded = expandedId === spot.id;
              const isLoading = actionLoading === spot.id;

              return (
                <div
                  key={spot.id}
                  className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={spot.cover_image}
                      alt={spot.name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold truncate">{spot.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${st.bg} ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {spot.region}, {spot.state}
                        </span>
                        <span>{spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}</span>
                        <span>{new Date(spot.created_at).toLocaleDateString()}</span>
                      </div>
                      {spot.submitted_by && (
                        <p className="text-xs text-stone-500 mt-1">
                          by {spot.submitted_by} {spot.submitted_email ? `(${spot.submitted_email})` : ""}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : spot.id)}
                        className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white border border-stone-700 hover:border-stone-500 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {spot.status !== "approved" && (
                        <button
                          onClick={() => updateStatus(spot.id, "approved")}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      )}
                      {spot.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus(spot.id, "rejected")}
                          disabled={isLoading}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteSpot(spot.id)}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-stone-800 text-stone-500 hover:text-rose-400 border border-stone-700 hover:border-rose-500/30 transition-colors disabled:opacity-50"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-stone-800 p-4 space-y-3 bg-stone-900/50">
                      <div>
                        <h4 className="text-xs font-medium text-stone-500 uppercase mb-1">Description</h4>
                        <p className="text-sm text-stone-300">{spot.description}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-xs text-stone-500">Shot Types</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {spot.shot_types.map((t) => (
                              <span key={t} className="bg-stone-800 text-stone-300 text-xs px-2 py-0.5 rounded-full capitalize">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">Best Months</span>
                          <p className="text-stone-300 mt-1">
                            {spot.best_months.map((m) => MONTH_NAMES[m]).join(", ") || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">Crowd / Access</span>
                          <p className="text-stone-300 mt-1 capitalize">{spot.crowd_level} / {spot.accessibility}</p>
                        </div>
                        <div>
                          <span className="text-xs text-stone-500">Elevation</span>
                          <p className="text-stone-300 mt-1">{spot.elevation ? `${spot.elevation}m` : "N/A"}</p>
                        </div>
                      </div>
                      {spot.tips && (
                        <div>
                          <span className="text-xs text-stone-500">Tips</span>
                          <p className="text-sm text-stone-300 mt-1">{spot.tips}</p>
                        </div>
                      )}
                      {spot.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {spot.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div>
                        <a
                          href={`https://www.google.com/maps?q=${spot.lat},${spot.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
                        >
                          <MapPin className="w-3 h-3" /> View on Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
