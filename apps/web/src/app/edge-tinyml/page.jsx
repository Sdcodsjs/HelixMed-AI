"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Watch,
  Cpu,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  PhoneCall,
  Sliders,
  Play,
  RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default function EdgeTinyMLPage() {
  const [isSimulating, setIsSimulating] = useState(true);
  const [anomalyType, setAnomalyType] = useState("Normal Gait Motion");
  const [dispatchStatus, setDispatchStatus] = useState("Idle (Monitoring)");
  const [accelData, setAccelData] = useState([
    { t: 0, x: 0.1, y: 9.8, z: 0.2 },
    { t: 1, x: 0.2, y: 9.7, z: 0.3 },
    { t: 2, x: 0.15, y: 9.85, z: 0.25 },
    { t: 3, x: 0.3, y: 9.6, z: 0.4 },
  ]);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setAccelData((prev) => {
        const nextT = prev.length;
        const isAnomaly = Math.random() < 0.15;
        const newX = parseFloat((isAnomaly ? Math.random() * 8 : Math.random() * 0.4).toFixed(2));
        const newY = parseFloat((isAnomaly ? 15 + Math.random() * 10 : 9.8 + (Math.random() - 0.5) * 0.4).toFixed(2));
        const newZ = parseFloat((isAnomaly ? Math.random() * 6 : Math.random() * 0.3).toFixed(2));

        if (isAnomaly) {
          setAnomalyType("CRITICAL FALL DETECTED (3.8G Acceleration Spike)");
          setDispatchStatus("ALERT DISPATCHED TO EMERGENCY CONTACTS");
        }

        const updated = [...prev.slice(-15), { t: nextT, x: newX, y: newY, z: newZ }];
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const triggerFallSimulation = () => {
    setAnomalyType("SIMULATED FALL ANOMALY TRIGGERED (4.2G Peak)");
    setDispatchStatus("EMERGENCY DISPATCH INITIATED (GPS: 37.7749, -122.4194)");
    setAccelData((prev) => [
      ...prev,
      { t: prev.length, x: 4.2, y: 22.4, z: 8.1 },
      { t: prev.length + 1, x: 1.1, y: 3.2, z: 1.0 },
    ]);
  };

  return (
    <AppLayout activeTab="edge-tinyml">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Cpu className="text-emerald-400" size={26} />
              Smart Wearable Edge-AI Anomaly Detector (TinyML)
            </h2>
            <p className="text-slate-400 text-sm">
              Simulates on-device TinyML neural networks running on smartwatches for offline fall detection & seizure emergency dispatching.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerFallSimulation}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-red-500/30"
            >
              <ShieldAlert size={16} /> Simulate Fall Spike (4.2G)
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">On-Device TinyML Engine</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={18} /> TensorFlow Lite Micro
            </div>
            <div className="text-[10px] text-slate-400 mt-1">14 KB RAM Memory Footprint</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Sampling Frequency</div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">100 Hz</div>
            <div className="text-[10px] text-slate-400 mt-1">3-Axis IMU (Accel + Gyro)</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Anomaly Detection Status</div>
            <div className="text-sm font-extrabold text-amber-400">{anomalyType}</div>
            <div className="text-[10px] text-slate-400 mt-1">Latency: 1.2ms (On-Device)</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Emergency Dispatch</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              <PhoneCall size={14} className="text-emerald-400" /> {dispatchStatus}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">GPS Geofence Synced</div>
          </div>
        </div>

        {/* Live 3-Axis Accelerometer Signal Graph */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Watch size={20} className="text-emerald-400" />
                3-Axis Live Accelerometer Sensor Telemetry (X, Y, Z Coordinates)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time IMU gravity vector stream sampled at 100Hz</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Offline Edge Execution
            </span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="t" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", fontSize: "11px" }} />
                <Line type="monotone" dataKey="x" stroke="#38bdf8" strokeWidth={2} name="X-Axis Accel (m/s²)" />
                <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2.5} name="Y-Axis Accel (m/s²)" />
                <Line type="monotone" dataKey="z" stroke="#f43f5e" strokeWidth={2} name="Z-Axis Accel (m/s²)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
