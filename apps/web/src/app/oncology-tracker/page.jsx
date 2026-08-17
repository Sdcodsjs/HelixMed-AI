"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Activity,
  BarChart3,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Zap,
  Layers,
  Search,
  Scan
} from "lucide-react";

export default function OncologyTrackerPage() {
  const [selectedCohort, setSelectedCohort] = useState("Keynote-189 (Pembrolizumab + Chemo)");
  const [selectedPatient, setSelectedPatient] = useState("PAT-ONC-1088");

  const patients = {
    "PAT-ONC-1088": {
      name: "Eleanor Vance",
      age: 61,
      diagnosis: "Stage IV Non-Small Cell Lung Cancer (NSCLC)",
      targetLesions: [
        { site: "Right Upper Lobe Mass", baseline: 42, week6: 28, week12: 21, week24: 14, unit: "mm" },
        { site: "Mediastinal Subcarinal Lymph Node", baseline: 24, week6: 18, week12: 15, week24: 11, unit: "mm" },
        { site: "Left Segment 6 Hepatic Met", baseline: 18, week6: 12, week12: 8, week24: 0, unit: "mm" }
      ],
      sld: { baseline: 84, week6: 58, week12: 44, week24: 25 },
      percentChange: "-70.2%",
      recistCategory: "Partial Response (PR)",
      pfsMonths: "18.4 months",
      statusColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    },
    "PAT-ONC-1092": {
      name: "Gregory House",
      age: 54,
      diagnosis: "Metastatic Renal Cell Carcinoma (mRCC)",
      targetLesions: [
        { site: "Left Renal Mass", baseline: 65, week6: 62, week12: 60, week24: 59, unit: "mm" },
        { site: "Retroperitoneal Node", baseline: 30, week6: 28, week12: 29, week24: 28, unit: "mm" }
      ],
      sld: { baseline: 95, week6: 90, week12: 89, week24: 87 },
      percentChange: "-8.4%",
      recistCategory: "Stable Disease (SD)",
      pfsMonths: "12.1 months",
      statusColor: "bg-blue-500/20 text-blue-300 border-blue-500/40"
    },
    "PAT-ONC-1104": {
      name: "Clara Oswald",
      age: 48,
      diagnosis: "Metastatic Cutaneous Melanoma",
      targetLesions: [
        { site: "Right Thigh Cutaneous Lesion", baseline: 35, week6: 48, week12: 62, week24: 78, unit: "mm" },
        { site: "Right Inguinal Lymph Node", baseline: 22, week6: 31, week12: 44, week24: 55, unit: "mm" }
      ],
      sld: { baseline: 57, week6: 79, week12: 106, week24: 133 },
      percentChange: "+133.3%",
      recistCategory: "Progressive Disease (PD)",
      pfsMonths: "3.2 months",
      statusColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    }
  };

  const current = patients[selectedPatient];

  return (
    <AppLayout activeTab="/oncology-tracker">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Precision Oncology AI
              </span>
              <span className="text-xs text-slate-400">RECIST 1.1 Global Criteria</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <Scan className="h-7 w-7 text-indigo-400" />
              Oncology RECIST 1.1 Tumor Response & Longitudinal Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Longitudinal tracking of target tumor lesion diameters across CT/MRI baseline vs follow-up scans with RECIST 1.1 classification and Kaplan-Meier PFS curves.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert(`Generated RECIST 1.1 Audit Dossier for ${current.name}`)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export RECIST 1.1 Dossier
            </button>
          </div>
        </div>

        {/* Patient Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(patients).map((pKey) => (
            <button
              key={pKey}
              onClick={() => setSelectedPatient(pKey)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedPatient === pKey
                  ? "bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-950/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-base">{patients[pKey].name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${patients[pKey].statusColor}`}>
                  {patients[pKey].recistCategory}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{patients[pKey].diagnosis}</p>
              <div className="flex items-center justify-between mt-3 text-xs font-mono">
                <span className="text-slate-500">SLD Change:</span>
                <span className={patients[pKey].percentChange.startsWith("-") ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {patients[pKey].percentChange}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Target Lesions & SLD Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Lesions Table */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  Target Lesion Diameter Trajectory (RECIST 1.1)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Sum of Longest Diameters (SLD) tracked across 24 weeks.</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">Baseline SLD: {current.sld.baseline} mm</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Lesion Location</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Week 6</th>
                    <th className="py-2.5 px-3">Week 12</th>
                    <th className="py-2.5 px-3">Week 24</th>
                    <th className="py-2.5 px-3">Net Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {current.targetLesions.map((lesion, idx) => {
                    const delta = lesion.week24 - lesion.baseline;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 text-slate-300">
                        <td className="py-3 px-3 font-semibold text-white">{lesion.site}</td>
                        <td className="py-3 px-3 text-slate-400">{lesion.baseline} mm</td>
                        <td className="py-3 px-3">{lesion.week6} mm</td>
                        <td className="py-3 px-3">{lesion.week12} mm</td>
                        <td className="py-3 px-3 font-bold text-indigo-400">{lesion.week24} mm</td>
                        <td className="py-3 px-3">
                          <span className={`font-bold ${delta <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {delta > 0 ? `+${delta}` : delta} mm
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total SLD Row */}
                  <tr className="bg-slate-950/80 font-bold text-white border-t-2 border-slate-800">
                    <td className="py-3 px-3">TOTAL SLD (Sum)</td>
                    <td className="py-3 px-3 text-slate-300">{current.sld.baseline} mm</td>
                    <td className="py-3 px-3 text-slate-300">{current.sld.week6} mm</td>
                    <td className="py-3 px-3 text-slate-300">{current.sld.week12} mm</td>
                    <td className="py-3 px-3 text-indigo-300">{current.sld.week24} mm</td>
                    <td className="py-3 px-3 text-indigo-400">{current.percentChange}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RECIST Criteria Rule Legend */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-emerald-400 block">Complete Response (CR)</span>
                <span className="text-slate-400">Disappearance of all target lesions.</span>
              </div>
              <div>
                <span className="font-bold text-blue-400 block">Partial Response (PR)</span>
                <span className="text-slate-400">≥ 30% decrease in total SLD.</span>
              </div>
              <div>
                <span className="font-bold text-amber-400 block">Stable Disease (SD)</span>
                <span className="text-slate-400">Neither PR nor PD criteria met.</span>
              </div>
              <div>
                <span className="font-bold text-rose-400 block">Progressive Disease (PD)</span>
                <span className="text-slate-400">≥ 20% increase in total SLD.</span>
              </div>
            </div>
          </div>

          {/* Outcome Summary & Kaplan-Meier */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Trial Endpoint Evaluation
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block">RECIST 1.1 Classification</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-bold border mt-1 ${current.statusColor}`}>
                  {current.recistCategory}
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Median PFS (Progression-Free)</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{current.pfsMonths}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Overall Response Rate (ORR)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">62.8%</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg">
                <span className="font-bold text-indigo-300 block mb-1">AI Recommendation</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Continue current systemic therapy regimen. Re-assess target lesions via CT chest/abdomen/pelvis at Week 36.
                </p>
              </div>

              <button
                onClick={() => alert(`Next follow-up CT scan scheduled for ${current.name}`)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                Schedule Week 36 Follow-Up CT Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
