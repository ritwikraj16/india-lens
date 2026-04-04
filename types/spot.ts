export type ShotType =
  | "landscape"
  | "architecture"
  | "wildlife"
  | "street"
  | "astro"
  | "portrait"
  | "aerial"
  | "waterscape";

export type TimeOfDay =
  | "sunrise"
  | "golden_hour_am"
  | "midday"
  | "golden_hour_pm"
  | "sunset"
  | "blue_hour"
  | "night";

export type CrowdLevel = "low" | "medium" | "high";

export type Region =
  | "Rajasthan"
  | "Himachal Pradesh"
  | "Uttarakhand"
  | "Kerala"
  | "Goa"
  | "Ladakh"
  | "Tamil Nadu"
  | "Karnataka"
  | "Maharashtra"
  | "Uttar Pradesh"
  | "West Bengal"
  | "Meghalaya"
  | "Andhra Pradesh"
  | "Sikkim"
  | "Gujarat";

export interface PhotoSpot {
  id: string;
  name: string;
  description: string;
  region: Region | string;
  state: string;
  lat: number;
  lng: number;
  cameraLat?: number;
  cameraLng?: number;
  subjectLat?: number;
  subjectLng?: number;
  shotTypes: ShotType[];
  bestMonths: number[]; // 1–12
  bestTimeOfDay: TimeOfDay[];
  crowdLevel: CrowdLevel;
  accessibility: "easy" | "moderate" | "difficult";
  monsoonAccessible?: boolean;
  festivalNearby?: string[];
  tips: string;
  parkingNotes?: string;
  coverImage: string;
  tags: string[];
  elevation?: number; // metres
  featured: boolean;
  // Community submission fields
  source?: "curated" | "community";
  submittedBy?: string;
  status?: "pending" | "approved" | "rejected";
}
