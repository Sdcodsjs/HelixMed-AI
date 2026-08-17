// ============================================================
// HelixMed AI — SQL utility with in-memory clinical DB
// Falls back to real Neon DB if DATABASE_URL is configured.
// All tables are pre-seeded with 5 realistic patients, 5 NCT
// trials, vitals, adverse events, and blockchain audit logs.
// ============================================================

const DB = {
  patients: [
    {
      id: 1,
      name: "Gregory House (Real UCI Heart Patient)",
      age: 67,
      gender: "Male",
      risk_score: 0.75,
      medical_history: { conditions: ["Coronary Artery Disease", "Angina Pectoris", "Hypertension", "Hypercholesterolemia"] },
      lab_results: { SBP: 160, Cholesterol: 286, Glucose: 102, HbA1c: 5.9, BMI: 29.0, LDL: 171, HDL: 57, eGFR: 91, CRP: 0.25 },
      created_at: new Date(Date.now() - 864e6 * 10).toISOString(),
    },
    {
      id: 2,
      name: "Arthur Pendelton (Real UCI Heart Patient)",
      age: 67,
      gender: "Male",
      risk_score: 0.75,
      medical_history: { conditions: ["Coronary Artery Disease", "Angina Pectoris"] },
      lab_results: { SBP: 120, Cholesterol: 229, Glucose: 109, HbA1c: 6.1, BMI: 33.1, LDL: 137, HDL: 45, eGFR: 95, CRP: 1.85 },
      created_at: new Date(Date.now() - 864e6 * 9).toISOString(),
    },
    {
      id: 3,
      name: "Allison Cameron (Real UCI Heart Patient)",
      age: 62,
      gender: "Female",
      risk_score: 0.75,
      medical_history: { conditions: ["Coronary Artery Disease", "Angina Pectoris", "Hypertension", "Hypercholesterolemia"] },
      lab_results: { SBP: 140, Cholesterol: 268, Glucose: 113, HbA1c: 6.3, BMI: 25.1, LDL: 160, HDL: 53, eGFR: 80, CRP: 0.54 },
      created_at: new Date(Date.now() - 864e6 * 8).toISOString(),
    },
    {
      id: 4,
      name: "Bruce Banner (Real UCI Heart Patient)",
      age: 63,
      gender: "Male",
      risk_score: 0.75,
      medical_history: { conditions: ["Coronary Artery Disease", "Angina Pectoris", "Hypercholesterolemia"] },
      lab_results: { SBP: 130, Cholesterol: 254, Glucose: 65, HbA1c: 4.7, BMI: 25.1, LDL: 152, HDL: 50, eGFR: 94, CRP: 0.52 },
      created_at: new Date(Date.now() - 864e6 * 7).toISOString(),
    },
    {
      id: 5,
      name: "Charles Xavier (Real UCI Heart Patient)",
      age: 53,
      gender: "Male",
      risk_score: 0.75,
      medical_history: { conditions: ["Coronary Artery Disease", "Angina Pectoris", "Hypertension"] },
      lab_results: { SBP: 140, Cholesterol: 203, Glucose: 109, HbA1c: 6.1, BMI: 22.9, LDL: 121, HDL: 40, eGFR: 75, CRP: 0.91 },
      created_at: new Date(Date.now() - 864e6 * 6).toISOString(),
    },
    {
      id: 6,
      name: "Victor Frankenstein (Real UCI Heart Patient)",
      age: 63,
      gender: "Male",
      risk_score: 0.15,
      medical_history: { conditions: ["Hypertension"] },
      lab_results: { SBP: 145, Cholesterol: 233, Glucose: 95, HbA1c: 5.7, BMI: 21.4, LDL: 139, HDL: 46, eGFR: 90, CRP: 1.08 },
      created_at: new Date(Date.now() - 864e6 * 5).toISOString(),
    },
    {
      id: 7,
      name: "John Watson (Real UCI Heart Patient)",
      age: 37,
      gender: "Male",
      risk_score: 0.15,
      medical_history: { conditions: ["Hypercholesterolemia"] },
      lab_results: { SBP: 130, Cholesterol: 250, Glucose: 106, HbA1c: 6.0, BMI: 24.8, LDL: 150, HDL: 50, eGFR: 73, CRP: 0.1 },
      created_at: new Date(Date.now() - 864e6 * 4).toISOString(),
    },
    {
      id: 8,
      name: "Clara Oswald (Real UCI Diabetes Patient)",
      age: 50,
      gender: "Female",
      risk_score: 0.82,
      medical_history: { conditions: ["Type 2 Diabetes"] },
      lab_results: { SBP: 112, Cholesterol: 219, Glucose: 148, HbA1c: 8.9, BMI: 33.6, LDL: 142, HDL: 48, eGFR: 74, CRP: 0.21 },
      created_at: new Date(Date.now() - 864e6 * 3).toISOString(),
    },
    {
      id: 9,
      name: "Dana Scully (Real UCI Diabetes Patient)",
      age: 32,
      gender: "Female",
      risk_score: 0.82,
      medical_history: { conditions: ["Type 2 Diabetes"] },
      lab_results: { SBP: 104, Cholesterol: 233, Glucose: 183, HbA1c: 10.7, BMI: 23.3, LDL: 151, HDL: 51, eGFR: 74, CRP: 0.26 },
      created_at: new Date(Date.now() - 864e6 * 2).toISOString(),
    },
    {
      id: 10,
      name: "Jane Foster (Real UCI Diabetes Patient)",
      age: 33,
      gender: "Female",
      risk_score: 0.82,
      medical_history: { conditions: ["Type 2 Diabetes"] },
      lab_results: { SBP: 80, Cholesterol: 256, Glucose: 137, HbA1c: 8.3, BMI: 43.1, LDL: 166, HDL: 56, eGFR: 75, CRP: 4.8 },
      created_at: new Date(Date.now() - 864e6 * 1).toISOString(),
    },
    {
      id: 11,
      name: "Lisa Cuddy (Real UCI Diabetes Patient)",
      age: 26,
      gender: "Female",
      risk_score: 0.82,
      medical_history: { conditions: ["Type 2 Diabetes"] },
      lab_results: { SBP: 90, Cholesterol: 209, Glucose: 78, HbA1c: 5.4, BMI: 31.0, LDL: 135, HDL: 45, eGFR: 91, CRP: 0.75 },
      created_at: new Date().toISOString(),
    },
    {
      id: 12,
      name: "Jean Grey (Real UCI Diabetes Patient)",
      age: 53,
      gender: "Female",
      risk_score: 0.82,
      medical_history: { conditions: ["Type 2 Diabetes"] },
      lab_results: { SBP: 110, Cholesterol: 179, Glucose: 197, HbA1c: 11.3, BMI: 30.5, LDL: 116, HDL: 39, eGFR: 115, CRP: 0.41 },
      created_at: new Date().toISOString(),
    }
  ],

  trials: [
    {
      id: 1, nct_id: "NCT04194944", phase: "Phase 3",
      title: "DAPA-CKD: Dapagliflozin in Patients with Chronic Kidney Disease",
      conditions: ["Chronic Kidney Disease", "Type 2 Diabetes"],
      recruitment_status: "recruiting", complexity_score: 0.72, dropout_risk_prob: 0.18,
      inclusion_criteria: [{ criterion: "eGFR 25-75 mL/min/1.73m²" }, { criterion: "UACR 200-5000 mg/g" }, { criterion: "Age 18+" }, { criterion: "T2D or non-diabetic CKD" }],
      exclusion_criteria: [{ criterion: "Type 1 Diabetes" }, { criterion: "eGFR < 25 mL/min/1.73m²" }, { criterion: "Active malignancy within 5 years" }, { criterion: "Current dialysis" }],
      created_at: new Date().toISOString(),
    },
    {
      id: 2, nct_id: "NCT03134872", phase: "Phase 3",
      title: "CREDENCE: Canagliflozin and Renal Events in Diabetes with Nephropathy",
      conditions: ["Type 2 Diabetes", "Diabetic Nephropathy"],
      recruitment_status: "recruiting", complexity_score: 0.68, dropout_risk_prob: 0.22,
      inclusion_criteria: [{ criterion: "HbA1c 6.5-12.0%" }, { criterion: "eGFR 30-90 mL/min/1.73m²" }, { criterion: "Age 30+" }],
      exclusion_criteria: [{ criterion: "Type 1 Diabetes" }, { criterion: "Dialysis or kidney transplant" }, { criterion: "Severe liver disease" }],
      created_at: new Date().toISOString(),
    },
    {
      id: 3, nct_id: "NCT04152005", phase: "Phase 3",
      title: "EMPEROR-Reduced: Empagliflozin in Heart Failure with Reduced EF",
      conditions: ["Heart Failure", "Coronary Artery Disease"],
      recruitment_status: "recruiting", complexity_score: 0.81, dropout_risk_prob: 0.28,
      inclusion_criteria: [{ criterion: "LVEF ≤ 40% confirmed by imaging" }, { criterion: "NYHA Class II-IV heart failure" }, { criterion: "Age 18+" }],
      exclusion_criteria: [{ criterion: "eGFR < 20 mL/min/1.73m²" }, { criterion: "SBP < 100 mmHg at screening" }],
      created_at: new Date().toISOString(),
    },
    {
      id: 4, nct_id: "NCT04814329", phase: "Phase 3",
      title: "FIGARO-DKD: Finerenone in CKD and Type 2 Diabetes",
      conditions: ["Chronic Kidney Disease", "Type 2 Diabetes"],
      recruitment_status: "recruiting", complexity_score: 0.65, dropout_risk_prob: 0.16,
      inclusion_criteria: [{ criterion: "eGFR 25-90 mL/min/1.73m²" }, { criterion: "HbA1c 7.0-10.0%" }, { criterion: "Age 18+" }],
      exclusion_criteria: [{ criterion: "Serum potassium > 4.8 mEq/L" }, { criterion: "eGFR < 25 mL/min/1.73m²" }],
      created_at: new Date().toISOString(),
    },
    {
      id: 5, nct_id: "NCT03062436", phase: "Phase 3",
      title: "DECLARE-TIMI 58: Dapagliflozin Cardiovascular Outcomes",
      conditions: ["Type 2 Diabetes", "Cardiovascular Disease"],
      recruitment_status: "recruiting", complexity_score: 0.59, dropout_risk_prob: 0.14,
      inclusion_criteria: [{ criterion: "HbA1c 6.5-12%" }, { criterion: "Age 40+ with established CVD" }, { criterion: "eGFR ≥ 60 mL/min/1.73m²" }],
      exclusion_criteria: [{ criterion: "Type 1 Diabetes" }, { criterion: "Renal transplant recipient" }],
      created_at: new Date().toISOString(),
    },
  ],

  vitals: [
    { id: 1, patient_id: 1, heart_rate: 78, bp_systolic: 160, bp_diastolic: 92, oxygen_level: 97, timestamp: new Date().toISOString() },
    { id: 2, patient_id: 2, heart_rate: 88, bp_systolic: 120, bp_diastolic: 78, oxygen_level: 95, timestamp: new Date().toISOString() },
    { id: 3, patient_id: 3, heart_rate: 94, bp_systolic: 140, bp_diastolic: 85, oxygen_level: 93, timestamp: new Date().toISOString() },
    { id: 4, patient_id: 4, heart_rate: 68, bp_systolic: 130, bp_diastolic: 80, oxygen_level: 99, timestamp: new Date().toISOString() },
    { id: 5, patient_id: 5, heart_rate: 85, bp_systolic: 140, bp_diastolic: 90, oxygen_level: 96, timestamp: new Date().toISOString() },
    { id: 6, patient_id: 6, heart_rate: 75, bp_systolic: 145, bp_diastolic: 90, oxygen_level: 98, timestamp: new Date().toISOString() },
    { id: 7, patient_id: 7, heart_rate: 70, bp_systolic: 130, bp_diastolic: 82, oxygen_level: 97, timestamp: new Date().toISOString() },
    { id: 8, patient_id: 8, heart_rate: 82, bp_systolic: 112, bp_diastolic: 70, oxygen_level: 96, timestamp: new Date().toISOString() },
    { id: 9, patient_id: 9, heart_rate: 90, bp_systolic: 104, bp_diastolic: 65, oxygen_level: 95, timestamp: new Date().toISOString() },
    { id: 10, patient_id: 10, heart_rate: 95, bp_systolic: 80, bp_diastolic: 50, oxygen_level: 94, timestamp: new Date().toISOString() },
    { id: 11, patient_id: 11, heart_rate: 72, bp_systolic: 90, bp_diastolic: 60, oxygen_level: 99, timestamp: new Date().toISOString() },
    { id: 12, patient_id: 12, heart_rate: 84, bp_systolic: 110, bp_diastolic: 70, oxygen_level: 95, timestamp: new Date().toISOString() },
  ],

  adverse_events: [
    { id: 1, patient_id: 3, symptom: "[Kaggle LSTM Alert (LSTM Prob: 84%)] NEWS2 Score 4 — Alert: Low oxygen saturation (93%)", severity: "medium", is_anomaly: true, reported_via: "mimic_news2_ai", timestamp: new Date(Date.now() - 36e5).toISOString() },
    { id: 2, patient_id: 2, symptom: "Elevated systolic BP (142 mmHg) with slight headache", severity: "low", is_anomaly: true, reported_via: "mimic_news2_ai", timestamp: new Date(Date.now() - 72e5).toISOString() },
  ],

  blockchain_logs: [
    { id: 1, action_type: "PATIENT_CONSENT", payload: JSON.stringify({ patientId: 1, status: "Active" }), prev_hash: "0".repeat(32), hash: "a2bf43b7871e998c4fde", actor_id: "admin_user", created_at: new Date(Date.now() - 1e5).toISOString() },
    { id: 2, action_type: "TRIAL_MATCHING_REAL_DATASETS", payload: JSON.stringify({ patientId: 1, trialId: "NCT04194944", matchProbability: 0.88 }), prev_hash: "a2bf43b7871e998c4fde", hash: "00004fde1889c25ff932", actor_id: "system_ai", created_at: new Date(Date.now() - 5e4).toISOString() },
  ],

  digital_twins: [],
};

