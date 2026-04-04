import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS community_spots (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      region TEXT NOT NULL,
      state TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      elevation INTEGER,
      shot_types TEXT[] NOT NULL DEFAULT '{}',
      best_months INTEGER[] NOT NULL DEFAULT '{}',
      best_time_of_day TEXT[] NOT NULL DEFAULT '{}',
      crowd_level TEXT NOT NULL DEFAULT 'medium',
      accessibility TEXT NOT NULL DEFAULT 'easy',
      monsoon_accessible BOOLEAN DEFAULT false,
      tips TEXT NOT NULL DEFAULT '',
      parking_notes TEXT,
      tags TEXT[] NOT NULL DEFAULT '{}',
      cover_image TEXT NOT NULL,
      submitted_by TEXT,
      submitted_email TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
