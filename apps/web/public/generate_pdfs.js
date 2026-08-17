const fs = require('fs');
const path = require('path');

const dir = __dirname;

function create10PageMedicalBillPDF(provider, patientName, claimId, totalBilled, lineItems) {
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
    text += `BT /F1 16 Tf 50 740 Td (${provider}) Tj ET\n`;
    text += `BT /F1 12 Tf 50 715 Td (OFFICIAL INPATIENT MEDICAL BILL STATEMENT - PAGE ${pageNum} OF 10) Tj ET\n`;
    text += `BT /F1 10 Tf 50 690 Td (Patient: ${patientName}  |  Claim ID: ${claimId}  |  Statement Date: Oct 24, 2025) Tj ET\n`;
    text += `BT /F1 10 Tf 50 675 Td (Account No: ACC-908124  |  Group: GRP-77192  |  Billed Total: ${totalBilled}) Tj ET\n`;
    text += `BT /F1 10 Tf 50 650 Td (---------------------------------------------------------------------------------------------------) Tj ET\n`;

    let y = 620;
    text += `BT /F1 10 Tf 50 ${y} Td (DOS        CPT / CODE    SERVICE DESCRIPTION                        QTY    TOTAL CHARGE) Tj ET\n`;
    y -= 15;
    text += `BT /F1 10 Tf 50 ${y} Td (---------------------------------------------------------------------------------------------------) Tj ET\n`;

    lineItems.forEach((item) => {
      y -= 25;
      const lineStr = `10/12/25   ${item.code.padEnd(12)}  ${item.desc.padEnd(40)}  x1     $${item.billed.toFixed(2)}`;
      text += `BT /F1 9 Tf 50 ${y} Td (${lineStr}) Tj ET\n`;
    });

    y -= 40;
    text += `BT /F1 10 Tf 50 ${y} Td (---------------------------------------------------------------------------------------------------) Tj ET\n`;
    y -= 20;
    text += `BT /F1 10 Tf 50 ${y} Td (PAGE ${pageNum} SUMMARY: SUB-TOTAL ${totalBilled}  |  PRE-AUTHORIZATION SEAL: VERIFIED) Tj ET\n`;
    y -= 30;
    text += `BT /F1 9 Tf 50 ${y} Td (Remittance Notice: Please remit payment to ${provider} Billing Dept, PO Box 9012.) Tj ET\n`;

    const streamLen = Buffer.byteLength(text, "latin1");
    const pageObj = `${pageObjId} 0 obj\n<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources <</Font <//F1 3 0 R>>>> /Contents ${contentObjId} 0 R>>\nendobj`;
    const contentObj = `${contentObjId} 0 obj\n<</Length ${streamLen}>>\nstream\n${text}\nendstream\nendobj`;

    objects.push(pageObj);
    objects.push(contentObj);
  }

  return "%PDF-1.4\n" + objects.join("\n") + "\n%%EOF\n";
}

const bill1 = create10PageMedicalBillPDF(
  "METROGENERAL TERTIARY HOSPITAL & TRAUMA CENTER",
  "Sarah Jenkins",
  "CLM-9082-SURG",
  "$42,500.00",
  [
    { code: "CPT-43239", desc: "Upper GI Endoscopy w/ Biopsy", billed: 4500.0 },
    { code: "CPT-00810", desc: "Anesthesia for Lower Intestinal", billed: 3800.0 },
    { code: "LAB-80053", desc: "Comprehensive Metabolic Panel (x12)", billed: 6400.0 },
    { code: "ICU-0200", desc: "Continuous ICU Telemetry (7 Days)", billed: 18500.0 },
    { code: "PHARM-991", desc: "IV Anti-Emetic & Analgesic Admin", billed: 9300.0 },
  ]
);

const bill2 = create10PageMedicalBillPDF(
  "ST. JUDE CANCER & BIOLOGIC INFUSION CENTER",
  "Robert Chen",
  "CLM-4412-ONC",
  "$88,900.00",
  [
    { code: "J9312", desc: "Rituximab Injection (10mg x 50 Units)", billed: 48000.0 },
    { code: "CPT-96413", desc: "Chemotherapy Admin IV (Initial Hr)", billed: 12500.0 },
    { code: "CPT-96415", desc: "Chemotherapy Admin IV (Addl Hr)", billed: 9400.0 },
    { code: "J1453", desc: "Fosaprepitant Injection 150mg", billed: 7200.0 },
    { code: "LAB-85025", desc: "Complete Blood Count w/ Diff", billed: 11800.0 },
  ]
);

const bill3 = create10PageMedicalBillPDF(
  "JOHNS HOPKINS CARDIAC & VASCULAR INSTITUTE",
  "Elena Rostova",
  "CLM-7721-CARD",
  "$65,400.00",
  [
    { code: "CPT-93458", desc: "Left Heart Cath w/ Angiogram", billed: 22000.0 },
    { code: "C1874", desc: "Drug-Eluting Coronary Stent (x2)", billed: 18400.0 },
    { code: "CPT-92928", desc: "Percutaneous Coronary Angioplasty", billed: 14500.0 },
    { code: "ICU-0210", desc: "Post-Cardiac Cath Recovery (24 Hrs)", billed: 6500.0 },
    { code: "PHARM-331", desc: "Heparin & Glycoprotein IIb/IIIa IV", billed: 4000.0 },
  ]
);

fs.writeFileSync(path.join(dir, "sample_medical_bill_surgical_10p.pdf"), bill1);
fs.writeFileSync(path.join(dir, "sample_medical_bill_oncology_10p.pdf"), bill2);
fs.writeFileSync(path.join(dir, "sample_medical_bill_cardiology_10p.pdf"), bill3);

console.log("Successfully generated 3 proper 10-page medical bill PDF documents!");
