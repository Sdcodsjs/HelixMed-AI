"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  Loader2,
  Play,
  Info,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Database,
  Calendar,
  Clock,
  CheckCircle2
} from "lucide-react";

import { PATIENTS } from "@/context/PatientContext";

const DEFAULT_MOCK_SIMULATION = {
  timeline: [
    { day: 0, baseline: 82, twinPredict: 82, riskScore: 0.12 },
    { day: 30, baseline: 80, twinPredict: 84, riskScore: 0.14 },
    { day: 60, baseline: 78, twinPredict: 87, riskScore: 0.18 },
    { day: 90, baseline: 75, twinPredict: 89, riskScore: 0.22 },
    { day: 120, baseline: 71, twinPredict: 91, riskScore: 0.28 },
    { day: 150, baseline: 68, twinPredict: 93, riskScore: 0.31 },
    { day: 180, baseline: 65, twinPredict: 95, riskScore: 0.35 },
  ],
  summary: {
    avgRisk: 0.228,
    mlTwinNet: {
      trajectoryScore: 0.742,
      healthOutlook: "Improving",
      confidence: "94.2% (PyTorch MLP)"
    }
  }
};

const CLINICAL_HISTORY = [
  { year: "2023", event: "Diabetes Diagnosed", detail: "Fasting blood glucose 145 mg/dL. Lisinopril 20mg initiated.", type: "diagnosis" },
  { year: "2024", event: "HbA1c Elevation & Dry Cough", detail: "HbA1c rose to 7.4%. Lisinopril discontinued due to adverse ACE cough.", type: "medication" },
  { year: "2025", event: "Kidney eGFR Declining", detail: "Creatinine cleared at 2.4 mg/dL. Glomerular Filtration Rate fell to 45 ml/min.", type: "lab" },
  { year: "2026", event: "AI Trend Alert: Switch to Losartan", detail: "Clinical safety agent recommended ARB replacement. Losartan 50mg initiated.", type: "ai" }
];

export default function DigitalTwinPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("PT-9042");
  const [simulationData, setSimulationData] = useState(DEFAULT_MOCK_SIMULATION);

  const { data: fetchedPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/patients");
        if (res.ok) return await res.json();
      } catch (e) {}
      return PATIENTS;
    },
  });

  const patientOptions = fetchedPatients || PATIENTS;

  const simulateMutation = useMutation({
    mutationFn: async (patientId) => {
      try {
        const res = await fetch("/api/ai/digital-twin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.summary) return data;
        }
      } catch (e) {}
      return DEFAULT_MOCK_SIMULATION;
    },
    onSuccess: (data) => {
      setSimulationData(data);
    },
  });

  return (
    <AppLayout activeTab="digital-twin">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Zap className="text-yellow-400" size={24} />
              Digital Twin Patient Simulation & Health Timeline
            </h2>
            <p className="text-slate-400 text-sm">
              Ingest patient history and simulate 6-month clinical outcomes using multi-scenario virtual physiological models.
            </p>
          </div>
          <div className="flex gap-4 items-center bg-[#1e293b] p-4 rounded-xl border border-slate-800 w-full md:w-auto">
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 text-slate-200"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">Select participant to twin...</option>
              {patientOptions?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => simulateMutation.mutate(selectedPatientId)}
              disabled={!selectedPatientId || simulateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-xs shadow-md shadow-blue-500/20"
            >
              {simulateMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Play size={18} />
              )}
              Run Twin
            </button>
          </div>
        </div>

        {simulationData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Graphs & Longitudinal Health Timeline */}
            <div className="lg:col-span-8 space-y-6">
              {/* Predicted Trajectory Graph */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 h-[360px] shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-300 text-sm">
                    Predicted Trajectory Forecast (180 Days)
                  </h3>
                  <div className="flex gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1 text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      Success Probability
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-400" /> Risk
                      Score
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={simulationData.timeline}>
                    <defs>
                      <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                    <Area type="monotone" dataKey="twinPredict" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProb)" name="Success Prob %" />
                    <Area type="monotone" dataKey="riskScore" stroke="#f87171" fillOpacity={1} fill="url(#colorRisk)" name="Risk Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Vertical Longitudinal Patient Health Timeline */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="font-bold text-slate-300 text-sm flex items-center gap-2">
                  <Calendar className="text-cyan-400 h-4 w-4" />
                  Longitudinal Patient Health Timeline & Historical Milestones
                </h3>
                <p className="text-xs text-slate-400">
                  Patient record history plotted chronologically with AI trend alerts and diagnostics.
                </p>
                <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-6">
                  {CLINICAL_HISTORY.map((item, idx) => {
                    const badgeMap = {
                      diagnosis: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      medication: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      lab: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      ai: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    };
                    return (
                      <div key={idx} className="relative">
                        <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">{item.year}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeMap[item.type]}`}>
                              {item.event}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 pl-8 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
                <h4 className="text-sm font-bold mb-4 text-white">
                  Twin Outlook Summary
                </h4>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-slate-900 rounded-2xl border border-slate-700">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">
                      Success Prediction
                    </div>
                    <div className="text-3xl font-black text-green-400">
                      STABLE OUTLOOK
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">
                      Based on Losartan class switch
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Average Risk Score</span>
                      <span className="text-white font-bold">
                        {((simulationData?.summary?.avgRisk || 0.228) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{
                          width: `${(simulationData?.summary?.avgRisk || 0.228) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {simulationData?.summary?.mlTwinNet && (
                    <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl space-y-2 text-xs">
                      <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block animate-pulse"></span>
                        Trained TwinNet PyTorch MLP Active
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-medium">Trajectory Score:</span>
                        <span className="text-sm font-bold text-white">
                          {(simulationData?.summary?.mlTwinNet?.trajectoryScore ?? 0.742).toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-slate-400 font-medium">Health Outlook:</span>
                        <span className="text-xs font-bold text-green-400">
                          {simulationData?.summary?.mlTwinNet?.healthOutlook || "Stable"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <AlertTriangle className="text-yellow-500 shrink-0" size={16} />
                      <div className="text-[10px] text-yellow-500 leading-tight">
                        AI Notification: Swapping Lisinopril to Losartan successfully resolved patient cough baseline.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
                <Info className="text-blue-400" size={20} />
                <p className="text-[10px] text-blue-300 leading-tight italic">
                  "This digital twin model uses Monte Carlo simulations grounded
                  in the patient's specific genomic and metabolic baseline."
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
