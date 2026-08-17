"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { ConsensusEngine } from "@/utils/consensusEngine";
import {
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Clock,
  Send,
  Sliders,
  Check,
  X,
  FileText,
  Users,
  ShieldAlert,
  RefreshCw
} from "lucide-react";

const CLINICAL_CASES = [
  {
    id: "CASE-9081",
    patientName: "Sarah Jenkins",
    age: 58,
    mrn: "MRN-908124",
    condition: "Type-2 Diabetes & Severe Eczema",
    riskIndex: "88%",
    triggerSource: "ICU Telemetry (SpO2 89% Drop / Tachycardia 134 BPM)",
    aiSummary: "Patient presents with vital drift & elevated Glucose (185 mg/dL). Isolation Forest anomaly detected. Anti-inflammatory salmon diet prescribed via ADK Recipe Studio.",
    status: "PENDING_REVIEW",
  },
  {
    id: "CASE-4412",
    patientName: "Robert Chen",
    age: 64,
    mrn: "MRN-441209",
    condition: "Refractory B-Cell Lymphoma",
    riskIndex: "79%",
    triggerSource: "ADK Financial Advocate (10-Page Chemotherapy Bill Audit)",
    aiSummary: "Audited 10-page biologic bill. Identified $34,700 in overcharges. Pre-qualified for CareCredit 0% APR financing.",
    status: "PENDING_REVIEW",
  },
  {
    id: "CASE-7721",
    patientName: "Elena Rostova",
    age: 52,
    mrn: "MRN-772188",
    condition: "Cardiovascular Ischemia",
    riskIndex: "74%",
    triggerSource: "CareMaze Navigator (Acute Chest Pressure Triage)",
    aiSummary: "Left heart catheterization completed. Post-op telemetry stable. Digital Twin trajectory indicates 39% recovery improvement under Protocol A.",
    status: "APPROVED",
  },
];

export default function DoctorWorkspacePage() {
  const [cases, setCases] = useState(CLINICAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState("CASE-9081");
  const [physicianNote, setPhysicianNote] = useState("");
  const [actionSuccessToast, setActionSuccessToast] = useState(null);
  
  const [secondOpinion, setSecondOpinion] = useState(null);
  const [loadingOpinion, setLoadingOpinion] = useState(false);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const fetchSecondOpinion = async (patientCase) => {
    setLoadingOpinion(true);
    setSecondOpinion(null);
    const engine = new ConsensusEngine();
    
    // Simulate brief network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const result = await engine.getSecondOpinion(patientCase);
    setSecondOpinion(result);
    setLoadingOpinion(false);
  };

  useEffect(() => {
    fetchSecondOpinion(activeCase);
  }, [selectedCaseId]);

  const handleApproveCase = () => {
    setCases((prev) =>
      prev.map((c) => (c.id === activeCase.id ? { ...c, status: "APPROVED" } : c))
    );
    setActionSuccessToast(`Treatment plan approved & signed off by Dr. Rachel Vance for ${activeCase.patientName}.`);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  const handleEscalateCase = () => {
    setCases((prev) =>
      prev.map((c) => (c.id === activeCase.id ? { ...c, status: "ESCALATED" } : c))
    );
    setActionSuccessToast(`Case ${activeCase.id} escalated to Multi-Disciplinary Specialty Board.`);
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  return (
    <AppLayout activeTab="doctor-workspace">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Stethoscope className="text-blue-400" size={24} />
              Doctor Workspace & Multi-Agent Consensus Opinion Board
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Physician portal for reviewing patient case trajectories, verifying clinical warnings, and invoking AI second opinions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-blue-400">
            <UserCheck size={16} /> Dr. Rachel Vance (Attending Physician) Active
          </div>
        </div>

        {/* Action Success Toast */}
        {actionSuccessToast && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="font-bold">{actionSuccessToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Case Review Queue Column */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Clinical Case Review Queue
              <span className="text-[10px] text-blue-400 font-mono">HITL Queue</span>
            </h3>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    selectedCaseId === c.id
                      ? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10"
                      : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{c.patientName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        c.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : c.status === "ESCALATED"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    MRN: <strong className="text-slate-200">{c.mrn}</strong> | Age: {c.age}
                  </div>
                  <div className="text-xs text-red-400 font-mono font-bold">
                    Risk Score: {c.riskIndex}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Case Review Detail */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeCase.patientName} — Case Review</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Condition: <strong className="text-blue-400">{activeCase.condition}</strong></p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEscalateCase}
                    className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1"
                  >
                    <X size={14} /> Escalate
                  </button>
                  <button
                    onClick={handleApproveCase}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <Check size={16} /> Sign-Off & Approve Plan
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Alert Trigger Source</span>
                  <div className="text-slate-200 font-semibold">{activeCase.triggerSource}</div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">AI-Generated Clinical Summary</span>
                  <p className="text-slate-200 text-xs leading-relaxed">{activeCase.aiSummary}</p>
                </div>

                {/* AI Second Opinion Consensus Panel */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <Users className="h-4 w-4 text-cyan-400" />
                      AI Consensus Second Opinion Panel
                    </span>
                    {secondOpinion && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {secondOpinion.consensusScore}
                      </span>
                    )}
                  </div>

                  {loadingOpinion ? (
                    <div className="flex items-center gap-2 text-slate-400 font-mono py-4 text-xs">
                      <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                      Consulting clinical specialist agents...
                    </div>
                  ) : secondOpinion ? (
                    <div className="space-y-3">
                      <p className="text-slate-300 leading-relaxed italic text-[11px]">
                        "{secondOpinion.consensusSummary}"
                      </p>
                      
                      <div className="space-y-2">
                        {secondOpinion.agentVotes.map((vote, idx) => (
                          <div key={idx} className="p-3 bg-slate-900/40 rounded border border-slate-900 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200">{vote.name}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                vote.opinion === "Supportive" 
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : vote.opinion === "Dissenting"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {vote.opinion}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px] leading-relaxed">{vote.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Attending Physician Notes Form */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 uppercase">Attending Physician Clinical Notes</label>
                  <textarea
                    rows={3}
                    value={physicianNote}
                    onChange={(e) => setPhysicianNote(e.target.value)}
                    placeholder="Enter physician observations, order adjustments, or follow-up instructions..."
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
