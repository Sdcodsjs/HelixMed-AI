"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Droplets, AlertTriangle, CheckCircle2, Clock, Users, Activity,
  Search, ThermometerSun, Heart, Zap, TrendingUp, Package,
  ShieldAlert, Plus, RefreshCw, ArrowRight, Filter, Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMPONENTS = ["Whole Blood", "PRBCs", "FFP", "Platelets", "Cryoprecipitate"];

const INVENTORY = {
  "A+":  { "Whole Blood": 12, "PRBCs": 18, "FFP": 8, "Platelets": 6, "Cryoprecipitate": 4 },
  "A-":  { "Whole Blood": 3, "PRBCs": 5, "FFP": 2, "Platelets": 2, "Cryoprecipitate": 1 },
  "B+":  { "Whole Blood": 15, "PRBCs": 22, "FFP": 10, "Platelets": 8, "Cryoprecipitate": 3 },
  "B-":  { "Whole Blood": 2, "PRBCs": 4, "FFP": 1, "Platelets": 1, "Cryoprecipitate": 0 },
  "AB+": { "Whole Blood": 5, "PRBCs": 8, "FFP": 14, "Platelets": 4, "Cryoprecipitate": 2 },
  "AB-": { "Whole Blood": 1, "PRBCs": 2, "FFP": 3, "Platelets": 1, "Cryoprecipitate": 0 },
  "O+":  { "Whole Blood": 20, "PRBCs": 28, "FFP": 12, "Platelets": 10, "Cryoprecipitate": 5 },
  "O-":  { "Whole Blood": 4, "PRBCs": 6, "FFP": 3, "Platelets": 2, "Cryoprecipitate": 1 },
};

const CROSSMATCH_QUEUE = [
  { id: "XM-301", patient: "Ramesh Kumar", bloodType: "B+", requested: "PRBCs × 2", surgeon: "Dr. Priya Sharma", urgency: "emergency", status: "compatible", antibodyScreen: "Negative" },
  { id: "XM-302", patient: "Kavitha Reddy", bloodType: "O+", requested: "FFP × 4", surgeon: "Dr. Arjun Menon", urgency: "urgent", status: "pending", antibodyScreen: "Pending" },
  { id: "XM-303", patient: "Suresh Babu", bloodType: "A-", requested: "Platelets × 6", surgeon: "Dr. Rajesh Gupta", urgency: "routine", status: "compatible", antibodyScreen: "Negative" },
  { id: "XM-304", patient: "Anita Deshmukh", bloodType: "AB+", requested: "PRBCs × 3", surgeon: "Dr. Sunita Rao", urgency: "urgent", status: "incompatible", antibodyScreen: "Anti-Kell detected" },
];

const TRANSFUSION_LOG = [
  { id: "TX-801", patient: "Geeta Iyer", unit: "PRBCs #4417", startTime: "10:30 AM", rate: "125 ml/hr", volume: "280/350 ml", vitals: "Stable", reaction: "none" },
  { id: "TX-802", patient: "Mohammed Farhan", unit: "FFP #2209", startTime: "11:15 AM", rate: "200 ml/hr", volume: "200/250 ml", vitals: "Stable", reaction: "none" },
  { id: "TX-803", patient: "Priti Shah", unit: "Platelets #6612", startTime: "09:45 AM", rate: "300 ml/hr", volume: "250/250 ml", vitals: "Completed", reaction: "mild-febrile" },
];

const DONORS = [
  { id: "DN-101", name: "Arjun Nair", bloodType: "O+", lastDonation: "2026-05-12", donations: 8, eligible: true, phone: "+91-98765-XXXXX" },
  { id: "DN-102", name: "Meera Krishnan", bloodType: "A-", lastDonation: "2026-07-28", donations: 3, eligible: false, phone: "+91-87654-XXXXX" },
  { id: "DN-103", name: "Sanjay Patel", bloodType: "B+", lastDonation: "2026-03-15", donations: 12, eligible: true, phone: "+91-76543-XXXXX" },
  { id: "DN-104", name: "Fatima Begum", bloodType: "O-", lastDonation: "2026-04-20", donations: 5, eligible: true, phone: "+91-65432-XXXXX" },
];

const DEMAND_FORECAST = [
  { day: "Mon", predicted: 12, actual: 14 }, { day: "Tue", predicted: 15, actual: 13 },
  { day: "Wed", predicted: 18, actual: 19 }, { day: "Thu", predicted: 14, actual: 12 },
  { day: "Fri", predicted: 20, actual: 22 }, { day: "Sat", predicted: 10, actual: 8 },
  { day: "Sun", predicted: 8, actual: 7 },
];

