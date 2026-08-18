"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  DollarSign, TrendingUp, AlertCircle, FileText, CreditCard, CheckCircle2,
  XCircle, Clock, Search, BarChart3, ArrowUpRight, ArrowDownRight, Zap,
  PieChart as PieChartIcon, Filter, ChevronRight, Calculator, Building
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 4200000, collections: 3800000, outstanding: 400000 },
  { month: "Feb", revenue: 4500000, collections: 4100000, outstanding: 400000 },
  { month: "Mar", revenue: 4800000, collections: 4300000, outstanding: 500000 },
  { month: "Apr", revenue: 5100000, collections: 4600000, outstanding: 500000 },
  { month: "May", revenue: 4900000, collections: 4500000, outstanding: 400000 },
  { month: "Jun", revenue: 5400000, collections: 4900000, outstanding: 500000 },
];

const PAYER_MIX = [
  { name: "CGHS/ECHS", value: 32, color: "#3b82f6" },
  { name: "Private Insurance", value: 28, color: "#8b5cf6" },
  { name: "Ayushman Bharat", value: 22, color: "#10b981" },
  { name: "Self-Pay", value: 12, color: "#f59e0b" },
  { name: "Corporate TPA", value: 6, color: "#ef4444" },
];

const CLAIMS = [
  { id: "CLM-4501", patient: "Ramesh Kumar", amount: 285000, payer: "Star Health", status: "approved", icd10: "I25.1", cpt: "33533", daysInAR: 12, denialRisk: 5 },
  { id: "CLM-4502", patient: "Sunita Devi", amount: 145000, payer: "CGHS", status: "pending", icd10: "K80.2", cpt: "47562", daysInAR: 8, denialRisk: 15 },
  { id: "CLM-4503", patient: "Farhan Sheikh", amount: 420000, payer: "ICICI Lombard", status: "denied", icd10: "M16.1", cpt: "27130", daysInAR: 45, denialRisk: 92 },
  { id: "CLM-4504", patient: "Geeta Iyer", amount: 78000, payer: "Ayushman Bharat", status: "approved", icd10: "N80.0", cpt: "58661", daysInAR: 5, denialRisk: 3 },
  { id: "CLM-4505", patient: "Vijay Patil", amount: 310000, payer: "Niva Bupa", status: "pending", icd10: "M17.1", cpt: "27447", daysInAR: 22, denialRisk: 38 },
  { id: "CLM-4506", patient: "Priti Shah", amount: 52000, payer: "Self-Pay", status: "partial", icd10: "H25.1", cpt: "66984", daysInAR: 3, denialRisk: 0 },
];

const PAYMENT_PLANS = [
  { patient: "Farhan Sheikh", total: 420000, paid: 120000, remaining: 300000, emiAmount: 25000, emis: 12, nextDue: "Sep 5, 2026" },
  { patient: "Deepak Chauhan", total: 180000, paid: 60000, remaining: 120000, emiAmount: 20000, emis: 6, nextDue: "Sep 1, 2026" },
  { patient: "Kavitha Reddy", total: 350000, paid: 150000, remaining: 200000, emiAmount: 33334, emis: 6, nextDue: "Sep 10, 2026" },
];

