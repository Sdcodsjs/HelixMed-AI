"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Users, Calendar, Clock, AlertTriangle, CheckCircle2, Moon, Sun,
  TrendingUp, BarChart3, ArrowUpRight, ChevronRight, Filter,
  Activity, Heart, Zap, Star, UserCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const SHIFTS = { morning: { label: "Morning", time: "06:00–14:00", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" }, evening: { label: "Evening", time: "14:00–22:00", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" }, night: { label: "Night", time: "22:00–06:00", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" } };

const STAFF = [
  { id: "ST-001", name: "Dr. Priya Sharma", role: "Cardiologist", dept: "Cardiology", shifts: { Mon: "morning", Tue: "morning", Wed: "off", Thu: "morning", Fri: "morning", Sat: "off", Sun: "off" }, hoursThisWeek: 36, fatigueRisk: "low", leaveBalance: 18 },
  { id: "ST-002", name: "Nurse Anita", role: "Senior Nurse", dept: "ICU", shifts: { Mon: "morning", Tue: "evening", Wed: "night", Thu: "off", Fri: "morning", Sat: "evening", Sun: "off" }, hoursThisWeek: 48, fatigueRisk: "high", leaveBalance: 8 },
  { id: "ST-003", name: "Dr. Arjun Menon", role: "Oncologist", dept: "Oncology", shifts: { Mon: "morning", Tue: "off", Wed: "morning", Thu: "morning", Fri: "off", Sat: "morning", Sun: "off" }, hoursThisWeek: 32, fatigueRisk: "low", leaveBalance: 22 },
  { id: "ST-004", name: "Nurse Meera", role: "Staff Nurse", dept: "General Ward", shifts: { Mon: "evening", Tue: "evening", Wed: "evening", Thu: "night", Fri: "night", Sat: "off", Sun: "off" }, hoursThisWeek: 44, fatigueRisk: "medium", leaveBalance: 12 },
  { id: "ST-005", name: "Dr. Rajesh Gupta", role: "Neurologist", dept: "Neurology", shifts: { Mon: "morning", Tue: "morning", Wed: "morning", Thu: "off", Fri: "morning", Sat: "off", Sun: "morning" }, hoursThisWeek: 40, fatigueRisk: "low", leaveBalance: 15 },
  { id: "ST-006", name: "Nurse Fatima", role: "ICU Nurse", dept: "ICU", shifts: { Mon: "night", Tue: "night", Wed: "off", Thu: "night", Fri: "off", Sat: "night", Sun: "night" }, hoursThisWeek: 52, fatigueRisk: "critical", leaveBalance: 5 },
];

const OVERTIME_DATA = [
  { dept: "ICU", hours: 86, cost: 172000 },
  { dept: "Emergency", hours: 72, cost: 144000 },
  { dept: "General Ward", hours: 48, cost: 72000 },
  { dept: "Cardiology", hours: 24, cost: 60000 },
  { dept: "Oncology", hours: 18, cost: 45000 },
  { dept: "Pediatrics", hours: 12, cost: 24000 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fatigueColor = { low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", medium: "text-amber-400 bg-amber-500/10 border-amber-500/30", high: "text-orange-400 bg-orange-500/10 border-orange-500/30", critical: "text-red-400 bg-red-500/10 border-red-500/30" };
const shiftBg = { morning: "bg-amber-500/20 text-amber-300", evening: "bg-blue-500/20 text-blue-300", night: "bg-purple-500/20 text-purple-300", off: "bg-slate-800/40 text-slate-600" };

export default function StaffRosterPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const tabs = [
    { id: "calendar", label: "Shift Calendar", icon: Calendar },
    { id: "fatigue", label: "Fatigue Monitor", icon: Activity },
    { id: "overtime", label: "Overtime Analytics", icon: TrendingUp },
  ];

  return (
    <AppLayout activeTab="staff-roster">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20">
                <Users className="text-white" size={24} />
              </div>
              Staff Roster & Workforce Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Shift scheduling · Fatigue monitoring · Overtime analytics</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "calendar" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Weekly Shift Calendar</h3>
              <div className="flex gap-3">{Object.entries(SHIFTS).map(([k, v]) => (<span key={k} className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${v.color}`}>{v.label} {v.time}</span>))}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                  <th className="text-left px-4 py-3">Staff</th><th className="text-left px-4 py-3">Dept</th>
                  {DAYS.map(d => <th key={d} className="text-center px-3 py-3">{d}</th>)}
                  <th className="text-center px-4 py-3">Hours</th>
                </tr></thead>
                <tbody>{STAFF.map(s => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                    <td className="px-4 py-3"><p className="text-white font-semibold">{s.name}</p><p className="text-[10px] text-slate-500">{s.role}</p></td>
                    <td className="px-4 py-3 text-slate-400">{s.dept}</td>
                    {DAYS.map(d => (
                      <td key={d} className="text-center px-2 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${shiftBg[s.shifts[d]]}`}>{s.shifts[d] === "off" ? "OFF" : s.shifts[d].charAt(0).toUpperCase()}</span>
                      </td>
                    ))}
                    <td className="text-center px-4 py-3 text-white font-bold">{s.hoursThisWeek}h</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "fatigue" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAFF.map(s => (
              <div key={s.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-white font-bold">{s.name}</p><p className="text-[10px] text-slate-500">{s.role} · {s.dept}</p></div>
                  <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${fatigueColor[s.fatigueRisk]}`}>{s.fatigueRisk}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Hours/Week</p><p className={`text-lg font-black ${s.hoursThisWeek > 48 ? "text-red-400" : s.hoursThisWeek > 40 ? "text-amber-400" : "text-emerald-400"}`}>{s.hoursThisWeek}h</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Leave Balance</p><p className="text-lg font-black text-white">{s.leaveBalance}d</p></div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${s.fatigueRisk === "critical" ? "bg-red-500" : s.fatigueRisk === "high" ? "bg-orange-500" : s.fatigueRisk === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((s.hoursThisWeek / 60) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "overtime" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Department Overtime Hours & Cost (This Month)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={OVERTIME_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="dept" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} formatter={(v, name) => name === "hours" ? `${v}h` : `₹${(v/1000).toFixed(0)}K`} />
                <Bar dataKey="hours" fill="#8b5cf6" name="hours" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
