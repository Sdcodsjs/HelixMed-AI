"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Stethoscope, Clock, CheckCircle2, AlertTriangle, Users, Activity,
  ClipboardList, Timer, Play, Pause, ShieldCheck, ThermometerSun,
  HeartPulse, Zap, ChevronRight, Eye, FileText, ArrowRight
} from "lucide-react";

const OT_ROOMS = [
  { id: "OT-1", name: "OT Suite Alpha", status: "in-surgery", surgeon: "Dr. Priya Sharma", procedure: "CABG Triple Bypass", patient: "Ramesh Kumar", startTime: "09:15 AM", estDuration: "4h 30m", elapsed: "2h 45m", progress: 61 },
  { id: "OT-2", name: "OT Suite Beta", status: "available", surgeon: null, procedure: null, patient: null, startTime: null, estDuration: null, elapsed: null, progress: 0 },
  { id: "OT-3", name: "OT Suite Gamma", status: "in-surgery", surgeon: "Dr. Arjun Menon", procedure: "Laparoscopic Cholecystectomy", patient: "Sunita Devi", startTime: "10:30 AM", estDuration: "1h 45m", elapsed: "1h 10m", progress: 67 },
  { id: "OT-4", name: "OT Suite Delta", status: "cleaning", surgeon: null, procedure: "Turnover Cleaning", patient: null, startTime: null, estDuration: "30m", elapsed: "15m", progress: 50 },
  { id: "OT-5", name: "OT Suite Epsilon", status: "in-surgery", surgeon: "Dr. Sunita Rao", procedure: "Total Knee Replacement (R)", patient: "Vijay Patil", startTime: "08:00 AM", estDuration: "3h", elapsed: "2h 55m", progress: 97 },
  { id: "OT-6", name: "OT Suite Zeta", status: "available", surgeon: null, procedure: null, patient: null, startTime: null, estDuration: null, elapsed: null, progress: 0 },
];

const SURGERY_QUEUE = [
  { id: "SQ-001", patient: "Anita Deshmukh", age: 45, procedure: "Appendectomy", surgeon: "Dr. Rajesh Gupta", priority: "urgent", estDuration: "1h 15m", scheduledTime: "01:00 PM", asa: "II" },
  { id: "SQ-002", patient: "Mohammed Farhan", age: 62, procedure: "Hip Arthroplasty (L)", surgeon: "Dr. Sunita Rao", priority: "elective", estDuration: "2h 30m", scheduledTime: "02:00 PM", asa: "III" },
  { id: "SQ-003", patient: "Lakshmi Narayan", age: 55, procedure: "Thyroidectomy (Subtotal)", surgeon: "Dr. Priya Sharma", priority: "elective", estDuration: "2h", scheduledTime: "03:30 PM", asa: "II" },
  { id: "SQ-004", patient: "Deepak Chauhan", age: 38, procedure: "ACL Reconstruction", surgeon: "Dr. Arjun Menon", priority: "urgent", estDuration: "1h 45m", scheduledTime: "04:00 PM", asa: "I" },
  { id: "SQ-005", patient: "Kavitha Reddy", age: 70, procedure: "Pacemaker Implantation", surgeon: "Dr. Priya Sharma", priority: "emergency", estDuration: "1h 30m", scheduledTime: "ASAP", asa: "IV" },
];

