import sql from "../utils/sql.js";

export async function GET() {
  console.log("[patients/route.js] GET request received");
  try {
    const patients = await sql`SELECT * FROM patients ORDER BY created_at DESC`;
    return Response.json(patients);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}
