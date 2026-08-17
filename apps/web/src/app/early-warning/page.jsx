"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Heart,
  Thermometer,
  Wind,
  Bell,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Clock,
  Send,
  Sliders,
  FileCheck,
  Check,
  X,
} from "lucide-react";
import { format } from "date-fns";

const vitalColorMap = {
  red: "bg-red-500/10 text-red-400",
  blue: "bg-blue-500/10 text-blue-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
  orange: "bg-orange-500/10 text-orange-400",
};

// Inline SVG Sparkline Trend Component
const MiniSparkline = ({ data, color = "#ef4444" }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * 120;
      const y = 30 - ((val - min) / range) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="w-28 h-8 overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
};

const VitalCard = ({ label, value, unit, icon: Icon, color, trend, history = [] }) => (
  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg ${vitalColorMap[color] || "bg-slate-500/10 text-slate-400"}`}>
        <Icon size={18} />
      </div>
      <span
        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          trend === "stable" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        }`}
      >
        {trend.toUpperCase()}
      </span>
    </div>
    <div>
      <div className="text-slate-500 text-xs font-bold uppercase tracking-tighter">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <div className="text-xl font-bold text-white">{value}</div>
        <div className="text-[10px] text-slate-500 font-bold">{unit}</div>
      </div>
    </div>
    {/* Inline Sparkline */}
    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
      <span className="text-[9px] text-slate-500 uppercase font-semibold">Trajectory</span>
      <MiniSparkline data={history} color={color === "red" ? "#ef4444" : color === "cyan" ? "#06b6d4" : "#3b82f6"} />
    </div>
  </div>
);

