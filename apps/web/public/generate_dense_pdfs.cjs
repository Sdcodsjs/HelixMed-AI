const fs = require('fs');
const path = require('path');

const dir = __dirname;
const outputSubDir = path.join(dir, 'sample_bills');
if (!fs.existsSync(outputSubDir)) fs.mkdirSync(outputSubDir, { recursive: true });

function createDense10PageHospitalBill(provider, patientName, patientDOB, mrn, claimId, insuranceGroup, totalBilled, itemCategoryList) {
  let objects = [];

  // 1: Catalog
  objects.push("1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj");

  // 2: Pages array
  let pageRefs = [];
  for (let i = 1; i <= 10; i++) {
    pageRefs.push(`${i * 2 + 2} 0 R`);
  }
  objects.push(`2 0 obj\n<</Type /Pages /Count 10 /Kids [${pageRefs.join(" ")}]>>\nendobj`);

  // 3: Font
  objects.push("3 0 obj\n<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold>>\nendobj");

  let currentObjId = 4;

  for (let pageNum = 1; pageNum <= 10; pageNum++) {
    const pageObjId = currentObjId;
    const contentObjId = currentObjId + 1;
    currentObjId += 2;

    let text = "";
    text += `BT /F1 14 Tf 40 750 Td (${provider.toUpperCase()}) Tj ET\n`;
    text += `BT /F1 10 Tf 40 735 Td (DEPARTMENT OF HEALTHCARE FINANCIAL MANAGEMENT & ITEMIZED AUDIT STATEMENT) Tj ET\n`;
    text += `BT /F1 9 Tf 40 715 Td (PATIENT NAME: ${patientName.padEnd(25)} DOB: ${patientDOB}   MRN: ${mrn}   CLAIM ID: ${claimId}) Tj ET\n`;
    text += `BT /F1 9 Tf 40 702 Td (ADMIT DATE: 10/12/2025   DISCHARGE DATE: 10/22/2025   INSURANCE: BLUE CROSS GLOBAL (GRP: ${insuranceGroup})) Tj ET\n`;
    text += `BT /F1 9 Tf 40 689 Td (STATEMENT PAGE: ${pageNum} OF 10   TOTAL BILLED CUMULATIVE: ${totalBilled}) Tj ET\n`;
    text += `BT /F1 9 Tf 40 675 Td (====================================================================================================) Tj ET\n`;

    let y = 655;
    text += `BT /F1 9 Tf 40 ${y} Td (DOS        REV CODE   CPT / CODE    DETAILED CHARGE DESCRIPTION                 QTY   UNIT PRICE    TOTAL CHARGE) Tj ET\n`;
    y -= 12;
    text += `BT /F1 9 Tf 40 ${y} Td (----------------------------------------------------------------------------------------------------) Tj ET\n`;

    // 15 line items per page for true 10-page density
    itemCategoryList.forEach((item, idx) => {
      y -= 22;
      const lineNum = (pageNum - 1) * 15 + idx + 1;
      const dos = `10/${(12 + (idx % 8)).toString().padStart(2, '0')}/25`;
      const rev = `0${200 + (idx % 7) * 10}`;
      const qty = (idx % 3) + 1;
      const unitPrice = (item.billed / qty).toFixed(2);
      const totalStr = item.billed.toFixed(2);

      const lineStr = `${dos}   ${rev.padEnd(10)} ${item.code.padEnd(12)} ${item.desc.padEnd(42)} x${qty}   $${unitPrice.padEnd(10)} $${totalStr}`;
      text += `BT /F1 8 Tf 40 ${y} Td (${lineStr}) Tj ET\n`;
    });

    y -= 25;
    text += `BT /F1 9 Tf 40 ${y} Td (----------------------------------------------------------------------------------------------------) Tj ET\n`;
    y -= 15;
    text += `BT /F1 9 Tf 40 ${y} Td (PAGE ${pageNum} ITEMIZED SUB-TOTAL: $4,250.00   |   AUDIT STATUS: PENDING CLINICAL REVIEW) Tj ET\n`;
    y -= 25;
    text += `BT /F1 8 Tf 40 ${y} Td (Legal Remittance Advice: This itemized bill serves as an official clinical charge register. Questions call (800) 555-0199.) Tj ET\n`;

    const streamLen = Buffer.byteLength(text, "latin1");
    const pageObj = `${pageObjId} 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <//F1 3 0 R>>>> /Contents ${contentObjId} 0 R>>\nendobj`;
    const contentObj = `${contentObjId} 0 obj\n<</Length ${streamLen}>>\nstream\n${text}\nendstream\nendobj`;

    objects.push(pageObj);
    objects.push(contentObj);
  }

  return "%PDF-1.4\n" + objects.join("\n") + "\n%%EOF\n";
}