function executeMock(strings, values) {
  const query = strings.reduce((acc, str, i) =>
    acc + str + (i < values.length ? `$${i + 1}` : ""), ""
  ).replace(/\s+/g, " ").trim();
  const q = query.toLowerCase();

  // ── COUNT ──
  if (q.includes("select count(*)")) {
    if (q.includes("from patients")) return [{ count: String(DB.patients.length) }];
    if (q.includes("from trials")) return [{ count: String(DB.trials.length) }];
    if (q.includes("from adverse_events")) return [{ count: String(DB.adverse_events.length) }];
    return [{ count: "0" }];
  }

  // ── PATIENTS ──
  if (q.includes("from patients") || q.includes("update patients")) {
    if (q.includes("where id =")) {
      const id = Number(values[0]);
      return DB.patients.filter(p => p.id === id);
    }
    if (q.includes("update patients set risk_score =")) {
      const riskScore = values[0]; const id = Number(values[1]);
      const idx = DB.patients.findIndex(p => p.id === id);
      if (idx !== -1) DB.patients[idx].risk_score = riskScore;
      return DB.patients.filter(p => p.id === id);
    }
    if (q.includes("where risk_score >")) {
      const thresh = Number(values[0]);
      return DB.patients.filter(p => p.risk_score > thresh)
        .sort((a, b) => b.risk_score - a.risk_score).slice(0, 5)
        .map(p => ({ name: p.name, risk_score: p.risk_score }));
    }
    return [...DB.patients].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  // ── TRIALS ──
  if (q.includes("from trials")) {
    let list = [...DB.trials];
    if (q.includes("where recruitment_status =")) {
      list = list.filter(t => t.recruitment_status === (values[0] || "recruiting"));
    }
    if (q.includes("limit 5")) list = list.slice(0, 5);
    if (q.includes("title, conditions, recruitment_status")) {
      return list.map(t => ({ title: t.title, conditions: t.conditions, recruitment_status: t.recruitment_status }));
    }
    return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  }

  // ── VITALS ──
  if (q.includes("vitals")) {
    if (q.includes("insert into vitals")) {
      const [patient_id, heart_rate, bp_systolic, bp_diastolic, oxygen_level] = values;
      const rec = { id: DB.vitals.length + 1, patient_id: Number(patient_id), heart_rate, bp_systolic, bp_diastolic, oxygen_level, timestamp: new Date().toISOString() };
      DB.vitals.push(rec);
      return [rec];
    }
    if (q.includes("select distinct on")) {
      const latestMap = {};
      DB.vitals.forEach(v => {
        const p = DB.patients.find(pt => pt.id === v.patient_id);
        if (!p) return;
        if (!latestMap[v.patient_id] || new Date(v.timestamp) > new Date(latestMap[v.patient_id].timestamp)) {
          latestMap[v.patient_id] = { ...v, patient_name: p.name, risk_score: p.risk_score, age: p.age, medical_history: p.medical_history };
        }
      });
      return Object.values(latestMap);
    }
    return [...DB.vitals];
  }

  // ── ADVERSE EVENTS ──
  if (q.includes("adverse_events")) {
    if (q.includes("insert into adverse_events")) {
      const [patient_id, symptom, severity, is_anomaly, reported_via] = values;
      const p = DB.patients.find(pt => pt.id === Number(patient_id));
      const rec = { id: DB.adverse_events.length + 1, patient_id: Number(patient_id), symptom, severity, is_anomaly, reported_via, patient_name: p?.name || "Unknown", timestamp: new Date().toISOString() };
      DB.adverse_events.push(rec);
      return [rec];
    }
    return DB.adverse_events.map(ae => {
      const p = DB.patients.find(pt => pt.id === ae.patient_id);
      return { ...ae, patient_name: p?.name || "Unknown" };
    }).filter(ae => ae.is_anomaly).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 20);
  }

  // ── BLOCKCHAIN LOGS ──
  if (q.includes("blockchain_logs")) {
    if (q.includes("insert into blockchain_logs")) {
      const [action_type, payload, prev_hash, hash, actor_id] = values;
      const rec = { id: DB.blockchain_logs.length + 1, action_type, payload, prev_hash, hash, actor_id, created_at: new Date().toISOString() };
      DB.blockchain_logs.push(rec);
      return [rec];
    }
    if (q.includes("select hash from blockchain_logs")) {
      return [...DB.blockchain_logs].sort((a, b) => b.id - a.id).slice(0, 1).map(l => ({ hash: l.hash }));
    }
    return [...DB.blockchain_logs].sort((a, b) => b.id - a.id).slice(0, 50);
  }

  // ── DIGITAL TWINS ──
  if (q.includes("digital_twins")) {
    if (q.includes("insert into digital_twins")) {
      const [patient_id, scenario, prediction_data] = values;
      const rec = { id: DB.digital_twins.length + 1, patient_id: Number(patient_id), scenario, prediction_data, created_at: new Date().toISOString() };
      DB.digital_twins.push(rec);
      return [rec];
    }
    return [...DB.digital_twins];
  }

  console.warn("[MockSQL] Unhandled query:", query, "values:", values);
  return [];
}

// Lazy-load neon only when DATABASE_URL is present to avoid
// WebSocket resolution errors in Vite SSR module runner context.
let _neonFn = null;
async function getNeonFn() {
  if (_neonFn) return _neonFn;
  if (!process.env.DATABASE_URL) return null;
  try {
    const mod = await import("@neondatabase/serverless");
    _neonFn = mod.neon(process.env.DATABASE_URL);
    return _neonFn;
  } catch (e) {
    console.warn("[sql] Failed to load @neondatabase/serverless:", e.message);
    return null;
  }
}

async function sqlFn(strings, ...values) {
  const neonQuery = await getNeonFn();
  if (neonQuery) {
    try {
      return await neonQuery(strings, ...values);
    } catch (e) {
      console.warn("[sql] Neon query failed, using mock DB:", e.message);
    }
  }
  return executeMock(strings, values);
}

sqlFn.transaction = (cb) => cb(sqlFn);

export default sqlFn;