const WHO_CHECKLIST = {
  signIn: [
    { id: 1, text: "Patient identity confirmed", checked: true },
    { id: 2, text: "Site marked / not applicable", checked: true },
    { id: 3, text: "Anesthesia machine & medication check complete", checked: true },
    { id: 4, text: "Pulse oximeter on patient & functioning", checked: false },
    { id: 5, text: "Known allergy? — Penicillin (documented)", checked: true },
    { id: 6, text: "Difficult airway / aspiration risk? — No", checked: false },
    { id: 7, text: "Risk of >500ml blood loss? — Yes, blood available", checked: false },
  ],
  timeOut: [
    { id: 8, text: "All team members introduced by name & role", checked: false },
    { id: 9, text: "Surgeon confirms: patient name, procedure, incision site", checked: false },
    { id: 10, text: "Anticipated critical events reviewed", checked: false },
    { id: 11, text: "Antibiotic prophylaxis given within last 60 min", checked: false },
    { id: 12, text: "Essential imaging displayed", checked: false },
  ],
  signOut: [
    { id: 13, text: "Instrument, sponge, and needle counts correct", checked: false },
    { id: 14, text: "Specimen labeled", checked: false },
    { id: 15, text: "Equipment problems addressed", checked: false },
    { id: 16, text: "Key concerns for recovery reviewed", checked: false },
  ],
};

const RECOVERY_PATIENTS = [
  { id: "REC-01", name: "Geeta Iyer", procedure: "Hysterectomy", surgeon: "Dr. Rajesh Gupta", admittedAt: "11:45 AM", vitals: { spo2: 98, bp: "122/78", hr: 72, pain: 3, temp: 36.8 }, status: "stable", aldrete: 9 },
  { id: "REC-02", name: "Suresh Babu", procedure: "Hernioplasty", surgeon: "Dr. Arjun Menon", admittedAt: "10:20 AM", vitals: { spo2: 96, bp: "135/85", hr: 88, pain: 5, temp: 37.1 }, status: "monitoring", aldrete: 7 },
  { id: "REC-03", name: "Priti Shah", procedure: "Cataract (Phaco + IOL)", surgeon: "Dr. Sunita Rao", admittedAt: "12:10 PM", vitals: { spo2: 99, bp: "118/72", hr: 65, pain: 1, temp: 36.6 }, status: "ready-discharge", aldrete: 10 },
];

