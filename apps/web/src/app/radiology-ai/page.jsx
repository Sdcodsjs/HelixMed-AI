"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Scan, FileText, AlertTriangle, CheckCircle2, Clock, Users, Search,
  Eye, Brain, Activity, Zap, Filter, Star, Image, Monitor,
  ArrowRight, BarChart3, TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const WORKLIST = [
  { id: "RAD-5001", patient: "Ramesh Kumar", age: 58, modality: "CT", study: "CT Chest with Contrast", priority: "stat", referrer: "Dr. Priya Sharma", status: "unreported", assignedTo: "Dr. Vikram Singh", receivedAt: "08:30 AM" },
  { id: "RAD-5002", patient: "Sunita Devi", age: 45, modality: "MRI", study: "MRI Brain (Seizure protocol)", priority: "urgent", referrer: "Dr. Rajesh Gupta", status: "in-progress", assignedTo: "Dr. Vikram Singh", receivedAt: "09:15 AM" },
  { id: "RAD-5003", patient: "Vijay Patil", age: 62, modality: "X-Ray", study: "Chest PA", priority: "routine", referrer: "Dr. Arjun Menon", status: "reported", assignedTo: "Dr. Neha Kapoor", receivedAt: "07:45 AM" },
  { id: "RAD-5004", patient: "Kavitha Reddy", age: 70, modality: "CT", study: "HRCT Chest (ILD protocol)", priority: "urgent", referrer: "Dr. Sunita Rao", status: "unreported", assignedTo: "Dr. Neha Kapoor", receivedAt: "10:00 AM" },
  { id: "RAD-5005", patient: "Baby Arya", age: 0, modality: "USG", study: "USG Abdomen (Pyloric stenosis)", priority: "urgent", referrer: "Dr. Meera K.", status: "in-progress", assignedTo: "Dr. Vikram Singh", receivedAt: "10:30 AM" },
  { id: "RAD-5006", patient: "Mohammed Farhan", age: 55, modality: "MRI", study: "MRI Lumbar Spine", priority: "routine", referrer: "Dr. Rajesh Gupta", status: "reported", assignedTo: "Dr. Neha Kapoor", receivedAt: "08:00 AM" },
];

const AI_FINDINGS = [
  { study: "CT Chest — Ramesh Kumar", findings: [
    { label: "Pulmonary Nodule (RLL)", confidence: 94, severity: "critical", location: "Right lower lobe, 8mm", action: "Recommend PET-CT / biopsy" },
    { label: "Mild Cardiomegaly", confidence: 87, severity: "moderate", location: "Cardiothoracic ratio 0.55", action: "Correlate clinically" },
    { label: "Small Pleural Effusion (L)", confidence: 91, severity: "moderate", location: "Left costophrenic angle", action: "Follow-up in 2 weeks" },
  ]},
  { study: "Chest PA — Vijay Patil", findings: [
    { label: "No acute cardiopulmonary abnormality", confidence: 96, severity: "normal", location: "—", action: "Normal study" },
  ]},
  { study: "HRCT Chest — Kavitha Reddy", findings: [
    { label: "UIP Pattern (Bilateral basal)", confidence: 89, severity: "critical", location: "Subpleural honeycombing", action: "Refer Pulmonology — possible IPF" },
    { label: "Traction Bronchiectasis", confidence: 85, severity: "moderate", location: "Lower lobes bilaterally", action: "Consistent with fibrotic ILD" },
  ]},
];

const CRITICAL_ALERTS = [
  { id: "CRT-01", study: "CT Chest — Ramesh Kumar", finding: "8mm Pulmonary Nodule (RLL)", radiologist: "Dr. Vikram Singh", notifiedTo: "Dr. Priya Sharma", time: "09:45 AM", acknowledged: false },
  { id: "CRT-02", study: "HRCT Chest — Kavitha Reddy", finding: "UIP Pattern — Possible IPF", radiologist: "Dr. Neha Kapoor", notifiedTo: "Dr. Sunita Rao", time: "10:15 AM", acknowledged: true },
];

const TAT_DATA = [
  { modality: "X-Ray", avgTAT: 25, sla: 30 },
  { modality: "USG", avgTAT: 45, sla: 60 },
  { modality: "CT", avgTAT: 55, sla: 60 },
  { modality: "MRI", avgTAT: 90, sla: 120 },
];

