"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  ShieldAlert, Bug, Activity, TrendingUp, AlertTriangle, CheckCircle2,
  Users, Search, ThermometerSun, Eye, Filter, Clock, BarChart3,
  Zap, ArrowUpRight, ArrowDownRight, Layers
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const HAI_RATES = [
  { type: "CAUTI", rate: 2.1, benchmark: 2.5, trend: "down", incidents: 8, devices: 380 },
  { type: "CLABSI", rate: 0.8, benchmark: 1.0, trend: "down", incidents: 3, devices: 375 },
  { type: "SSI", rate: 1.5, benchmark: 2.0, trend: "up", incidents: 12, devices: 800 },
  { type: "VAP", rate: 1.2, benchmark: 1.5, trend: "down", incidents: 4, devices: 333 },
];

const ANTIBIOGRAM = {
  organisms: ["E. coli", "Klebsiella", "Staph aureus", "Pseudomonas", "Enterococcus", "Acinetobacter", "MRSA", "Proteus"],
  antibiotics: ["Amoxicillin", "Ciprofloxacin", "Meropenem", "Vancomycin", "Piperacillin-Tazo", "Colistin", "Linezolid", "Ceftriaxone"],
  data: {
    "E. coli":       ["R","I","S","S","S","S","S","R"],
    "Klebsiella":    ["R","R","S","S","S","S","S","I"],
    "Staph aureus":  ["S","S","S","S","S","S","S","S"],
    "Pseudomonas":   ["R","S","S","R","S","S","R","R"],
    "Enterococcus":  ["S","R","R","S","R","R","S","R"],
    "Acinetobacter": ["R","R","I","R","R","S","R","R"],
    "MRSA":          ["R","R","R","S","R","R","S","R"],
    "Proteus":       ["I","S","S","S","S","S","S","S"],
  }
};

const HAND_HYGIENE = [
  { ward: "Cardiac ICU", compliance: 94, audits: 48, trend: "up" },
  { ward: "General Male", compliance: 87, audits: 36, trend: "down" },
  { ward: "General Female", compliance: 91, audits: 42, trend: "up" },
  { ward: "Pediatrics", compliance: 96, audits: 52, trend: "up" },
  { ward: "Oncology", compliance: 89, audits: 38, trend: "down" },
  { ward: "Emergency", compliance: 78, audits: 60, trend: "down" },
];

const ISOLATION_ROOMS = [
  { room: "ISO-101", patient: "Mrs. Fatima B.", precaution: "Contact", organism: "MRSA", since: "Aug 12", status: "active" },
  { room: "ISO-102", patient: "Mr. Rajan K.", precaution: "Airborne", organism: "TB (MDR)", since: "Aug 8", status: "active" },
  { room: "ISO-103", patient: "Ms. Priti S.", precaution: "Droplet", organism: "Influenza A", since: "Aug 15", status: "active" },
  { room: "ISO-104", patient: "—", precaution: "—", organism: "—", since: "—", status: "available" },
];

const OUTBREAK_TIMELINE = [
  { week: "W1", cases: 2 }, { week: "W2", cases: 3 }, { week: "W3", cases: 1 },
  { week: "W4", cases: 5 }, { week: "W5", cases: 8 }, { week: "W6", cases: 4 }, { week: "W7", cases: 2 },
];

const susceptColor = { S: "bg-emerald-500/30 text-emerald-400", I: "bg-amber-500/30 text-amber-400", R: "bg-red-500/30 text-red-400" };
const precColor = { Contact: "text-amber-400 bg-amber-500/10 border-amber-500/30", Airborne: "text-red-400 bg-red-500/10 border-red-500/30", Droplet: "text-blue-400 bg-blue-500/10 border-blue-500/30" };

