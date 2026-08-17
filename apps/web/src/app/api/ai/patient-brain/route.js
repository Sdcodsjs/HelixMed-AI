export async function POST(request) {
  try {
    const { patientId = 1, heartRate = 78, sleepHours = 7.5, steps = 8420, spO2 = 98 } = await request.json();

    const timestamp = new Date().toISOString();
    const isAbnormal = heartRate > 120 || spO2 < 92;

    const taskQueueEntry = isAbnormal
      ? {
          taskId: "TASK-" + Date.now().toString().slice(-6),
          priority: "HIGH",
          assignee: "Dr. Rachel Vance (Cardiology)",
          actionRequired: "Review abnormal SpO2 / Tachycardia telemetry burst",
          status: "QUEUED",
        }
      : null;

    const brainSyncResult = {
      status: "SUCCESS",
      patientId,
      timestamp,
      telemetry: { heartRate, sleepHours, steps, spO2 },
      patientBrainGrounded: true,
      proactiveAlertTriggered: isAbnormal,
      taskQueueEscalation: taskQueueEntry,
    };

    return new Response(JSON.stringify(brainSyncResult), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to sync Patient Brain telemetry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