const statusColor = { unreported: "text-red-400 bg-red-500/10 border-red-500/30", "in-progress": "text-amber-400 bg-amber-500/10 border-amber-500/30", reported: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
const priorityColor = { stat: "text-red-400 bg-red-500/10 border-red-500/30", urgent: "text-amber-400 bg-amber-500/10 border-amber-500/30", routine: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
const severityColor = { critical: "text-red-400 border-red-500/30 bg-red-500/10", moderate: "text-amber-400 border-amber-500/30 bg-amber-500/10", normal: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
const modalityBadge = { CT: "bg-purple-500/20 text-purple-400", MRI: "bg-blue-500/20 text-blue-400", "X-Ray": "bg-emerald-500/20 text-emerald-400", USG: "bg-amber-500/20 text-amber-400" };

export default function RadiologyAIPage() {
  const [activeTab, setActiveTab] = useState("worklist");
  const tabs = [
    { id: "worklist", label: "Worklist", icon: FileText },
    { id: "findings", label: "AI Findings", icon: Brain },
    { id: "critical", label: "Critical Alerts", icon: AlertTriangle },
    { id: "tat", label: "TAT Analytics", icon: TrendingUp },
  ];

  return (
    <AppLayout activeTab="radiology-ai">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                <Scan className="text-white" size={24} />
              </div>
              Radiology AI & Report Workstation
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI-assisted detection · Structured reporting · Critical alerts · TAT analytics</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400">{WORKLIST.filter(w=>w.status==="unreported").length} Unreported</span>
            <span className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400">{WORKLIST.filter(w=>w.status==="in-progress").length} In Progress</span>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "worklist" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                <th className="text-left px-4 py-3">ID</th><th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">Study</th><th className="text-left px-4 py-3">Modality</th><th className="text-left px-4 py-3">Priority</th><th className="text-left px-4 py-3">Assigned To</th><th className="text-left px-4 py-3">Status</th>
              </tr></thead>
              <tbody>{WORKLIST.map(w => (
                <tr key={w.id} className={`border-b border-slate-800/50 hover:bg-slate-800/40 ${w.priority === "stat" ? "bg-red-500/5" : ""}`}>
                  <td className="px-4 py-3 text-blue-400 font-mono font-bold">{w.id}</td>
                  <td className="px-4 py-3"><span className="text-white font-semibold">{w.patient}</span> <span className="text-slate-500">({w.age}{w.age === 0 ? "d" : "y"})</span></td>
                  <td className="px-4 py-3 text-slate-300">{w.study}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${modalityBadge[w.modality]}`}>{w.modality}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${priorityColor[w.priority]}`}>{w.priority}</span></td>
                  <td className="px-4 py-3 text-slate-300">{w.assignedTo}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${statusColor[w.status]}`}>{w.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "findings" && (
          <div className="space-y-4">
            {AI_FINDINGS.map((study, i) => (
              <div key={i} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Brain size={16} className="text-violet-400" /> {study.study}</h3>
                <div className="space-y-2">
                  {study.findings.map((f, j) => (
                    <div key={j} className={`flex items-center justify-between p-3 rounded-xl border ${severityColor[f.severity].replace("text-", "border-").split(" ")[0]} bg-slate-800/40`}>
                      <div>
                        <p className={`font-bold text-sm ${severityColor[f.severity].split(" ")[0]}`}>{f.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.location} · {f.action}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2"><div className={`h-2 rounded-full ${f.severity === "critical" ? "bg-red-500" : f.severity === "moderate" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${f.confidence}%` }} /></div>
                          <span className="text-xs font-bold text-white">{f.confidence}%</span>
                        </div>
                        <span className={`text-[10px] uppercase font-extrabold ${severityColor[f.severity].split(" ")[0]}`}>{f.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "critical" && (
          <div className="space-y-4">
            {CRITICAL_ALERTS.map(c => (
              <div key={c.id} className={`bg-[#1e293b] rounded-2xl border ${c.acknowledged ? "border-emerald-500/30" : "border-red-500/40"} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className={c.acknowledged ? "text-emerald-400" : "text-red-400 animate-pulse"} />
                    <div><p className="text-white font-bold text-sm">{c.finding}</p><p className="text-xs text-slate-400">{c.study}</p></div>
                  </div>
                  <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${c.acknowledged ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-red-400 bg-red-500/10 border-red-500/30"}`}>{c.acknowledged ? "✓ Acknowledged" : "⚠ Pending ACK"}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Radiologist</p><p className="text-slate-300">{c.radiologist}</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Notified To</p><p className="text-slate-300">{c.notifiedTo}</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Time</p><p className="text-slate-300 font-mono">{c.time}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tat" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Report Turnaround Time by Modality (minutes)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={TAT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="modality" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} formatter={v => `${v} min`} />
                <Bar dataKey="avgTAT" fill="#8b5cf6" name="Avg TAT" radius={[4,4,0,0]} />
                <Bar dataKey="sla" fill="#3b82f640" name="SLA Target" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