export default function InfectionControlPage() {
  const [activeTab, setActiveTab] = useState("hai");
  const tabs = [
    { id: "hai", label: "HAI Dashboard", icon: Bug },
    { id: "antibiogram", label: "Antibiogram", icon: Layers },
    { id: "outbreak", label: "Outbreak Radar", icon: AlertTriangle },
    { id: "hygiene", label: "Hand Hygiene", icon: CheckCircle2 },
    { id: "isolation", label: "Isolation Manager", icon: ShieldAlert },
  ];

  return (
    <AppLayout activeTab="infection-control">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 shadow-lg shadow-amber-500/20">
                <Bug className="text-white" size={24} />
              </div>
              Hospital Infection Control & Surveillance
            </h1>
            <p className="text-slate-400 text-sm mt-1">HAI rates · Antibiogram · Outbreak detection · Compliance</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "hai" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HAI_RATES.map(h => (
              <div key={h.type} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{h.type}</h3>
                  <span className={`text-xs font-bold flex items-center gap-1 ${h.trend === "down" ? "text-emerald-400" : "text-red-400"}`}>{h.trend === "down" ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}{h.trend}</span>
                </div>
                <div className="text-3xl font-black text-white">{h.rate}<span className="text-sm text-slate-500 font-normal"> /1000 device-days</span></div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>NHSN Benchmark: {h.benchmark}</span>
                  <span className={h.rate <= h.benchmark ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{h.rate <= h.benchmark ? "✓ Below" : "✗ Above"}</span>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-3 py-2 flex justify-between text-xs">
                  <span className="text-slate-400">Incidents: <span className="text-white font-bold">{h.incidents}</span></span>
                  <span className="text-slate-400">Devices: <span className="text-white font-bold">{h.devices}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "antibiogram" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800"><h3 className="text-sm font-bold text-white">Organism × Antibiotic Susceptibility Matrix</h3><p className="text-[10px] text-slate-500 mt-1">S = Susceptible · I = Intermediate · R = Resistant</p></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                  <th className="text-left px-4 py-3 sticky left-0 bg-[#1e293b]">Organism</th>
                  {ANTIBIOGRAM.antibiotics.map(a => <th key={a} className="text-center px-2 py-3 whitespace-nowrap">{a}</th>)}
                </tr></thead>
                <tbody>{ANTIBIOGRAM.organisms.map(org => (
                  <tr key={org} className="border-b border-slate-800/50">
                    <td className="px-4 py-2.5 text-white font-semibold sticky left-0 bg-[#1e293b]">{org}</td>
                    {ANTIBIOGRAM.data[org].map((val, i) => (
                      <td key={i} className="text-center px-2 py-2.5">
                        <span className={`inline-block w-7 h-7 rounded flex items-center justify-center font-bold text-[10px] ${susceptColor[val]}`}>{val}</span>
                      </td>
                    ))}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "outbreak" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Infection Cluster Timeline (MRSA — General Ward)</h3>
              <span className="px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold text-amber-400 bg-amber-500/10 border-amber-500/30">⚠ Cluster Detected W4-W5</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={OUTBREAK_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} />
                <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "hygiene" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HAND_HYGIENE.map(h => (
              <div key={h.ward} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-sm">{h.ward}</h3>
                  <span className={`text-xs font-bold ${h.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>{h.trend === "up" ? "↑" : "↓"}</span>
                </div>
                <div className="text-3xl font-black text-white mb-2">{h.compliance}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
                  <div className={`h-2.5 rounded-full ${h.compliance >= 90 ? "bg-emerald-500" : h.compliance >= 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${h.compliance}%` }} />
                </div>
                <p className="text-[10px] text-slate-500">{h.audits} audits conducted</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "isolation" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ISOLATION_ROOMS.map(r => (
              <div key={r.room} className={`bg-[#1e293b] rounded-2xl border ${r.status === "active" ? "border-amber-500/30" : "border-slate-800"} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{r.room}</h3>
                  <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${r.status === "active" ? "text-red-400 bg-red-500/10 border-red-500/30" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"}`}>{r.status}</span>
                </div>
                {r.status === "active" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-300"><span className="text-slate-500">Patient:</span> {r.patient}</p>
                    <p className="text-xs text-slate-300"><span className="text-slate-500">Organism:</span> <span className="text-red-400 font-bold">{r.organism}</span></p>
                    <p className="text-xs text-slate-300"><span className="text-slate-500">Since:</span> {r.since}</p>
                    <span className={`inline-block px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${precColor[r.precaution]}`}>{r.precaution} Precautions</span>
                  </div>
                ) : (<p className="text-emerald-400 text-xs flex items-center gap-2 py-4"><CheckCircle2 size={16} /> Room cleaned and available</p>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
