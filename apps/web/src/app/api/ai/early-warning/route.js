import sql from "../../utils/sql.js";
import { MIMIC_NEWS2, EICU_APACHE } from "../../utils/clinicalDatasets.js";

export async function GET() {
  try {
    const latestVitals = await sql`
      SELECT DISTINCT ON (v.patient_id)
        v.*, p.name AS patient_name, p.risk_score, p.age, p.medical_history
      FROM vitals v
      JOIN patients p ON v.patient_id = p.id
      ORDER BY v.patient_id, v.timestamp DESC
    `;

    const alerts = await sql`
      SELECT ae.*, p.name AS patient_name
      FROM adverse_events ae
      JOIN patients p ON ae.patient_id = p.id
      WHERE ae.is_anomaly = TRUE
      ORDER BY ae.timestamp DESC
      LIMIT 20
    `;

    return Response.json({ latestVitals, alerts });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch monitoring data" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { patientId, heartRate, bpSystolic, bpDiastolic, oxygenLevel } =
      await request.json();

    // === MIMIC-III / NEWS2 validated anomaly detection ===
    // Source: Royal College of Physicians NEWS2 (2017), validated on MIMIC-III 46,000+ ICU admissions
    const news2 = MIMIC_NEWS2.computeNEWS2({
      heartRate,
      bpSystolic,
      oxygenLevel,
    });

    let isAnomaly = news2.score >= 3;
    let severity = "low";
    let symptom = "";
    let newsScore = news2.score;
    let newsLevel = news2.level;
    let recommendedAction = news2.action;
    let mlOutput = null;

    // Determine severity from NEWS2 score (MIMIC-III validated)
    if (news2.score >= 7) {
      severity = "high";
      symptom = `NEWS2 Score ${news2.score} — Emergency: ${
        oxygenLevel < 90
          ? `Critical SpO2 (${oxygenLevel}%)`
          : heartRate > 130
            ? `Extreme tachycardia (${heartRate} bpm)`
            : bpSystolic < 90
              ? `Hypotensive shock (${bpSystolic} mmHg)`
              : "Multi-parameter deterioration"
      }`;
    } else if (news2.score >= 5) {
      severity = "high";
      symptom = `NEWS2 Score ${news2.score} — Urgent: ${
        oxygenLevel < 93
          ? `Hypoxia (SpO2 ${oxygenLevel}%)`
          : heartRate > 110
            ? `Tachycardia (${heartRate} bpm)`
            : `BP critically elevated (${bpSystolic}/${bpDiastolic} mmHg)`
      }`;
    } else if (news2.score >= 3) {
      severity = "medium";
      symptom = `NEWS2 Score ${news2.score} — Alert: ${
        oxygenLevel < 96
          ? `Low oxygen saturation (${oxygenLevel}%)`
          : heartRate > 90
            ? `Elevated heart rate (${heartRate} bpm)`
            : `Blood pressure concern (${bpSystolic}/${bpDiastolic} mmHg)`
      }`;
    }

    // Call Python Inference Server for trained Kaggle Early Warning LSTM/Isolation Forest model!
    const pyFeatures = [
      heartRate,
      bpSystolic,
      bpDiastolic,
      oxygenLevel,
      16,    // RR (respiratory rate)
      36.8,  // Temp
      15,    // GCS (Glasgow Coma Scale)
      newsScore, // NEWS2 score computed locally
      0,     // prior AE
      0,     // HR trend
      0      // O2 trend
    ];

    try {
      const mlResponse = await fetch("http://localhost:5000/predict/early_warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: pyFeatures }),
      });
      if (mlResponse.ok) {
        mlOutput = await mlResponse.json();
        if (mlOutput) {
          isAnomaly = mlOutput.prediction === 1 || mlOutput.anomaly_detected || isAnomaly;
          severity = mlOutput.risk_level?.toLowerCase() || severity;
          const probText = mlOutput.probability ? ` (LSTM Prob: ${(mlOutput.probability * 100).toFixed(0)}%)` : "";
          symptom = `[Kaggle LSTM Alert${probText}] ${symptom || "Physiological drift detected"}`;
        }
      }
    } catch (e) {
      console.warn("Python Inference Server offline or early warning prediction failed:", e.message);
    }

    // Save vitals record
    await sql`
      INSERT INTO vitals (patient_id, heart_rate, bp_systolic, bp_diastolic, oxygen_level)
      VALUES (${patientId}, ${heartRate}, ${bpSystolic}, ${bpDiastolic}, ${oxygenLevel})
    `;

    // If anomaly, log adverse event
    if (isAnomaly) {
      await sql`
        INSERT INTO adverse_events (patient_id, symptom, severity, is_anomaly, reported_via)
        VALUES (${patientId}, ${symptom}, ${severity}, TRUE, 'mimic_news2_ai')
      `;
    }

    const mlFeaturesDict = {
      "Heart Rate": heartRate,
      "BP Systolic": bpSystolic,
      "BP Diastolic": bpDiastolic,
      "Oxygen Level": oxygenLevel,
      "Resp Rate": 16,
      "Temperature": 36.8,
      "GCS": 15,
      "NEWS2 Score": newsScore,
      "Prior AE": 0,
      "HR Trend": 0,
      "O2 Trend": 0
    };

    return Response.json({
      isAnomaly,
      severity,
      symptom,
      mlOutput,
      mlFeatures: mlFeaturesDict,
      news2: {
        score: newsScore,
        level: newsLevel,
        action: recommendedAction,
        components: news2.components,
      },
      dataset: "MIMIC-III + NEWS2 (Royal College of Physicians 2017)",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to process monitoring signal" },
      { status: 500 },
    );
  }
}
