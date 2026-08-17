export async function POST(request) {
  try {
    const { billType = "surgical" } = await request.json();

    const BILL_SAMPLES = {
      surgical: {
        billId: "BILL-SURG-10P-9082",
        fileName: "MetroGeneral_Inpatient_Surgical_ICU_10Page.pdf",
        pages: 10,
        parsedLayout: "opendataloader-pdf v2.4 (High-Density 10-Page Inpatient Layout)",
        provider: "MetroGeneral Tertiary Hospital & Trauma Center",
        patientName: "Sarah Jenkins",
        admissionDates: "10-Page Record (Oct 12 – Oct 22, 2025)",
        totalBilled: 42500.0,
        auditedCorrected: 28150.0,
        overchargeGap: 14350.0,
        lineItems: [
          { code: "CPT-43239", desc: "Upper GI Endoscopy w/ Biopsy", billed: 4500.0, recommended: 2100.0, flag: "Upcoding Detected" },
          { code: "CPT-00810", desc: "Anesthesia for Lower Intestinal Endoscopy", billed: 3800.0, recommended: 1950.0, flag: "Time Unit Inflation" },
          { code: "LAB-80053", desc: "Comprehensive Metabolic Panel (x12 Daily Runs)", billed: 6400.0, recommended: 1200.0, flag: "Duplicate Lab Runs" },
          { code: "ICU-0200", desc: "Continuous ICU Telemetry Monitoring (7 Days)", billed: 18500.0, recommended: 14000.0, flag: "Unbundled Room Fee" },
          { code: "PHARM-991", desc: "IV Anti-Emetic & Analgesic Administration", billed: 9300.0, recommended: 8900.0, flag: "Approved Charge" },
        ],
        workflowState: "AUDIT_COMPLETE",
      },
      oncology: {
        billId: "BILL-ONC-10P-4412",
        fileName: "StJude_Oncology_Biologic_Infusion_10Page.pdf",
        pages: 10,
        parsedLayout: "opendataloader-pdf v2.4 (10-Page Complex Chemotherapy Layout)",
        provider: "St. Jude Cancer & Biologic Infusion Center",
        patientName: "Robert Chen",
        admissionDates: "10-Page Record (Nov 01 – Nov 15, 2025)",
        totalBilled: 88900.0,
        auditedCorrected: 54200.0,
        overchargeGap: 34700.0,
        lineItems: [
          { code: "J9312", desc: "Rituximab Injection (10mg x 50 Units)", billed: 48000.0, recommended: 29000.0, flag: "Excess Vial Unit Markup" },
          { code: "CPT-96413", desc: "Chemotherapy Administration IV (Initial Hr)", billed: 12500.0, recommended: 6200.0, flag: "Facility Rate Overcharge" },
          { code: "CPT-96415", desc: "Chemotherapy Administration IV (Each Addl Hr)", billed: 9400.0, recommended: 4800.0, flag: "Unbundled Time Charge" },
          { code: "J1453", desc: "Fosaprepitant Injection 150mg (Pre-medication)", billed: 7200.0, recommended: 4100.0, flag: "Duplicate Anti-Emetic" },
          { code: "LAB-85025", desc: "Complete Blood Count w/ Automated Differential", billed: 11800.0, recommended: 10100.0, flag: "Approved Charge" },
        ],
        workflowState: "AUDIT_COMPLETE",
      },
      cardiology: {
        billId: "BILL-CARD-10P-7721",
        fileName: "JohnsHopkins_Cardiology_Catheterization_10Page.pdf",
        pages: 10,
        parsedLayout: "opendataloader-pdf v2.4 (10-Page Interventional Cardiology Layout)",
        provider: "Johns Hopkins Cardiac & Vascular Institute",
        patientName: "Elena Rostova",
        admissionDates: "10-Page Record (Dec 03 – Dec 10, 2025)",
        totalBilled: 65400.0,
        auditedCorrected: 41800.0,
        overchargeGap: 23600.0,
        lineItems: [
          { code: "CPT-93458", desc: "Left Heart Catheterization w/ Coronary Angiogram", billed: 22000.0, recommended: 14200.0, flag: "CPT Bundle Override" },
          { code: "C1874", desc: "Drug-Eluting Coronary Stent Consumables (x2)", billed: 18400.0, recommended: 11000.0, flag: "Device Consumable Overcharge" },
          { code: "CPT-92928", desc: "Percutaneous Transluminal Coronary Angioplasty", billed: 14500.0, recommended: 8900.0, flag: "Duplicate Surgical Procedure" },
          { code: "ICU-0210", desc: "Post-Cardiac Cath Recovery Unit (24 Hrs)", billed: 6500.0, recommended: 4200.0, flag: "Non-Covered Room Rate" },
          { code: "PHARM-331", desc: "Heparin & Glycoprotein IIb/IIIa Inhibitor IV", billed: 4000.0, recommended: 3500.0, flag: "Approved Charge" },
        ],
        workflowState: "AUDIT_COMPLETE",
      },
    };

    const auditSummary = BILL_SAMPLES[billType] || BILL_SAMPLES.surgical;

    return new Response(JSON.stringify(auditSummary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to parse medical bill PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
