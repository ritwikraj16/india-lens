import { PhotoSpot } from "@/types/spot";

interface DbSpotRow {
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
  status: string;
}

export function dbRowToPhotoSpot(row: DbSpotRow): PhotoSpot {
  return {
    id: `community-${row.slug}`,
    name: row.name,
    description: row.description,
    region: row.region,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    elevation: row.elevation ?? undefined,
    shotTypes: row.shot_types as PhotoSpot["shotTypes"],
    bestMonths: row.best_months,
    bestTimeOfDay: row.best_time_of_day as PhotoSpot["bestTimeOfDay"],
    crowdLevel: row.crowd_level as PhotoSpot["crowdLevel"],
    accessibility: row.accessibility as PhotoSpot["accessibility"],
    monsoonAccessible: row.monsoon_accessible,
    tips: row.tips,
    parkingNotes: row.parking_notes ?? undefined,
    tags: row.tags,
    coverImage: row.cover_image,
    featured: false,
    source: "community",
    submittedBy: row.submitted_by ?? undefined,
    status: row.status as PhotoSpot["status"],
  };
}

export async function fetchCommunitySpots(): Promise<PhotoSpot[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/spots?status=approved`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.spots || []).map(dbRowToPhotoSpot);
  } catch {
    return [];
  }
}