const denseItems1 = [
  { code: "CPT-99285", desc: "Emergency Dept Visit Level 5 (High Severity)", billed: 1850.0 },
  { code: "CPT-70450", desc: "CT Head/Brain w/o Contrast Material", billed: 2400.0 },
  { code: "CPT-93000", desc: "Electrocardiogram (ECG/EKG) 12-Lead Complete", billed: 650.0 },
  { code: "LAB-80053", desc: "Comprehensive Metabolic Panel (CMP Panel)", billed: 480.0 },
  { code: "LAB-85025", desc: "Complete Blood Count (CBC) w/ Automated Diff", billed: 320.0 },
  { code: "ICU-0200", desc: "Inpatient ICU Telemetry Bed & Board (Day 1)", billed: 3800.0 },
  { code: "CPT-43239", desc: "Upper Gastrointestinal Endoscopy w/ Biopsy", billed: 4500.0 },
  { code: "CPT-00810", desc: "Anesthesia for Intestinal Endoscopy (2 hrs)", billed: 3800.0 },
  { code: "PHARM-J0135", desc: "IV Acetaminophen Infusion 1000mg x4", billed: 1200.0 },
  { code: "PHARM-J2405", desc: "Ondansetron HCl Anti-Emetic IV 4mg x6", billed: 850.0 },
  { code: "SURG-C1713", desc: "Surgical Intestinal Anchor Consumables", billed: 6200.0 },
  { code: "RAD-71046", desc: "Chest X-Ray 2 Views Frontal & Lateral", billed: 780.0 },
  { code: "PT-97110", desc: "Physical Therapy Therapeutic Exercise 45m", billed: 950.0 },
  { code: "CONSULT-99254", desc: "Gastroenterology Inpatient Specialty Consult", billed: 1400.0 },
  { code: "PHARM-J1100", desc: "Dexamethasone Sodium Phosphate IV 10mg", billed: 620.0 },
];

const bill1 = createDense10PageHospitalBill(
  "METROGENERAL TERTIARY HOSPITAL & TRAUMA CENTER",
  "Sarah Jenkins",
  "04/18/1978",
  "MRN-908124",
  "CLM-9082-SURG",
  "GRP-77192",
  "$42,500.00",
  denseItems1
);

const denseItems2 = [
  { code: "J9312", desc: "Rituximab Injection 10mg (50 Units Total)", billed: 48000.0 },
  { code: "CPT-96413", desc: "Chemotherapy Admin IV Infusion Initial Hour", billed: 12500.0 },
  { code: "CPT-96415", desc: "Chemotherapy Admin IV Infusion Each Addl Hr", billed: 9400.0 },
  { code: "J1453", desc: "Fosaprepitant Injection 150mg Pre-Medication", billed: 7200.0 },
  { code: "LAB-85025", desc: "CBC w/ Automated Differential Panel", billed: 1800.0 },
  { code: "LAB-80076", desc: "Hepatic Function Panel (Liver Enzymes)", billed: 1400.0 },
  { code: "PHARM-J1200", desc: "Diphenhydramine HCl IV 50mg Pre-Infusion", billed: 450.0 },
  { code: "PHARM-J1745", desc: "Infliximab Infusion 100mg Biologic Unit", billed: 3200.0 },
  { code: "CPT-99215", desc: "Oncology Outpatient Clinic Visit Level 5", billed: 1650.0 },
  { code: "RAD-78815", desc: "PET-CT Whole Body Oncology Imaging", billed: 8500.0 },
  { code: "LAB-82306", desc: "Vitamin D 25-Hydroxy Assay Panel", billed: 380.0 },
  { code: "PHARM-J0885", desc: "Epoetin Alfa Injection 10,000 Units", billed: 2900.0 },
  { code: "NUTR-97802", desc: "Medical Nutrition Therapy Assessment 30m", billed: 420.0 },
  { code: "PORT-36561", desc: "Central Venous Access Port Flushing", billed: 850.0 },
  { code: "DISCH-99238", desc: "Hospital Discharge Day Management 30m", billed: 950.0 },
];

