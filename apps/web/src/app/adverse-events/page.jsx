"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Activity,
  Plus,
  Send,
  Sparkles,
  Search,
  Filter,
  Check,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const NARANJO_QUESTIONS = [
  { id: 1, text: "1. Are there previous conclusive reports on this reaction?", yes: 1, no: 0, unknown: 0 },
  { id: 2, text: "2. Did the adverse event appear after the suspect drug was administered?", yes: 2, no: -1, unknown: 0 },
  { id: 3, text: "3. Did the adverse reaction improve when drug was discontinued (dechallenge)?", yes: 1, no: 0, unknown: 0 },
  { id: 4, text: "4. Did the reaction reappear when the drug was re-administered (rechallenge)?", yes: 2, no: -2, unknown: 0 },
  { id: 5, text: "5. Are there alternative causes that could on their own have caused the reaction?", yes: -1, no: 2, unknown: 0 },
  { id: 6, text: "6. Did the reaction reappear when a placebo was given?", yes: -1, no: 1, unknown: 0 },
  { id: 7, text: "7. Was the drug detected in blood (or other fluids) in toxic concentrations?", yes: 1, no: 0, unknown: 0 },
  { id: 8, text: "8. Was the reaction more severe when the dose was increased?", yes: 1, no: 0, unknown: 0 },
  { id: 9, text: "9. Did the patient have a similar reaction to the same or similar drugs?", yes: 1, no: 0, unknown: 0 },
  { id: 10, text: "10. Was the adverse event confirmed by any objective evidence?", yes: 1, no: 0, unknown: 0 },
];

const INITIAL_EVENTS = [
  {
    id: "AE-9081",
    patientName: "Sarah Jenkins",
    mrn: "MRN-908124",
    medDraTerm: "Tachycardia (PT: 10042563)",
    severity: "SERIOUS",
    onset: "2 hours post-dose",
    naranjoScore: 8,
    causality: "Probable (Score: 8)",
    status: "REPORTED_FDA",
    reportedDate: "2026-08-17",
  },
  {
    id: "AE-4412",
    patientName: "Robert Chen",
    mrn: "MRN-441209",
    medDraTerm: "Gastrointestinal Distress (PT: 10017953)",
    severity: "MILD",
    onset: "Day 3 post-dose",
    naranjoScore: 4,
    causality: "Possible (Score: 4)",
    status: "UNDER_REVIEW",
    reportedDate: "2026-08-16",
  },
];

export default function AdverseEventsPage() {
  const { activePatient } = usePatient();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [medDraInput, setMedDraInput] = useState("Dizziness (PT: 10013573)");
  const [severity, setSeverity] = useState("SERIOUS");
  const [naranjoAnswers, setNaranjoAnswers] = useState({});
  const [onnotice, setOnnotice] = useState(null);

  // Compute Naranjo Algorithm Score
  const computeNaranjoScore = () => {
    let score = 0;
    NARANJO_QUESTIONS.forEach((q) => {
      const val = naranjoAnswers[q.id];
      if (val === "yes") score += q.yes;
      if (val === "no") score += q.no;
      if (val === "unknown") score += q.unknown;
    });
    return score;
  };

  const currentScore = computeNaranjoScore();

  const getCausalityCategory = (s) => {
    if (s >= 9) return "Definite (Naranjo Score >= 9)";
    if (s >= 5) return `Probable (Naranjo Score: ${s})`;
    if (s >= 1) return `Possible (Naranjo Score: ${s})`;
    return `Unlikely (Naranjo Score: ${s})`;
  };

  const handleNaranjoChoice = (qId, choice) => {
    setNaranjoAnswers((prev) => ({ ...prev, [qId]: choice }));
  };

  const handleAddEvent = () => {
    const causalityStr = getCausalityCategory(currentScore);
    const newEvt = {
      id: `AE-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: activePatient?.name || "Sarah Jenkins",
      mrn: activePatient?.mrn || "MRN-908124",
      medDraTerm: medDraInput,
      severity,
      onset: "1 hour post-dose",
      naranjoScore: currentScore,
      causality: causalityStr,
      status: "REPORTED_FDA",
      reportedDate: new Date().toISOString().split("T")[0],
    };
    setEvents([newEvt, ...events]);
    setOnnotice("Adverse Event & MedWatch Form 3500A submitted successfully with Naranjo score!");
    setTimeout(() => setOnnotice(null), 3000);
  };

  return (
    <AppLayout activeTab="adverse-events">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast */}
        {onnotice && (
          <div className="bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 border border-red-400/40 animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{onnotice}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <ShieldAlert className="text-red-400" size={26} />
              Pharmacovigilance & MedDRA Adverse Event Causality Assessor
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time AE/SAE logging with interactive Naranjo algorithm causality scoring & FDA MedWatch 3500A reporting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 text-red-300 px-3.5 py-2 rounded-xl border border-red-500/30 text-xs font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-red-400" />
              Naranjo 10-Question Score: {currentScore}
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Interactive Naranjo Algorithm Questionnaire */}
          <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HelpCircle className="text-red-400" size={18} />
                Naranjo Causality Scale (10 Clinical Questions)
              </span>
              <span className="text-xs font-mono text-red-400 font-bold">Total: {currentScore} pts</span>
            </h3>

            <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
              {NARANJO_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="text-slate-200 font-semibold">{q.text}</div>
                  <div className="flex gap-2">
                    {["yes", "no", "unknown"].map((choice) => (
                      <button
                        key={choice}
                        onClick={() => handleNaranjoChoice(q.id, choice)}
                        className={`flex-1 py-1.5 rounded-lg border font-bold capitalize transition-colors ${
                          naranjoAnswers[q.id] === choice
                            ? "bg-red-600 text-white border-red-400 shadow"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Score Summary Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Calculated Causality Level:</span>
                <span className="text-red-400 font-extrabold font-mono text-sm">{getCausalityCategory(currentScore)}</span>
              </div>
            </div>
          </div>

          {/* Form & Log Table */}
          <div className="lg:col-span-6 space-y-6">
            {/* Event Form */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-3 border-b border-slate-800">
                <Plus size={16} className="text-red-400" />
                Submit MedWatch 3500A Report
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">MedDRA Term Coding:</label>
                  <input
                    type="text"
                    value={medDraInput}
                    onChange={(e) => setMedDraInput(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Event Severity:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-500 outline-none font-bold"
                  >
                    <option value="SERIOUS">SERIOUS (SAE - Hospitalization / Life Threatening)</option>
                    <option value="MODERATE">MODERATE (Requires Dose Adjustment)</option>
                    <option value="MILD">MILD (Self-limiting)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-500/20 text-xs flex items-center justify-center gap-2"
              >
                <Send size={16} /> Submit MedWatch 3500A to FDA Safety Database
              </button>
            </div>

            {/* AE Log Table */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Pharmacovigilance Logs ({events.length})
              </h4>

              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[9px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">ID</th>
                      <th className="px-3 py-2">MedDRA Term</th>
                      <th className="px-3 py-2">Causality</th>
                      <th className="px-3 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-red-400 font-bold">{evt.id}</td>
                        <td className="px-3 py-2 font-sans text-white text-[11px]">{evt.medDraTerm}</td>
                        <td className="px-3 py-2 text-purple-400 text-[11px]">{evt.causality}</td>
                        <td className="px-3 py-2 text-right font-sans">
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            {evt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
