// Hospital Management & Smart Appointment Booking API
// Handles slot availability, OPD token generation, ABHA ID verification, and claims pre-authorization.

const DOCTORS = [
  { id: "DR-101", name: "Dr. Priya Sharma", spec: "Cardiology", room: "OPD 104", slots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"], fee: "₹800" },
  { id: "DR-102", name: "Dr. Arjun Menon", spec: "Oncology", room: "OPD 208", slots: ["10:00 AM", "11:30 AM", "03:00 PM"], fee: "₹1200" },
  { id: "DR-103", name: "Dr. Sunita Rao", spec: "Pulmonology", room: "OPD 112", slots: ["09:30 AM", "01:00 PM", "05:00 PM"], fee: "₹750" },
  { id: "DR-104", name: "Dr. Rajesh Gupta", spec: "Neurology", room: "OPD 301", slots: ["11:00 AM", "02:30 PM", "04:00 PM"], fee: "₹1000" },
];

let tokenCounter = 14;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "doctors") {
    return Response.json({ status: "SUCCESS", doctors: DOCTORS });
  }

  if (action === "beds") {
    return Response.json({
      status: "SUCCESS",
      wards: [
        { name: "Cardiac ICU", total: 8, occupied: 6, available: 2, criticalAlerts: 1 },
        { name: "General Male Ward", total: 20, occupied: 15, available: 5, criticalAlerts: 0 },
        { name: "General Female Ward", total: 20, occupied: 18, available: 2, criticalAlerts: 0 },
        { name: "Isolation & Infection Control", total: 6, occupied: 3, available: 3, criticalAlerts: 0 },
      ],
    });
  }

  return Response.json({ status: "SUCCESS", doctors: DOCTORS, currentToken: `CARD-0${tokenCounter}` });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action;

    // 1. Book Appointment & Generate Live OPD Token
    if (action === "book_slot") {
      tokenCounter += 1;
      const { doctorId, slot, patientName, patientType = "Self", condition = "General Checkup" } = body;
      const doc = DOCTORS.find((d) => d.id === doctorId) || DOCTORS[0];
      const prefix = doc.spec.slice(0, 4).toUpperCase();
      const tokenId = `${prefix}-0${tokenCounter}`;

      return Response.json({
        status: "SUCCESS",
        booking: {
          bookingId: "BKG-" + Date.now().toString(16).toUpperCase(),
          tokenId,
          doctorName: doc.name,
          specialty: doc.spec,
          room: doc.room,
          slot,
          patientName: patientName || "Ravi Kumar",
          patientType,
          condition,
          estimatedWaitMinutes: Math.floor(Math.random() * 25) + 10,
          tokenStatus: "NEXT_IN_LINE",
          registeredAt: new Date().toISOString(),
        },
      });
    }

    // 2. ABHA Health ID Verification & Link
    if (action === "verify_abha") {
      const { abhaId } = body;
      const cleanAbha = (abhaId || "").replace(/[^0-9]/g, "");

      if (cleanAbha.length !== 14) {
        return Response.json(
          { status: "INVALID", message: "ABHA Number must be exactly 14 digits (NN-NNNN-NNNN-NNNN)" },
          { status: 400 }
        );
      }

      const formatted = `${cleanAbha.slice(0, 2)}-${cleanAbha.slice(2, 6)}-${cleanAbha.slice(6, 10)}-${cleanAbha.slice(10, 14)}`;

      return Response.json({
        status: "SUCCESS",
        abhaRecord: {
          abhaNumber: formatted,
          abhaAddress: `${body.name?.toLowerCase().replace(/\s+/g, "") || "ravikumar"}@abdm`,
          name: body.name || "Ravi Kumar",
          gender: "Male",
          dob: "1982-05-14",
          mobileVerified: true,
          linkedHospitalContexts: [
            { clinic: "MetroGeneral Tertiary", visitDate: "2025-11-10", type: "OPD Consultation" },
            { clinic: "St. Jude Biologic Center", visitDate: "2025-12-04", type: "Lab Panel & Diagnostic" },
          ],
          activeConsentArtifacts: [
            { id: "CONSENT-9081", purpose: "Care Management", grantedTo: "Dr. Priya Sharma", expiry: "2026-12-31" },
          ],
        },
      });
    }

    // 3. Claims Pre-Authorization & Denial Predictor
    if (action === "preauth_claims") {
      const { icdCode = "E11.9", cptCode = "99213", totalBilled = 14500 } = body;

      const approvalProb = icdCode.startsWith("E11") ? 0.92 : 0.74;
      const denialRisk = parseFloat((1 - approvalProb).toFixed(2));

      return Response.json({
        status: "SUCCESS",
        preAuthResult: {
          claimId: "CLM-PREAUTH-" + Date.now().toString().slice(-6),
          icdCode,
          cptCode,
          totalBilled: parseFloat(totalBilled),
          approvedAmount: Math.round(totalBilled * approvalProb),
          approvalProbability: approvalProb,
          denialRiskScore: denialRisk,
          riskLevel: denialRisk < 0.15 ? "LOW_RISK" : "MODERATE_RISK",
          autoFixSuggestions: [
            "Attach 12-lead ECG pre-procedure baseline to prevent generic code rejection",
            "Verify secondary ICD-10 diagnosis I10 (Hypertension) for bundle completeness",
          ],
        },
      });
    }

    return Response.json({ status: "SUCCESS", message: "Hospital Booking API ready" });
  } catch (err) {
    return Response.json({ status: "ERROR", message: "Failed to process request" }, { status: 500 });
  }
}
