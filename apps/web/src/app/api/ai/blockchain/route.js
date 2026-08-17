import sql from "../../utils/sql.js";
import crypto from "node:crypto";

export async function GET() {
  try {
    const logs =
      await sql`SELECT * FROM blockchain_logs ORDER BY id DESC LIMIT 50`;
    return Response.json(logs);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { actionType, payload } = await request.json();

    // Fetch last block
    const prevLogs =
      await sql`SELECT hash FROM blockchain_logs ORDER BY id DESC LIMIT 1`;
    const prevHash = prevLogs[0]?.hash || "0".repeat(32);

    // Real SHA-256 hash chain
    const hash = crypto
      .createHash("sha256")
      .update(prevHash + JSON.stringify(payload) + Date.now())
      .digest("hex")
      .slice(0, 32);

    const [newLog] = await sql`
      INSERT INTO blockchain_logs (action_type, payload, prev_hash, hash, actor_id)
      VALUES (${actionType}, ${JSON.stringify(payload)}, ${prevHash}, ${hash}, 'admin_user')
      RETURNING *
    `;

    return Response.json(newLog);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create block" }, { status: 500 });
  }
}
