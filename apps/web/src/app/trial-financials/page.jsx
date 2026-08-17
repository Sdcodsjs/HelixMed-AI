"use client";
import React from "react";
import AppLayout from "@/components/AppLayout";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PieChart
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const TRIAL_SITES = [
  { site: "Mayo Clinic (Site 01)", budget: "$1.4M", spent: "$890K", enrolled: 142, costPerPatient: "$6,267", roi: "340%" },
  { site: "Johns Hopkins (Site 02)", budget: "$1.1M", spent: "$720K", enrolled: 110, costPerPatient: "$6,545", roi: "290%" },
  { site: "Mount Sinai (Site 03)", budget: "$950K", spent: "$540K", enrolled: 88, costPerPatient: "$6,136", roi: "310%" },
];

const MONTHLY_EXPENDITURE = [
  { month: "Jan", budget: 150, actual: 140 },
  { month: "Feb", budget: 300, actual: 290 },
  { month: "Mar", budget: 450, actual: 480 },
  { month: "Apr", budget: 600, actual: 590 },
  { month: "May", budget: 750, actual: 720 },
  { month: "Jun", budget: 900, actual: 860 },
];

export default function TrialFinancialsPage() {
  return (
    <AppLayout activeTab="trial-financials">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <DollarSign className="text-emerald-400" size={26} />
              Multi-Site Clinical Trial Financial ROI & Burn-Down Dashboard
            </h2>
            <p className="text-slate-400 text-sm">
              Portfolio management tracking site activation costs, CRO contract milestone billing & per-patient recruitment ROI forecasting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              CRO Milestone Billing Synced
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Total Allocated Trial Budget</div>
            <div className="text-2xl font-extrabold text-white font-mono">$3,450,000</div>
            <div className="text-[10px] text-emerald-400 font-bold">3 Active Sites Funded</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Total Cumulative Expenditure</div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">$2,150,000</div>
            <div className="text-[10px] text-blue-400 font-bold">62.3% of Total Budget</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Average Cost Per Enrolled Patient</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">$6,323</div>
            <div className="text-[10px] text-emerald-400 font-bold">↓ 14% Below Target Cap</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Projected Portfolio ROI</div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono">315% ROI</div>
            <div className="text-[10px] text-purple-400 font-bold">Phase III Commercial Model</div>
          </div>
        </div>

        {/* Financial Table & Burn-down Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sites Table */}
          <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span>Site Financial Breakdown ({TRIAL_SITES.length} Sites)</span>
              <Building size={16} className="text-emerald-400" />
            </h3>

            <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[9px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Trial Site</th>
                    <th className="px-4 py-2.5">Budget</th>
                    <th className="px-4 py-2.5">Spent</th>
                    <th className="px-4 py-2.5">Cost/Patient</th>
                    <th className="px-4 py-2.5 text-right">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {TRIAL_SITES.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-sans text-white font-semibold">{s.site}</td>
                      <td className="px-4 py-3 text-slate-300">{s.budget}</td>
                      <td className="px-4 py-3 text-blue-400">{s.spent}</td>
                      <td className="px-4 py-3 text-emerald-400">{s.costPerPatient}</td>
                      <td className="px-4 py-3 text-right text-purple-400 font-bold">{s.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Expenditure Burn-Down Chart */}
          <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Monthly Budget vs Actual Burn-Down ($k)
            </h4>
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_EXPENDITURE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", fontSize: "11px" }} />
                  <Bar dataKey="budget" fill="#334155" name="Planned Budget ($k)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#10b981" name="Actual Spent ($k)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