const statusColor = { "in-surgery": "text-red-400 bg-red-500/10 border-red-500/30", available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", cleaning: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
const priorityColor = { emergency: "bg-red-500/20 text-red-400 border-red-500/30", urgent: "bg-amber-500/20 text-amber-400 border-amber-500/30", elective: "bg-blue-500/20 text-blue-400 border-blue-500/30" };

export default function SurgerySchedulerPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checklist, setChecklist] = useState(WHO_CHECKLIST);

  const toggleCheck = (phase, id) => {
    setChecklist(prev => ({
      ...prev,
      [phase]: prev[phase].map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    }));
  };

  const allChecks = [...checklist.signIn, ...checklist.timeOut, ...checklist.signOut];
  const completedChecks = allChecks.filter(c => c.checked).length;

  const tabs = [
    { id: "dashboard", label: "OT Dashboard", icon: Activity },
    { id: "queue", label: "Surgery Queue", icon: ClipboardList },
    { id: "checklist", label: "WHO Checklist", icon: ShieldCheck },
    { id: "recovery", label: "Post-Op Recovery", icon: HeartPulse },
  ];

  return (
    <AppLayout activeTab="surgery-scheduler">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg shadow-red-500/20">
                <Stethoscope className="text-white" size={24} />
              </div>
              Surgery & OT Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time operating theatre control · WHO Safety Protocol</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400">{OT_ROOMS.filter(r=>r.status==="available").length} OTs Free</div>
            <div className="bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400">{OT_ROOMS.filter(r=>r.status==="in-surgery").length} In Surgery</div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-800"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OT_ROOMS.map(room => (
              <div key={room.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{room.name}</h3>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${statusColor[room.status]}`}>{room.status.replace("-", " ")}</span>
                </div>
                {room.status === "in-surgery" && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300"><span className="text-slate-500">Patient:</span> {room.patient}</p>
                      <p className="text-xs text-slate-300"><span className="text-slate-500">Procedure:</span> {room.procedure}</p>
                      <p className="text-xs text-slate-300"><span className="text-slate-500">Surgeon:</span> {room.surgeon}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Elapsed: {room.elapsed}</span><span>Est: {room.estDuration}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${room.progress}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 text-right">{room.progress}% complete</p>
                    </div>
                  </>
                )}
                {room.status === "cleaning" && (
                  <div className="space-y-1">
                    <p className="text-xs text-amber-400">Turnover in progress — {room.elapsed} / {room.estDuration}</p>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${room.progress}%` }} />
                    </div>
                  </div>
                )}
                {room.status === "available" && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs py-4"><CheckCircle2 size={18} /> Ready for next case</div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "queue" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Scheduled Surgeries — Today</h3>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                <th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">Procedure</th><th className="text-left px-4 py-3">Surgeon</th><th className="text-left px-4 py-3">ASA</th><th className="text-left px-4 py-3">Priority</th><th className="text-left px-4 py-3">Time</th><th className="text-left px-4 py-3">Duration</th>
              </tr></thead>
              <tbody>
                {SURGERY_QUEUE.map(s => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-semibold">{s.patient} <span className="text-slate-500">({s.age}y)</span></td>
                    <td className="px-4 py-3 text-slate-300">{s.procedure}</td>
                    <td className="px-4 py-3 text-slate-300">{s.surgeon}</td>
                    <td className="px-4 py-3"><span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">ASA {s.asa}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${priorityColor[s.priority]}`}>{s.priority}</span></td>
                    <td className="px-4 py-3 text-slate-300 font-mono">{s.scheduledTime}</td>
                    <td className="px-4 py-3 text-slate-400">{s.estDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="space-y-4">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShieldCheck className="text-blue-400" size={18} /> WHO Surgical Safety Checklist</h3>
                <span className="text-xs font-bold text-blue-400">{completedChecks}/{allChecks.length} completed</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${(completedChecks / allChecks.length) * 100}%` }} />
              </div>
              {[{ key: "signIn", title: "Sign In (Before Induction)", color: "blue" }, { key: "timeOut", title: "Time Out (Before Incision)", color: "amber" }, { key: "signOut", title: "Sign Out (Before Patient Leaves OR)", color: "emerald" }].map(phase => (
                <div key={phase.key} className="mb-5">
                  <h4 className={`text-xs font-bold uppercase tracking-wider text-${phase.color}-400 mb-2`}>{phase.title}</h4>
                  <div className="space-y-1.5">
                    {checklist[phase.key].map(item => (
                      <button key={item.id} onClick={() => toggleCheck(phase.key, item.id)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs ${item.checked ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300" : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800"}`}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${item.checked ? "bg-emerald-500" : "bg-slate-700 border border-slate-600"}`}>
                          {item.checked && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "recovery" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {RECOVERY_PATIENTS.map(p => (
              <div key={p.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.procedure} · {p.surgeon}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${p.status === "stable" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : p.status === "ready-discharge" ? "text-blue-400 bg-blue-500/10 border-blue-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>{p.status.replace("-", " ")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ label: "SpO₂", value: `${p.vitals.spo2}%`, ok: p.vitals.spo2 >= 95 }, { label: "BP", value: p.vitals.bp, ok: true }, { label: "HR", value: `${p.vitals.hr} bpm`, ok: p.vitals.hr < 100 }, { label: "Temp", value: `${p.vitals.temp}°C`, ok: p.vitals.temp < 37.5 }].map(v => (
                    <div key={v.label} className="bg-slate-800/60 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-slate-500 uppercase">{v.label}</p>
                      <p className={`text-sm font-bold ${v.ok ? "text-emerald-400" : "text-red-400"}`}>{v.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Pain Score</p>
                    <div className="flex gap-1 mt-1">{[1,2,3,4,5,6,7,8,9,10].map(n => (<div key={n} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${n <= p.vitals.pain ? (n <= 3 ? "bg-emerald-500 text-white" : n <= 6 ? "bg-amber-500 text-white" : "bg-red-500 text-white") : "bg-slate-700 text-slate-500"}`}>{n}</div>))}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Aldrete Score</p>
                    <p className="text-lg font-black text-white">{p.aldrete}<span className="text-slate-500 text-xs">/10</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
