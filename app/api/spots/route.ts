import { type NextRequest } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") || "approved";

  try {
    const sql = getDb();

    let rows;
    if (status === "all") {
      rows = await sql`
        SELECT * FROM community_spots
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT * FROM community_spots
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    }

    return Response.json({ spots: rows });
  } catch {
    return Response.json({ spots: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name, description, region, state, lat, lng, elevation,
      shotTypes, bestMonths, bestTimeOfDay, crowdLevel, accessibility,
      monsoonAccessible, tips, parkingNotes, tags, coverImage,
      submittedBy, submittedEmail,
    } = body;

    if (!name || !coverImage) {
      return Response.json(
        { error: "Name and photo are required" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36);

    const sql = getDb();

    await initDb();

    await sql`
      INSERT INTO community_spots (
        slug, name, description, region, state, lat, lng, elevation,
        shot_types, best_months, best_time_of_day, crowd_level, accessibility,
        monsoon_accessible, tips, parking_notes, tags, cover_image,
        submitted_by, submitted_email, status
      ) VALUES (
        ${slug}, ${name}, ${description || ""}, ${region || state || "Unknown"}, ${state || "Unknown"},
        ${lat ? parseFloat(lat) : 0}, ${lng ? parseFloat(lng) : 0}, ${elevation ? parseInt(elevation) : null},
        ${shotTypes || []}, ${bestMonths || []}, ${bestTimeOfDay || []},
        ${crowdLevel || "medium"}, ${accessibility || "easy"},
        ${monsoonAccessible || false}, ${tips || ""}, ${parkingNotes || null},
        ${tags || []}, ${coverImage},
        ${submittedBy || null}, ${submittedEmail || null}, 'pending'
      )
    `;

    return Response.json({ success: true, slug });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to create spot:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
