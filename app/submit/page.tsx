"use client";

import { useState, useRef } from "react";
import { Upload, MapPin, Camera, CheckCircle, Info, Locate, ImagePlus, Loader2, X } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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
    submittedBy: "",
    submittedEmail: "",
  });
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [selectedShotTypes, setSelectedShotTypes] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setPhotoFile(file);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? "Location access denied. Please enable location permissions."
            : "Could not detect location. Please enter coordinates manually."
        );
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!photoFile) {
      setError("Please upload a photo of the spot.");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Upload photo
      setUploadingPhoto(true);
      const uploadData = new FormData();
      uploadData.append("file", photoFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || "Failed to upload photo");
      }

      const { url: coverImage } = await uploadRes.json();
      setUploadingPhoto(false);

      // Step 2: Submit spot data
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage,
          shotTypes: selectedShotTypes,
          bestMonths: selectedMonths,
          bestTimeOfDay: selectedTimes,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit spot");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
      setUploadingPhoto(false);
    }
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
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "", description: "", state: "", region: "", lat: "", lng: "",
                accessibility: "easy", crowdLevel: "medium", monsoonAccessible: false,
                tips: "", parkingNotes: "", elevation: "", tags: "",
                submittedBy: "", submittedEmail: "",
              });
              setSelectedMonths([]);
              setSelectedShotTypes([]);
              setSelectedTimes([]);
              removePhoto();
            }}
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
          <span>All submitted spots are reviewed before publishing. Upload a photo and include GPS coordinates for best results.</span>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo upload */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-amber-400" />
              Cover Photo *
            </h2>

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-800 text-white p-1.5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-stone-700 hover:border-amber-500/50 rounded-lg flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-stone-300 transition-colors"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">Click to upload a photo</span>
                <span className="text-xs text-stone-500">JPG, PNG, WebP — max 5MB</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

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
              <label className={labelCls}>Description</label>
              <textarea rows={3} placeholder="What makes this location special for photography?"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>State</label>
                <input placeholder="e.g. Rajasthan" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Region / District</label>
                <input placeholder="e.g. Jaisalmer" value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          {/* GPS with geolocation */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                GPS Coordinates
              </h2>
              <button
                type="button"
                onClick={detectLocation}
                disabled={geoLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
              >
                {geoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Locate className="w-3.5 h-3.5" />
                )}
                {geoLoading ? "Detecting..." : "Use My Location"}
              </button>
            </div>

            {geoError && (
              <p className="text-xs text-rose-400">{geoError}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Latitude</label>
                <input type="number" step="any" placeholder="27.1751" value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Longitude</label>
                <input type="number" step="any" placeholder="78.0421" value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-stone-500">
              Tip: Use &ldquo;Use My Location&rdquo; button above, or open Google Maps, long-press the spot, and copy the coordinates.
            </p>
            <div>
              <label className={labelCls}>Elevation (metres)</label>
              <input type="number" placeholder="e.g. 3500" value={form.elevation}
                onChange={(e) => setForm({ ...form, elevation: e.target.value })} className={inputCls} />
            </div>
          </div>

          {/* Shot types */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Shot Types</h2>
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
            <h2 className="font-semibold text-white">Best Months</h2>
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
            <h2 className="font-semibold text-white">Best Time of Day</h2>
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
              <label className={labelCls}>Photographer Tips</label>
              <textarea rows={3} placeholder="Best lens, best angles, what to watch out for..."
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

          {/* Submitter info */}
          <div className="bg-stone-900 rounded-xl p-5 border border-stone-800 space-y-4">
            <h2 className="font-semibold text-white">Your Details (optional)</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Your Name</label>
                <input placeholder="e.g. Raj Patel" value={form.submittedBy}
                  onChange={(e) => setForm({ ...form, submittedBy: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" placeholder="raj@example.com" value={form.submittedEmail}
                  onChange={(e) => setForm({ ...form, submittedEmail: e.target.value })} className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-stone-500">We&apos;ll notify you when your spot is published.</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-900 font-bold text-base py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploadingPhoto ? "Uploading Photo..." : "Submitting..."}
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Submit Spot for Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
