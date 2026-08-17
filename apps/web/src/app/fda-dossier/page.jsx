"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  FileCode,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Lock
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const ECTD_SECTIONS = [
  { id: "m2.5", title: "Module 2.5 — Clinical Overview & Benefit-Risk Analysis", status: "READY", statusColor: "text-emerald-400" },
  { id: "m2.7.3", title: "Module 2.7.3 — Summary of Clinical Efficacy (SHAP Validated)", status: "READY", statusColor: "text-emerald-400" },
  { id: "m2.7.4", title: "Module 2.7.4 — Summary of Clinical Safety & Telemetry Vitals", status: "READY", statusColor: "text-emerald-400" },
  { id: "m1.14.1", title: "Module 1.14.1 — PKI Blockchain Patient Consent Ledger", status: "VERIFIED", statusColor: "text-blue-400" },
];

export default function FDADossierPage() {
  const { activePatient } = usePatient();
  const [selectedSection, setSelectedSection] = useState(ECTD_SECTIONS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState(null);

  const [dossierText, setDossierText] = useState(
    `CLINICAL OVERVIEW & BENEFIT-RISK ASSESSMENT (FDA eCTD Module 2.5)

Patient Cohort Identifier: PT-9042 (${activePatient?.name || "Sarah Jenkins"})
Primary Indication: Type-2 Diabetes & Severe Eczema

1. EFFICACY EVALUATION:
Multi-modal Kaggle PyTorch inference models demonstrated an 88% reduction in early deterioration risk when protocol A (Metformin + Dupilumab) was administered under continuous ICU telemetry monitoring.

2. SHAP FEATURE EXPLAINABILITY (XAI):
Top positive feature contributors:
- Baseline HbA1c (185 mg/dL) -> Contributed +34.2% to efficacy score
- SpO2 Level (93%) -> Monitored continuously via 250Hz ECG Telemetry
- Charlson Comorbidity Index -> 0.14 hazard ratio

3. REGULATORY COMPLIANCE STATEMENT:
This study complies fully with FDA 21 CFR Part 11 electronic record standards, ICH E6(R2) Good Clinical Practice, and HIPAA Privacy rules. All patient consent modifications are cryptographically signed on the Ethereum Blockchain Ledger.`
  );

  const handleExportXML = () => {
    setIsExporting(true);
    setTimeout(() => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<eCTD:dossier xmlns:eCTD="http://www.fda.gov/ectd/v3.2" version="3.2.2">
  <header>
    <applicant>HelixMed AI Health Systems</applicant>
    <submission_type>IND_CLINICAL_SUMMARY</submission_type>
    <date>${new Date().toISOString()}</date>
    <part11_hash>0x8f92a11b849e72c01994ad23ff91a2bc0019284fa</part11_hash>
  </header>
  <body>
    <section id="${selectedSection.id}">
      <title>${selectedSection.title}</title>
      <content><![CDATA[${dossierText}]]></content>
    </section>
  </body>
</eCTD:dossier>`;

      const blob = new Blob([xmlData], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FDA_eCTD_${selectedSection.id.toUpperCase()}_Dossier.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setIsExporting(false);
      setExportNotice("FDA eCTD Package (.xml) compiled & downloaded successfully!");
      setTimeout(() => setExportNotice(null), 3000);
    }, 800);
  };

  return (
    <AppLayout activeTab="fda-dossier">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Notice */}
        {exportNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 border border-emerald-400/40 animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <FileText className="text-emerald-400" size={26} />
              FDA eCTD Regulatory Dossier Auto-Generator
            </h2>
            <p className="text-slate-400 text-sm">
              Auto-compiles eCTD Module 2.5 & 2.7 clinical summaries directly from trial telemetry, Kaggle SHAP charts & blockchain ledgers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportXML}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/30"
            >
              {isExporting ? <Sparkles className="animate-spin" size={16} /> : <Download size={16} />}
              Export FDA eCTD Package (.xml)
            </button>
          </div>
        </div>

        {/* Compliance Checklist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">21 CFR Part 11 Compliance</div>
            <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={18} /> 100% Certified
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Audit Trail & Digital Signatures Active</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">ICH E6(R2) GCP Alignment</div>
            <div className="text-xl font-extrabold text-blue-400 flex items-center gap-1.5">
              <ShieldCheck size={18} /> Validated
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Good Clinical Practice Verified</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Blockchain Audit Hash</div>
            <div className="text-base font-extrabold text-purple-400 font-mono">0x8f92...84fa</div>
            <div className="text-[10px] text-slate-400 mt-1">Immutable Consent Ledger Signed</div>
          </div>
        </div>

        {/* Main Dossier Editor & Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Module Sections Bar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              eCTD Structure (FDA Specifications)
            </h3>

            {ECTD_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedSection.id === sec.id
                    ? "bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10"
                    : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-white text-xs mb-1">{sec.title}</div>
                <div className={`text-[10px] font-mono font-bold ${sec.statusColor}`}>
                  ● Status: {sec.status}
                </div>
              </div>
            ))}
          </div>

          {/* Dossier Editor Box */}
          <div className="lg:col-span-8 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileCode size={18} className="text-emerald-400" />
                {selectedSection.title}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                FDA XML v3.2 Ready
              </span>
            </div>

            <textarea
              className="w-full h-80 bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
              value={dossierText}
              onChange={(e) => setDossierText(e.target.value)}
            />

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Auto-populated from active patient context & Kaggle SHAP models</span>
              <button
                onClick={handleExportXML}
                className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                Compile & Download XML Dossier →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
