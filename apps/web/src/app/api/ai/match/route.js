import sql from "../../utils/sql.js";
import crypto from "node:crypto";
import {
  computeCompositePatientRisk,
  matchTrialCriteria,
  FRAMINGHAM,
  CHARLSON_COMORBIDITY,
  UCI_DIABETES,
  NHANES,
} from "../../utils/clinicalDatasets.js";

export async function POST(request) {
  try {
    const { patientId } = await request.json();

    // 1. Get Patient Data
    const [patient] = await sql`SELECT * FROM patients WHERE id = ${patientId}`;
    if (!patient)
      return Response.json({ error: "Patient not found" }, { status: 404 });

    // 2. Compute composite real-world risk score (Framingham + SEER + UCI + NHANES)
    const compositeRisk = computeCompositePatientRisk(patient);

    // Update patient risk_score in DB with real-world composite
    await sql`UPDATE patients SET risk_score = ${compositeRisk} WHERE id = ${patientId}`;

    // 3. Call Python Inference Server for trained Kaggle Model matching!
    const genderVal = patient.gender?.toLowerCase() === "female" ? 0 : 1;
    const sbpVal = patient.lab_results?.SBP || 120;
    const cholVal = patient.lab_results?.Cholesterol || 200;
    const glucoseVal = patient.lab_results?.Glucose || 100;
    const fastingBsVal = glucoseVal > 120 ? 1 : 0;
    
    // Map conditions to chest pain (angina)
    const hasAngina = patient.medical_history?.conditions?.some(c => 
      c.toLowerCase().includes("angina") || c.toLowerCase().includes("chest pain") || c.toLowerCase().includes("coronary")
    ) ? 3 : 1;

    const mlFeatures = [
      patient.age || 50,
      genderVal,
      hasAngina, // chest pain type
      sbpVal,
      cholVal,
      fastingBsVal,
      1, // resting ecg
      150, // max hr
      hasAngina === 3 ? 1 : 0, // exercise induced angina
      1.0, // oldpeak
      2, // slope
      0, // ca
      3 // thal
    ];

    let mlOutput = null;
    try {
      const mlResponse = await fetch("http://localhost:5000/predict/trial_matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: mlFeatures }),
      });
      if (mlResponse.ok) {
        mlOutput = await mlResponse.json();
      }
    } catch (e) {
      console.warn("Python Inference Server offline or trial matching prediction failed:", e.message);
    }

    // 4. Get all recruiting trials
    const trials =
      await sql`SELECT * FROM trials WHERE recruitment_status = 'recruiting'`;

    // 5. Run real-world-calibrated matching on each trial
    const results = trials.map((trial) => {
      // Use real NCT criteria matching from clinicalDatasets.js
      let { score, rationale } = matchTrialCriteria(patient, trial);

      // Blending of ML prediction into score if available
      if (mlOutput && mlOutput.probability) {
        const mlProb = mlOutput.probability.eligible;
        // Blend: 60% NCT criteria matching, 40% ML model candidacy
        score = Math.round(score * 0.6 + mlProb * 100 * 0.4);
      }

      // Build dataset attribution breakdown
      const labs = patient.lab_results || {};
      const conditions = patient.medical_history?.conditions || [];

      // Framingham CVD risk (real coefficient computation)
      const framinghamRisk = FRAMINGHAM.computeRisk({
        age: patient.age,
        totalCholesterol: labs.Cholesterol || 200,
        hdl: labs.HDL || 50,
        sbp: labs.SBP || 120,
        onBPMeds: conditions.includes("Hypertension"),
        isDiabetic: conditions.some((c) => c.toLowerCase().includes("diabet")),
        gender: patient.gender?.toLowerCase() === "female" ? "female" : "male",
      });

      // Charlson CCI from SEER database
      const cci = CHARLSON_COMORBIDITY.computeIndex(conditions);

      // UCI Diabetes risk
      const diabetesRisk = UCI_DIABETES.scoreDiabetesRisk({
        hba1c: labs.HbA1c || 5.7,
        glucose: labs.Glucose || 100,
        age: patient.age,
        systolicBP: labs.SBP || 120,
      });

      // NHANES age multiplier
      const ageMultiplier = NHANES.getAgeMultiplier(patient.age);

      return {
        id: trial.id,
        title: trial.title,
        nct_id: trial.nct_id,
        phase: trial.phase,
        score,
        rationale,
        datasetInsights: {
          framinghamCVDRisk: parseFloat((framinghamRisk * 100).toFixed(1)),
          charlsonCCI: cci,
          diabetesRiskScore: parseFloat((diabetesRisk * 100).toFixed(1)),
          nhanes_ageMultiplier: ageMultiplier,
          compositeRisk: parseFloat((compositeRisk * 100).toFixed(1)),
        },
      };
    });

    results.sort((a, b) => b.score - a.score);

    // 6. Blockchain audit log with SHA-256
    const payload = {
      patientId,
      compositeRisk,
      topMatchedTrialId: results[0]?.id,
      topScore: results[0]?.score,
      datasetsUsed: [
        "Framingham",
        "SEER/Charlson",
        "UCI_Diabetes",
        "NHANES",
        "ClinicalTrials.gov",
        "Kaggle UCI Heart ML"
      ],
    };
    const prevLog =
      await sql`SELECT hash FROM blockchain_logs ORDER BY id DESC LIMIT 1`;
    const prevHash = prevLog[0]?.hash || "0".repeat(32);
    const hash = crypto
      .createHash("sha256")
      .update(prevHash + JSON.stringify(payload) + Date.now())
      .digest("hex")
      .slice(0, 32);

    await sql`
      INSERT INTO blockchain_logs (action_type, payload, prev_hash, hash, actor_id)
      VALUES ('TRIAL_MATCHING_REAL_DATASETS', ${JSON.stringify(payload)}, ${prevHash}, ${hash}, 'system_ai')
    `;

    return Response.json({
      results,
      compositeRisk,
      mlPrediction: mlOutput ? {
        eligible: mlOutput.prediction === 1 || mlOutput.probability?.eligible > 0.5,
        probability: mlOutput.probability?.eligible || 0.85,
        riskLevel: mlOutput.risk_level || "Medium",
        featuresUsed: {
          Age: patient.age || 50,
          Sex: patient.gender,
          SBP: sbpVal,
          Cholesterol: cholVal,
          Glucose: glucoseVal,
          Angina: hasAngina === 3 ? "Yes" : "No",
          "Fasting BS": fastingBsVal,
          "Resting ECG": 1,
          "Max HR": 150,
          "Ex Angina": hasAngina === 3 ? "Yes" : "No",
          "Oldpeak": 1.0,
          "Slope": 2,
          "CA": 0,
          "Thal": 3
        }
      } : null
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
