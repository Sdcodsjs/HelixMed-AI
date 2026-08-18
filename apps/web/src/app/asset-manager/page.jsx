"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Wrench, Package, AlertTriangle, CheckCircle2, Clock, Search,
  Calendar, TrendingUp, BarChart3, Filter, MapPin, Shield,
  Activity, Zap, ArrowUpRight, RefreshCw, Settings
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const EQUIPMENT = [
  { id: "EQ-001", name: "Ventilator (Hamilton C6)", serial: "HC6-4821", location: "ICU Bay-A", status: "in-use", lastPM: "2026-07-15", nextPM: "2026-10-15", warranty: "2027-03-20", calibDue: "2026-09-01", utilization: 92 },
  { id: "EQ-002", name: "Defibrillator (Philips HeartStart)", serial: "PHS-7734", location: "Emergency Dept", status: "available", lastPM: "2026-08-01", nextPM: "2026-11-01", warranty: "2027-06-15", calibDue: "2026-10-01", utilization: 45 },
  { id: "EQ-003", name: "Infusion Pump (B. Braun)", serial: "BBP-1192", location: "General Ward 3", status: "in-use", lastPM: "2026-06-10", nextPM: "2026-09-10", warranty: "2026-12-31", calibDue: "2026-08-25", utilization: 78 },
  { id: "EQ-004", name: "Patient Monitor (GE B850)", serial: "GEB-5567", location: "OT Suite Alpha", status: "maintenance", lastPM: "2026-05-20", nextPM: "2026-08-20", warranty: "Expired", calibDue: "Overdue", utilization: 88 },
  { id: "EQ-005", name: "ECG Machine (BPL Cardiart)", serial: "BPL-3308", location: "Cardiology OPD", status: "available", lastPM: "2026-07-25", nextPM: "2026-10-25", warranty: "2028-01-10", calibDue: "2026-11-15", utilization: 62 },
  { id: "EQ-006", name: "Pulse Oximeter (Masimo)", serial: "MSM-9912", location: "Pediatric Ward", status: "in-use", lastPM: "2026-08-05", nextPM: "2026-11-05", warranty: "2027-08-20", calibDue: "2026-12-01", utilization: 71 },
  { id: "EQ-007", name: "Syringe Pump (Fresenius)", serial: "FKP-2245", location: "ICU Bay-B", status: "in-use", lastPM: "2026-07-30", nextPM: "2026-10-30", warranty: "2027-04-15", calibDue: "2026-09-15", utilization: 85 },
  { id: "EQ-008", name: "Suction Machine (Medela)", serial: "MDL-6673", location: "OT Suite Beta", status: "available", lastPM: "2026-06-20", nextPM: "2026-09-20", warranty: "2026-09-30", calibDue: "2026-09-20", utilization: 35 },
];

const UTILIZATION_DATA = [
  { dept: "ICU", rate: 94 }, { dept: "Emergency", rate: 78 },
  { dept: "OT", rate: 72 }, { dept: "Cardiology", rate: 65 },
  { dept: "Gen Ward", rate: 55 }, { dept: "Pediatrics", rate: 48 },
];

const statusColor = { "in-use": "text-blue-400 bg-blue-500/10 border-blue-500/30", available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", maintenance: "text-amber-400 bg-amber-500/10 border-amber-500/30" };

export default function AssetManagerPage() {
  const [activeTab, setActiveTab] = useState("registry");
  const [searchTerm, setSearchTerm] = useState("");
  const tabs = [
    { id: "registry", label: "Equipment Registry", icon: Package },
    { id: "maintenance", label: "PM Schedule", icon: Wrench },
    { id: "utilization", label: "Utilization Analytics", icon: BarChart3 },
  ];

  const filteredEquipment = EQUIPMENT.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.location.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AppLayout activeTab="asset-manager">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-600 to-zinc-500 shadow-lg shadow-slate-500/20">
                <Settings className="text-white" size={24} />
              </div>
              Hospital Asset & Equipment Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Inventory · Preventive maintenance · Calibration · Utilization</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "registry" && (
          <div className="space-y-4">
            <div className="relative"><Search className="absolute left-3 top-2.5 text-slate-500" size={16} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search equipment or location..." className="w-full bg-[#1e293b] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" /></div>
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                  <th className="text-left px-4 py-3">Equipment</th><th className="text-left px-4 py-3">Serial</th><th className="text-left px-4 py-3">Location</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Warranty</th><th className="text-left px-4 py-3">Utilization</th>
                </tr></thead>
                <tbody>{filteredEquipment.map(e => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-white font-semibold">{e.name}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{e.serial}</td>
                    <td className="px-4 py-3 text-slate-300">{e.location}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${statusColor[e.status]}`}>{e.status.replace("-", " ")}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold ${e.warranty === "Expired" ? "text-red-400" : "text-slate-300"}`}>{e.warranty}</span></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 bg-slate-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${e.utilization > 80 ? "bg-emerald-500" : e.utilization > 50 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${e.utilization}%` }} /></div><span className="text-[10px] text-slate-400">{e.utilization}%</span></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EQUIPMENT.map(e => {
              const isOverdue = e.calibDue === "Overdue" || new Date(e.nextPM) < new Date();
              return (
                <div key={e.id} className={`bg-[#1e293b] rounded-2xl border ${isOverdue ? "border-red-500/40" : "border-slate-800"} p-5 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">{e.name}</h3>
                    {isOverdue && <span className="text-[10px] font-extrabold text-red-400 flex items-center gap-1"><AlertTriangle size={12} />OVERDUE</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Last PM</p><p className="text-slate-300 font-semibold">{e.lastPM}</p></div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Next PM</p><p className={`font-semibold ${isOverdue ? "text-red-400" : "text-emerald-400"}`}>{e.nextPM}</p></div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Calibration Due</p><p className={`font-semibold ${e.calibDue === "Overdue" ? "text-red-400" : "text-slate-300"}`}>{e.calibDue}</p></div>
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Location</p><p className="text-slate-300 font-semibold">{e.location}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "utilization" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Equipment Utilization Rate by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={UTILIZATION_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} formatter={v => `${v}%`} />
                <Bar dataKey="rate" fill="#3b82f6" name="Utilization %" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
