import sql from "../utils/sql.js";

export async function GET() {
  try {
    const trials = await sql`SELECT * FROM trials ORDER BY created_at DESC`;
    return Response.json(trials);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch trials" }, { status: 500 });
  }
}
