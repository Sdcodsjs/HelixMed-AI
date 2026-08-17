"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Compass,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  Activity,
  Heart,
  Navigation,
  PhoneCall,
} from "lucide-react";

const CLINICAL_PATHWAYS = [
  {
    id: "eczema",
    symptom: "Severe Eczema Flare-Up & Skin Lesions",
    triageLevel: "Urgent Care / Dermatology Consult",
    triageColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    recommendation: "Apply topical Clobetasol Propionate (0.05%) under occlusion. Schedule telehealth or in-person Dermatology consult within 48 hrs.",
    nearbyClinics: [
      { name: "Metro Dermatology & Allergy Institute", distance: "2.4 km", status: "Open Now", phone: "(555) 019-2831" },
      { name: "University Chronic Skin Care Clinic", distance: "5.1 km", status: "Open 8 AM", phone: "(555) 019-8821" },
    ],
  },
  {
    id: "epilepsy",
    symptom: "Focal Seizure Aura & Disorientation",
    triageLevel: "Emergency Department Triage",
    triageColor: "text-red-400 bg-red-500/10 border-red-500/20",
    recommendation: "Ensure patient is in a safe horizontal posture. Verify Levetiracetam 500mg dose compliance. If seizure lasts > 5 mins, call Emergency Response (911).",
    nearbyClinics: [
      { name: "MetroGeneral Trauma & Emergency Dept", distance: "1.2 km", status: "24/7 ER Active", phone: "911 / (555) 019-9000" },
      { name: "Epilepsy & Comprehensive Neurology Center", distance: "3.8 km", status: "On-Call Specialist", phone: "(555) 019-3310" },
    ],
  },
  {
    id: "cardiac",
    symptom: "Acute Chest Pressure & Dyspnea",
    triageLevel: "CRITICAL — Immediate ICU / ER Dispatch",
    triageColor: "text-red-500 bg-red-600/20 border-red-500/40",
    recommendation: "Immediate emergency transport required. Isolation Forest telemetry flags MAP drop & elevated Troponin risk.",
    nearbyClinics: [
      { name: "Johns Hopkins Cardiac Emergency Bay", distance: "0.8 km", status: "24/7 ICU Bay A", phone: "(555) 019-7700" },
    ],
  },
];

export default function CareMazePage() {
  const [selectedPathwayId, setSelectedPathwayId] = useState("eczema");
  const activePathway = CLINICAL_PATHWAYS.find((p) => p.id === selectedPathwayId) || CLINICAL_PATHWAYS[0];

  return (
    <AppLayout activeTab="care-maze">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Compass className="text-blue-400" size={24} />
              CareMaze Clinical Pathway Navigator & Symptom Severity Mapping
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Dynamic decision-tree guiding patient triage from symptom severity to specialized clinical routing.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <Navigation size={14} /> Geolocation Clinic Sync Active
            </span>
          </div>
        </div>

        {/* Pathway Selection Decision Tree */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLINICAL_PATHWAYS.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPathwayId(p.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 ${
                selectedPathwayId === p.id
                  ? "bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10"
                  : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.triageColor}`}>
                  {p.triageLevel}
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{p.symptom}</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{p.recommendation}</p>
            </div>
          ))}
        </div>

        {/* Selected Pathway Triage Details & Geolocation Clinic Locator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Clinical Guidance Card */}
          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Clinical Triage & Action Protocol</h3>
                <p className="text-xs text-slate-400 mt-0.5">Symptom: <strong className="text-blue-400">{activePathway.symptom}</strong></p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${activePathway.triageColor}`}>
                {activePathway.triageLevel}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Recommended Intervention</span>
                <p className="text-slate-200 text-sm leading-relaxed">{activePathway.recommendation}</p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Systemic Escalation Rule</span>
                <p className="text-slate-300">
                  If symptoms worsen within 2 hours, automatic dispatch alert is emitted to the <strong>Doctor Workspace Task Queue</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Nearby Clinic Geolocation Sync */}
          <div className="lg:col-span-5 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-emerald-400" /> Geolocation Specialist Clinics
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Matched to Patient</span>
            </h3>

            <div className="space-y-3">
              {activePathway.nearbyClinics.map((clinic, i) => (
                <div key={i} className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{clinic.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {clinic.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Distance: <strong className="text-slate-200">{clinic.distance}</strong></span>
                    <span className="flex items-center gap-1 text-blue-400 font-mono">
                      <PhoneCall size={12} /> {clinic.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
