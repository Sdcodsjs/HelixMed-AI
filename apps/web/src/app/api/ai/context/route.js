import sql from "../../utils/sql.js";

export async function GET() {
  try {
    // Fetch summary data to give context to the AI
    const [patientCount] = await sql`SELECT count(*) FROM patients`;
    const [trialCount] = await sql`SELECT count(*) FROM trials`;
    const [aeCount] = await sql`SELECT count(*) FROM adverse_events`;

    const recentTrials =
      await sql`SELECT title, conditions, recruitment_status FROM trials LIMIT 5`;
    const highRiskPatients =
      await sql`SELECT name, risk_score FROM patients WHERE risk_score > 0.7 LIMIT 5`;

    const context = {
      summary: {
        totalPatients: parseInt(patientCount.count),
        totalTrials: parseInt(trialCount.count),
        totalAdverseEvents: parseInt(aeCount.count),
      },
      recentTrials,
      highRiskPatients,
    };

    return Response.json(context);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch context" }, { status: 500 });
  }
}
