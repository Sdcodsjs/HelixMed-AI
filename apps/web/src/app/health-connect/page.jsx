"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Watch,
  Activity,
  Heart,
  Moon,
  Footprints,
  Wind,
  Brain,
  ShieldAlert,
  Send,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

export default function HealthConnectPage() {
  const [heartRate, setHeartRate] = useState(78);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [steps, setSteps] = useState(8420);
  const [spO2, setSpO2] = useState(98);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  const syncWatchData = async (overrideVitals = null) => {
    setSyncing(true);
    try {
      const payload = overrideVitals || { heartRate, sleepHours, steps, spO2 };
      const res = await fetch("/api/ai/patient-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setLastSyncResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const triggerAbnormalVitals = () => {
    setHeartRate(134);
    setSpO2(89);
    syncWatchData({ heartRate: 134, sleepHours: 4.2, steps: 2100, spO2: 89 });
  };

  return (
    <AppLayout activeTab="health-connect">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Watch className="text-blue-400" size={24} />
              Android HealthConnect & Wearable Watch Integration ("Patient Brain Sync")
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Monitors real-time wearable telemetry & grounds AI conversational context in PostgreSQL Patient Brain.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerAbnormalVitals}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold px-4 py-2 rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle size={15} /> Simulate Tachycardia / Low SpO2 Burst
            </button>
          </div>
        </div>

        {/* Telemetry Stream & Sync Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Vitals Input / Watch Sensor Telemetry */}
          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Activity className="text-emerald-400" size={20} /> Wearable Sensors (HealthConnect Sync)
              </h3>
              <button
                onClick={() => syncWatchData()}
                disabled={syncing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                {syncing ? <RefreshCw className="animate-spin" size={14} /> : <Watch size={14} />}
                Sync to Patient Brain
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Heart size={14} className="text-red-400" /> Heart Rate
                  </span>
                  <span className="font-mono text-red-400 font-bold">{heartRate} BPM</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max={160}
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Wind size={14} className="text-cyan-400" /> Oxygen Saturation (SpO2)
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{spO2}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max={100}
                  value={spO2}
                  onChange={(e) => setSpO2(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Moon size={14} className="text-purple-400" /> Sleep Duration
                  </span>
                  <span className="font-mono text-purple-400 font-bold">{sleepHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max={12}
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Footprints size={14} className="text-emerald-400" /> Daily Steps
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{steps}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max={20000}
                  step="500"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Patient Brain & Doctor Workspace Task Queue Status */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Brain className="text-purple-400" size={18} /> PostgreSQL "Patient Brain" Memory Status
              </h3>

              {lastSyncResult ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Context Grounded:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Sync Timestamp:</span>
                    <span className="text-slate-200 font-mono">{lastSyncResult.timestamp}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic p-4 bg-slate-900/50 rounded-xl text-center">
                  Click "Sync to Patient Brain" to ground AI conversational context.
                </div>
              )}
            </div>

            {/* Doctor Workspace Task Queue Escalation */}
            {lastSyncResult?.taskQueueEscalation && (
              <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-red-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert size={16} /> DOCTOR WORKSPACE TASK QUEUE ESCALATION
                  </span>
                  <span className="bg-red-500/20 px-2 py-0.5 rounded text-[10px]">
                    {lastSyncResult.taskQueueEscalation.taskId}
                  </span>
                </div>
                <div className="text-xs text-slate-200 space-y-1">
                  <div><strong>Assignee:</strong> {lastSyncResult.taskQueueEscalation.assignee}</div>
                  <div><strong>Action Required:</strong> {lastSyncResult.taskQueueEscalation.actionRequired}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
