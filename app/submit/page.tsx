"use client";

import { useState } from "react";
import { Upload, MapPin, Camera, CheckCircle, Info } from "lucide-react";
import { ALL_SHOT_TYPES, MONTH_NAMES } from "@/lib/spots";

const TIME_OPTIONS = [
  { value: "sunrise", label: "🌅 Sunrise" },
  { value: "golden_hour_am", label: "🌄 Golden Hour AM" },
  { value: "midday", label: "☀️ Midday" },
  { value: "golden_hour_pm", label: "🌇 Golden Hour PM" },
  { value: "sunset", label: "🌆 Sunset" },
  { value: "blue_hour", label: "🌃 Blue Hour" },
  { value: "night", label: "🌌 Night / Astro" },
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    state: "",
    region: "",
    lat: "",
    lng: "",
    accessibility: "easy",
    crowdLevel: "medium",
    monsoonAccessible: false,
    tips: "",
    parkingNotes: "",
    elevation: "",
    tags: "",
  });
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedShotTypes, setSelectedShotTypes] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/spots
    console.log({ ...form, bestMonths: selectedMonths, shotTypes: selectedShotTypes, bestTimeOfDay: selectedTimes });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-950 pt-14 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Spot Submitted!</h1>
          <p className="text-stone-400 mb-6 max-w-sm">
            Thanks for contributing! Your spot will be reviewed and published within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Submit Another Spot
          </button>
        </div>
      </div>
    );
  }

  const inputCls = "w-full bg-stone-800 text-white text-sm border border-stone-700 rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none placeholder:text-stone-500";
  const labelCls = "block text-xs font-medium text-stone-400 mb-1";

  return (
    <div className="min-h-screen bg-stone-950 pt-14">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Add a Photo Spot</h1>
          </div>
          <p className="text-stone-400 text-sm">
            Share your favourite photography location in India with the community.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-6 flex gap-3 text-sm text-amber-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>All submitted spots are reviewed before publishing. Include GPS coordinates for best results.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              Spot Details
            </h2>
            <div>
              <label className={labelCls}>Spot Name *</label>
              <input required placeholder="e.g. Triund Ridge at sunset" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description *</label>
              <textarea required rows={3} placeholder="What makes this location special for photography?"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>State *</label>
                <input required placeholder="e.g. Rajasthan" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Region / District</label>
                <input placeholder="e.g. Jaisalmer" value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          {/* GPS */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              GPS Coordinates
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Latitude *</label>
                <input required type="number" step="any" placeholder="27.1751" value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Longitude *</label>
                <input required type="number" step="any" placeholder="78.0421" value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-stone-500">
              Tip: Open Google Maps, long-press the spot, and copy the coordinates shown.
            </p>
            <div>
              <label className={labelCls}>Elevation (metres)</label>
              <input type="number" placeholder="e.g. 3500" value={form.elevation}
                onChange={(e) => setForm({ ...form, elevation: e.target.value })} className={inputCls} />
            </div>
          </div>

          {/* Shot types */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Shot Types *</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_SHOT_TYPES.map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => setSelectedShotTypes(toggle(selectedShotTypes, t))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-all ${
                    selectedShotTypes.includes(t)
                      ? "bg-amber-500 text-stone-900 border-amber-500"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Best months */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Best Months *</h2>
            <div className="grid grid-cols-6 gap-1.5">
              {MONTH_NAMES.slice(1).map((name, i) => (
                <button key={name} type="button"
                  onClick={() => setSelectedMonths(toggle(selectedMonths, i + 1))}
                  className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                    selectedMonths.includes(i + 1)
                      ? "bg-amber-500 text-stone-900 border-amber-500"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Time of day */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Best Time of Day *</h2>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map(({ value, label }) => (
                <button key={value} type="button"
                  onClick={() => setSelectedTimes(toggle(selectedTimes, value))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedTimes.includes(value)
                      ? "bg-amber-500 text-stone-900 border-amber-500"
                      : "bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Logistics */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Logistics & Tips</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Accessibility</label>
                <select value={form.accessibility} onChange={(e) => setForm({ ...form, accessibility: e.target.value })} className={inputCls}>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Crowd Level</label>
                <select value={form.crowdLevel} onChange={(e) => setForm({ ...form, crowdLevel: e.target.value })} className={inputCls}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="monsoon" checked={form.monsoonAccessible}
                onChange={(e) => setForm({ ...form, monsoonAccessible: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer" />
              <label htmlFor="monsoon" className="text-sm text-stone-300 cursor-pointer">Accessible during monsoon season</label>
            </div>
            <div>
              <label className={labelCls}>Photographer Tips *</label>
              <textarea required rows={3} placeholder="Best lens, best angles, what to watch out for..."
                value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })}
                className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Parking / Access Notes</label>
              <input placeholder="e.g. Park at the base camp, 2km walk uphill" value={form.parkingNotes}
                onChange={(e) => setForm({ ...form, parkingNotes: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input placeholder="e.g. waterfall, monsoon, trekking" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-base py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Submit Spot for Review
          </button>
        </form>
      </div>
    </div>
  );
}