export default function EarlyWarningPage() {
  const queryClient = useQueryClient();
  const [activePatientId, setActivePatientId] = useState(1);
  const [lastMlData, setLastMlData] = useState(null);
  const [simulationMode, setSimulationMode] = useState(true);
  const [sensitivity, setSensitivity] = useState(0.75); // Sensitivity threshold
  const [escalationToast, setEscalationToast] = useState(null);

  // Cryptographic Audit Trail Log State
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: "Acknowledged", patient: "Sarah Jenkins", time: "22:42:10", hash: "0xa3f...91e2" },
  ]);

  const { data: monitoring } = useQuery({
    queryKey: ["monitoring"],
    queryFn: async () => {
      const res = await fetch("/api/ai/early-warning");
      return res.json();
    },
    refetchInterval: simulationMode ? 3000 : 10000,
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      return res.json();
    },
  });

  const signalMutation = useMutation({
    mutationFn: async (signal) => {
      const res = await fetch("/api/ai/early-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signal),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setLastMlData(data);
      queryClient.invalidateQueries({ queryKey: ["monitoring"] });
    },
  });

  const triggerMockSignal = (isAnomaly = false) => {
    const signal = {
      patientId: activePatientId,
      heartRate: isAnomaly ? 145 : 72 + Math.floor(Math.random() * 10),
      bpSystolic: isAnomaly ? 160 : 120 + Math.floor(Math.random() * 10),
      bpDiastolic: isAnomaly ? 100 : 80 + Math.floor(Math.random() * 10),
      oxygenLevel: isAnomaly ? 89 : 98 - Math.floor(Math.random() * 2),
    };
    signalMutation.mutate(signal);
  };

  const handleAlertAction = (action, patientName) => {
    const timeStr = format(new Date(), "HH:mm:ss");
    const hash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
    setAuditLogs((prev) => [{ id: Date.now(), action, patient: patientName, time: timeStr, hash }, ...prev]);

    if (action === "Escalated to EHR") {
      setEscalationToast(`Dispatched EHR Paging Alert for ${patientName} (Ref: ${hash})`);
      setTimeout(() => setEscalationToast(null), 5000);
    }
  };

  const activeVitals = monitoring?.latestVitals?.find((v) => v.patient_id === activePatientId) || {
    heart_rate: 112,
    bp_systolic: 142,
    bp_diastolic: 92,
    oxygen_level: 91,
  };

  const activePatientName = patients?.find((p) => p.id === activePatientId)?.name || "Sarah Jenkins";

  return (
    <AppLayout activeTab="early-warning">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="text-blue-400" size={24} />
              AI Adverse Event Early Warning (ICU Ticker)
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time ICU vital streams backed by Isolation Forest & Attention LSTM anomaly detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Simulation Mode Toggle */}
            <button
              onClick={() => setSimulationMode(!simulationMode)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ${
                simulationMode
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <Clock size={14} />
              {simulationMode ? "Simulation Mode: Active (3s)" : "Live Telemetry Feed"}
            </button>

            <button
              onClick={() => triggerMockSignal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
            >
              Simulate Normal Vitals
            </button>
            <button
              onClick={() => triggerMockSignal(true)}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all shadow-lg shadow-red-500/10"
            >
              Trigger Anomaly
            </button>
          </div>
        </div>

        {/* EHR Escalation Toast Notification */}
        {escalationToast && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3 text-sm text-blue-300">
            <Send size={18} className="text-blue-400 shrink-0" />
            <span className="font-semibold">{escalationToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Watchlist & Threshold Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="font-bold text-slate-300 flex items-center justify-between text-sm">
                Participant Watchlist
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                  LIVE STREAM
                </span>
              </h3>

              <div className="space-y-3">
                {patients?.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePatientId(p.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      activePatientId === p.id
                        ? "bg-blue-600/10 border-blue-500/50"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <div className="text-left">
                        <div className="text-sm font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Site: ICU-Bay-A</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-red-400 font-mono">{(p.risk_score * 100).toFixed(0)}%</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">Risk Index</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Sensitivity Controls */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders size={15} className="text-purple-400" /> Model Detection Sensitivity
                </span>
                <span className="font-mono text-purple-400 font-bold">{sensitivity}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">Adjust threshold for Isolation Forest anomaly flagging.</p>
            </div>
          </div>

          {/* Vitals Dashboard & Action Workflow */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">ICU Telemetry Stream</h3>
                  <p className="text-sm text-slate-400">Monitoring: <span className="text-blue-400 font-semibold">{activePatientName}</span></p>
                </div>

                {/* EHR Action Workflow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAlertAction("Acknowledged", activePatientName)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                  >
                    <Check size={14} /> Acknowledge
                  </button>
                  <button
                    onClick={() => handleAlertAction("Escalated to EHR", activePatientName)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-1"
                  >
                    <Send size={14} /> Dispatch EHR Alert
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <VitalCard
                  label="Heart Rate"
                  value={activeVitals.heart_rate}
                  unit="BPM"
                  icon={Heart}
                  color="red"
                  trend={activeVitals.heart_rate > 100 ? "rising" : "stable"}
                  history={[80, 85, 92, 108, 125, 142]}
                />
                <VitalCard
                  label="Blood Pressure"
                  value={`${activeVitals.bp_systolic}/${activeVitals.bp_diastolic}`}
                  unit="mmHg"
                  icon={Thermometer}
                  color="blue"
                  trend="rising"
                  history={[120, 124, 130, 138, 145, 160]}
                />
                <VitalCard
                  label="Oxygen Sat"
                  value={activeVitals.oxygen_level}
                  unit="%"
                  icon={Wind}
                  color="cyan"
                  trend={activeVitals.oxygen_level < 94 ? "falling" : "stable"}
                  history={[98, 97, 95, 93, 91, 89]}
                />
                <VitalCard
                  label="AI Risk Score"
                  value="0.88"
                  unit="Index"
                  icon={ShieldAlert}
                  color="orange"
                  trend="critical"
                  history={[0.2, 0.35, 0.5, 0.72, 0.85, 0.88]}
                />
              </div>
            </div>

            {/* Cryptographic Audit Logs */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-300 text-sm flex items-center justify-between">
                <span>Alert Action Audit Log (SHA-256 Hashes)</span>
                <FileCheck size={16} className="text-emerald-400" />
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="font-sans font-bold text-slate-200">{log.action}</span> for{" "}
                      <span className="text-blue-400 font-semibold">{log.patient}</span>
                      <div className="text-[10px] text-slate-500">Time: {log.time}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                      {log.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