const bill2 = createDense10PageHospitalBill(
  "ST. JUDE CANCER & BIOLOGIC INFUSION CENTER",
  "Robert Chen",
  "11/02/1965",
  "MRN-441209",
  "CLM-4412-ONC",
  "GRP-88201",
  "$88,900.00",
  denseItems2
);

const denseItems3 = [
  { code: "CPT-93458", desc: "Left Heart Catheterization w/ Coronary Angio", billed: 22000.0 },
  { code: "C1874", desc: "Drug-Eluting Coronary Stent Consumables x2", billed: 18400.0 },
  { code: "CPT-92928", desc: "Percutaneous Transluminal Coronary Angioplasty", billed: 14500.0 },
  { code: "ICU-0210", desc: "Post-Cardiac Cath Recovery Unit (24 Hrs)", billed: 6500.0 },
  { code: "PHARM-331", desc: "Heparin & Glycoprotein IIb/IIIa IV Infusion", billed: 4000.0 },
  { code: "CPT-93015", desc: "Cardiovascular Stress Test Treadmill", billed: 1850.0 },
  { code: "RAD-75561", desc: "Cardiac MRI w/ Morphological Assessment", billed: 4200.0 },
  { code: "LAB-84484", desc: "Troponin I Cardiac Marker Quantitative x4", billed: 980.0 },
  { code: "LAB-82172", desc: "Apolipoprotein B Diagnostic Assay", billed: 420.0 },
  { code: "PHARM-J0280", desc: "Aminophylline Injection 250mg IV", billed: 680.0 },
  { code: "CONSULT-99255", desc: "Interventional Cardiology Inpatient Consult", billed: 1950.0 },
  { code: "ECHO-93306", desc: "Transthoracic Echocardiogram 2D w/ Doppler", billed: 2800.0 },
  { code: "REHAB-93798", desc: "Cardiac Rehabilitation Phase I Inpatient", billed: 1100.0 },
  { code: "PHARM-J2930", desc: "Methylprednisolone Sodium Succinate 125mg", billed: 540.0 },
  { code: "DISCH-99239", desc: "Cardiology Discharge Management >30m", billed: 1150.0 },
];

const bill3 = createDense10PageHospitalBill(
  "JOHNS HOPKINS CARDIAC & VASCULAR INSTITUTE",
  "Elena Rostova",
  "08/29/1972",
  "MRN-772188",
  "CLM-7721-CARD",
  "GRP-33190",
  "$65,400.00",
  denseItems3
);

// Save to root public/ and public/sample_bills/
fs.writeFileSync(path.join(dir, "sample_medical_bill_surgical_10p.pdf"), bill1);
fs.writeFileSync(path.join(dir, "sample_medical_bill_oncology_10p.pdf"), bill2);
fs.writeFileSync(path.join(dir, "sample_medical_bill_cardiology_10p.pdf"), bill3);

fs.writeFileSync(path.join(outputSubDir, "sample_medical_bill_surgical_10p.pdf"), bill1);
fs.writeFileSync(path.join(outputSubDir, "sample_medical_bill_oncology_10p.pdf"), bill2);
fs.writeFileSync(path.join(outputSubDir, "sample_medical_bill_cardiology_10p.pdf"), bill3);

console.log("High-density 10-page itemized hospital bills generated locally on system!");
