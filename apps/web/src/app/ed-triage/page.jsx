"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  AlertTriangle,
  Activity,
  UserCheck,
  Clock,
  CheckCircle2,
  Plus,
  Sliders,
  Sparkles,
  Zap,
  Building,
  HeartPulse,
  Search,
  ShieldAlert
} from "lucide-react";

export default function EdTriagePage() {
  const [esiFilter, setEsiFilter] = useState("All");
  const [surgeCapacity, setSurgeCapacity] = useState(85);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: "ED-9041",
      name: "Arthur Pendelton",
      age: 68,
      gender: "Male",
      chiefComplaint: "Acute crushing retrosternal chest pain radiating to left jaw & diaphoresis",
      vitals: "BP 168/102, HR 118, SpO2 91%, RR 26, Temp 37.1°C",
      esiLevel: 1,
      esiCategory: "ESI 1 (Resuscitation)",
      waitMinutes: 0,
      predictedResources: ["Cath Lab Activation", "12-Lead ECG", "Troponin I", "IV Nitroglycerin", "ICU Bed"],
      deteriorationRisk: "High (STEMI Suspected)",
      color: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    },
    {
      id: "ED-9042",
      name: "Sophia Martinez",
      age: 34,
      gender: "Female",
      chiefComplaint: "Severe right lower quadrant abdominal pain with rebound tenderness & nausea",
      vitals: "BP 122/78, HR 96, SpO2 98%, RR 18, Temp 38.4°C",
      esiLevel: 2,
      esiCategory: "ESI 2 (Emergent)",
      waitMinutes: 8,
      predictedResources: ["Abdominal CT Scan", "CBC / CRP", "IV Analgesia", "Surgical Consult"],
      deteriorationRisk: "Moderate (Acute Appendicitis)",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    },
    {
      id: "ED-9043",
      name: "Marcus Vance",
      age: 52,
      gender: "Male",
      chiefComplaint: "Focal left-sided facial droop & arm weakness onset 45 mins ago",
      vitals: "BP 184/110, HR 88, SpO2 96%, RR 20, Temp 36.8°C",
      esiLevel: 1,
      esiCategory: "ESI 1 (Resuscitation)",
      waitMinutes: 0,
      predictedResources: ["Non-contrast Head CT", "Code Stroke Activation", "tPA Evaluation", "Neuro ICU Bed"],
      deteriorationRisk: "High (Acute Ischemic Stroke Window)",
      color: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    },
    {
      id: "ED-9044",
      name: "Emily Watson",
      age: 24,
      gender: "Female",
      chiefComplaint: "Right wrist deformity & acute pain following fall during bicycle collision",
      vitals: "BP 118/74, HR 76, SpO2 99%, RR 14, Temp 36.6°C",
      esiLevel: 4,
      esiCategory: "ESI 4 (Less Urgent)",
      waitMinutes: 24,
      predictedResources: ["Wrist X-Ray (2 views)", "Splinting", "Oral Analgesia"],
      deteriorationRisk: "Low (Isolated Extremity Trauma)",
      color: "bg-blue-500/20 text-blue-300 border-blue-500/40"
    },
    {
      id: "ED-9045",
      name: "David Chen",
      age: 45,
      gender: "Male",
      chiefComplaint: "Productive cough, low-grade fever, mild dyspnea on exertion for 3 days",
      vitals: "BP 128/82, HR 84, SpO2 95%, RR 20, Temp 37.9°C",
      esiLevel: 3,
      esiCategory: "ESI 3 (Urgent)",
      waitMinutes: 15,
      predictedResources: ["Chest X-Ray", "Viral PCR Panel", "Sputum Culture"],
      deteriorationRisk: "Low-Moderate (Community Acquired Pneumonia)",
      color: "bg-teal-500/20 text-teal-300 border-teal-500/40"
    }
  ];

  const filteredPatients = esiFilter === "All"
    ? patients
    : patients.filter((p) => p.esiLevel.toString() === esiFilter);

  return (
    <AppLayout activeTab="/ed-triage">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Emergency Care AI
              </span>
              <span className="text-xs text-slate-400">Emergency Severity Index (ESI v4)</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-rose-400" />
              Emergency Department AI Triage & Resource Predictor
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Automated ESI 1–5 triage classifier utilizing chief complaint NLP, vital signs, and predicted ED bed & diagnostic resource utilization.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("New emergency walk-in patient admitted into triage Queue")}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Triage New Walk-in Patient
            </button>
          </div>
        </div>

        {/* Real-time ED Surge & Resource Meters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">ED Capacity Load</span>
              <span className="text-lg font-bold text-amber-400 mt-0.5 block">{surgeCapacity}% Full</span>
              <span className="text-[10px] text-slate-500">34 / 40 Beds Occupied</span>
            </div>
            <Building className="h-6 w-6 text-amber-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Immediate ESI 1-2 Cases</span>
              <span className="text-lg font-bold text-rose-400 mt-0.5 block">3 Patients</span>
              <span className="text-[10px] text-rose-400">Zero Wait Time Mandate</span>
            </div>
            <HeartPulse className="h-6 w-6 text-rose-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Avg Door-to-Doctor</span>
              <span className="text-lg font-bold text-blue-400 mt-0.5 block">14.2 Mins</span>
              <span className="text-[10px] text-emerald-400">32% Faster than Target</span>
            </div>
            <Clock className="h-6 w-6 text-blue-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Predicted CT / MRI Queue</span>
              <span className="text-lg font-bold text-emerald-400 mt-0.5 block">4 Scans Pending</span>
              <span className="text-[10px] text-slate-500">Auto-prioritized by AI</span>
            </div>
            <Activity className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        {/* Main List & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Queue List */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-rose-400" />
                Live ED Arrival Triage Queue
              </h3>
              {/* ESI Filter Buttons */}
              <div className="flex gap-1.5 font-mono text-xs">
                {["All", "1", "2", "3", "4"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setEsiFilter(lvl)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      esiFilter === lvl
                        ? "bg-rose-600 text-white font-bold"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lvl === "All" ? "All" : `ESI ${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedPatient?.id === patient.id
                      ? "bg-slate-800 border-rose-500/60 shadow-lg"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{patient.name}</span>
                      <span className="text-xs text-slate-400">({patient.age}y {patient.gender})</span>
                      <span className="text-xs font-mono text-slate-500">[{patient.id}]</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${patient.color}`}>
                      {patient.esiCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                    <span className="text-slate-500">Chief Complaint:</span> {patient.chiefComplaint}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="text-emerald-400">{patient.vitals}</span>
                    <span>Wait: {patient.waitMinutes} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Detail Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              AI Triage Breakdown & Recommendation
            </h3>

            {selectedPatient ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Selected Patient</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{selectedPatient.name}</span>
                  <span className="text-xs font-mono text-rose-400">{selectedPatient.esiCategory}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Natural Language Chief Complaint</span>
                  <p className="text-slate-200 leading-relaxed">{selectedPatient.chiefComplaint}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">Vital Signs Stream</span>
                  <p className="font-mono text-emerald-400">{selectedPatient.vitals}</p>
                </div>

                <div>
                  <span className="text-slate-300 font-semibold block mb-2">Predicted Required Resources</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.predictedResources.map((res, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px]">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300 block">Deterioration Risk Alert</span>
                    <p className="text-rose-200/90 text-[11px]">{selectedPatient.deteriorationRisk}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Assigned ED Bay 04 to ${selectedPatient.name}`)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Assign Immediate Treatment Bay
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Search className="h-8 w-8 mx-auto opacity-50" />
                <p className="text-xs">Click any patient in the arrival queue to inspect AI triage predictions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