const statusBadge = { approved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", pending: "text-amber-400 bg-amber-500/10 border-amber-500/30", denied: "text-red-400 bg-red-500/10 border-red-500/30", partial: "text-blue-400 bg-blue-500/10 border-blue-500/30" };

export default function BillingIntelligencePage() {
  const [activeTab, setActiveTab] = useState("revenue");
  const tabs = [
    { id: "revenue", label: "Revenue Dashboard", icon: TrendingUp },
    { id: "claims", label: "Claims & Denial AI", icon: FileText },
    { id: "payments", label: "Payment Plans", icon: CreditCard },
  ];

  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalCollections = REVENUE_DATA.reduce((s, d) => s + d.collections, 0);
  const collectionRate = ((totalCollections / totalRevenue) * 100).toFixed(1);

  return (
    <AppLayout activeTab="billing-intelligence">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/20">
                <DollarSign className="text-white" size={24} />
              </div>
              Revenue Cycle & Billing Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI-powered auto-coding · Denial prediction · Revenue analytics</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {activeTab === "revenue" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue (6M)", value: `₹${(totalRevenue / 1e6).toFixed(1)}M`, trend: "+12.4%", up: true, color: "emerald" },
                { label: "Collections", value: `₹${(totalCollections / 1e6).toFixed(1)}M`, trend: `${collectionRate}%`, up: true, color: "blue" },
                { label: "Avg Days in AR", value: "18.2", trend: "-3.1d", up: true, color: "purple" },
                { label: "Denial Rate", value: "8.4%", trend: "-1.2%", up: true, color: "amber" },
              ].map(kpi => (
                <div key={kpi.label} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-black text-white mt-1">{kpi.value}</p>
                  <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>{kpi.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}{kpi.trend}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                <h3 className="text-sm font-bold text-white mb-4">Revenue vs Collections (6-Month)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₹${(v/1e6).toFixed(1)}M`} />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} formatter={v => `₹${(v/1e5).toFixed(1)}L`} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
                    <Area type="monotone" dataKey="collections" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                <h3 className="text-sm font-bold text-white mb-4">Payer Mix</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart><Pie data={PAYER_MIX} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                    {PAYER_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">{PAYER_MIX.map(p => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-slate-400">{p.name}</span></span>
                    <span className="text-white font-bold">{p.value}%</span>
                  </div>
                ))}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "claims" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Claims Tracker with AI Denial Risk</h3>
              <div className="flex gap-2">{["all","approved","pending","denied"].map(f => (
                <button key={f} className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">{f}</button>
              ))}</div>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                <th className="text-left px-4 py-3">Claim ID</th><th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">ICD-10</th><th className="text-left px-4 py-3">Amount</th><th className="text-left px-4 py-3">Payer</th><th className="text-left px-4 py-3">Days in AR</th><th className="text-left px-4 py-3">Denial Risk</th><th className="text-left px-4 py-3">Status</th>
              </tr></thead>
              <tbody>{CLAIMS.map(c => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-blue-400 font-mono font-bold">{c.id}</td>
                  <td className="px-4 py-3 text-white font-semibold">{c.patient}</td>
                  <td className="px-4 py-3 text-slate-300 font-mono">{c.icd10}</td>
                  <td className="px-4 py-3 text-white font-bold">₹{(c.amount/1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-slate-300">{c.payer}</td>
                  <td className="px-4 py-3 text-slate-300">{c.daysInAR}d</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-700 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${c.denialRisk > 70 ? "bg-red-500" : c.denialRisk > 30 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${c.denialRisk}%` }} /></div>
                      <span className={`text-[10px] font-bold ${c.denialRisk > 70 ? "text-red-400" : c.denialRisk > 30 ? "text-amber-400" : "text-emerald-400"}`}>{c.denialRisk}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${statusBadge[c.status]}`}>{c.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {PAYMENT_PLANS.map(p => (
              <div key={p.patient} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">{p.patient}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Total Bill</p><p className="text-sm font-bold text-white">₹{(p.total/1000).toFixed(0)}K</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Paid</p><p className="text-sm font-bold text-emerald-400">₹{(p.paid/1000).toFixed(0)}K</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">EMI Amount</p><p className="text-sm font-bold text-blue-400">₹{(p.emiAmount/1000).toFixed(0)}K/mo</p></div>
                  <div className="bg-slate-800/60 rounded-lg px-3 py-2"><p className="text-[10px] text-slate-500">Next Due</p><p className="text-sm font-bold text-amber-400">{p.nextDue}</p></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400"><span>Payment Progress</span><span>{((p.paid/p.total)*100).toFixed(0)}%</span></div>
                  <div className="w-full bg-slate-700 rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${(p.paid/p.total)*100}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
