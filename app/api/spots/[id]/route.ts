import { type NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      UPDATE community_spots
      SET status = ${status}
      WHERE id = ${parseInt(id)}
      RETURNING id, name, status
    `;

    if (rows.length === 0) {
      return Response.json({ error: "Spot not found" }, { status: 404 });
    }

    return Response.json({ spot: rows[0] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const sql = getDb();
    await sql`DELETE FROM community_spots WHERE id = ${parseInt(id)}`;
    return Response.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