const stockLevel = (n) => n <= 2 ? "text-red-400 bg-red-500/20" : n <= 5 ? "text-amber-400 bg-amber-500/20" : "text-emerald-400 bg-emerald-500/20";
const urgColor = { emergency: "text-red-400 bg-red-500/10 border-red-500/30", urgent: "text-amber-400 bg-amber-500/10 border-amber-500/30", routine: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
const xmColor = { compatible: "text-emerald-400", pending: "text-amber-400", incompatible: "text-red-400" };

export default function BloodBankPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const tabs = [
    { id: "inventory", label: "Blood Inventory", icon: Package },
    { id: "crossmatch", label: "Cross-Match Lab", icon: Search },
    { id: "transfusion", label: "Transfusion Monitor", icon: Activity },
    { id: "donors", label: "Donor Registry", icon: Users },
    { id: "forecast", label: "AI Demand Forecast", icon: TrendingUp },
  ];

  const totalUnits = Object.values(INVENTORY).reduce((s, g) => s + Object.values(g).reduce((a, b) => a + b, 0), 0);

  return (
    <AppLayout activeTab="blood-bank">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-pink-500 shadow-lg shadow-red-500/20">
                <Droplets className="text-white" size={24} />
              </div>
              Blood Bank & Transfusion Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Inventory · Cross-match · Transfusion Safety · AI Forecasting</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-white">{totalUnits} Total Units in Stock</div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {activeTab === "inventory" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800"><h3 className="text-sm font-bold text-white">Blood Group × Component Matrix (Units Available)</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                  <th className="text-left px-4 py-3">Blood Group</th>
                  {COMPONENTS.map(c => <th key={c} className="text-center px-3 py-3">{c}</th>)}
                  <th className="text-center px-4 py-3">Total</th>
                </tr></thead>
                <tbody>{BLOOD_GROUPS.map(bg => {
                  const total = Object.values(INVENTORY[bg]).reduce((a, b) => a + b, 0);
                  return (
                    <tr key={bg} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-white font-bold text-sm">{bg}</td>
                      {COMPONENTS.map(c => (
                        <td key={c} className="text-center px-3 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${stockLevel(INVENTORY[bg][c])}`}>{INVENTORY[bg][c]}</span>
                        </td>
                      ))}
                      <td className="text-center px-4 py-3 text-white font-bold">{total}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "crossmatch" && (
          <div className="space-y-4">
            {CROSSMATCH_QUEUE.map(xm => (
              <div key={xm.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div><p className="text-blue-400 font-mono font-bold text-sm">{xm.id}</p><p className="text-[10px] text-slate-500">{xm.surgeon}</p></div>
                  <div><p className="text-white font-bold">{xm.patient}</p><p className="text-xs text-slate-400">Type: <span className="text-white font-bold">{xm.bloodType}</span> · Request: {xm.requested}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><p className="text-[10px] text-slate-500">Antibody Screen</p><p className="text-xs text-slate-300">{xm.antibodyScreen}</p></div>
                  <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${urgColor[xm.urgency]}`}>{xm.urgency}</span>
                  <span className={`text-xs font-bold ${xmColor[xm.status]}`}>{xm.status === "compatible" ? "✓ Compatible" : xm.status === "incompatible" ? "✗ Incompatible" : "⏳ Pending"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transfusion" && (
          <div className="space-y-4">
            {TRANSFUSION_LOG.map(tx => (
              <div key={tx.id} className={`bg-[#1e293b] rounded-2xl border ${tx.reaction !== "none" ? "border-amber-500/50" : "border-slate-800"} p-5`}>
                <div className="flex items-center justify-between">
                  <div><p className="text-white font-bold">{tx.patient}</p><p className="text-xs text-slate-400">Unit: {tx.unit} · Started: {tx.startTime} · Rate: {tx.rate}</p></div>
                  <div className="flex items-center gap-4">
                    <div className="text-right"><p className="text-[10px] text-slate-500">Volume</p><p className="text-sm font-bold text-white">{tx.volume}</p></div>
                    {tx.reaction !== "none" && <span className="px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold text-amber-400 bg-amber-500/10 border-amber-500/30 flex items-center gap-1"><AlertTriangle size={12} />{tx.reaction}</span>}
                    {tx.reaction === "none" && <span className="text-emerald-400 flex items-center gap-1 text-xs font-bold"><CheckCircle2 size={14} /> {tx.vitals}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "donors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DONORS.map(d => (
              <div key={d.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">{d.name}</p>
                  <p className="text-xs text-slate-400">Type: <span className="text-white font-bold">{d.bloodType}</span> · Donations: {d.donations} · Last: {d.lastDonation}</p>
                </div>
                <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${d.eligible ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-red-400 bg-red-500/10 border-red-500/30"}`}>{d.eligible ? "Eligible" : "Not Eligible"}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">AI Blood Demand Forecast (Units/Day)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DEMAND_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="predicted" fill="#3b82f6" name="AI Predicted" radius={[4,4,0,0]} />
                <Bar dataKey="actual" fill="#10b981" name="Actual Usage" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
