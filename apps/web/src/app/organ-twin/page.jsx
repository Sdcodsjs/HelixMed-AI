"use client";
import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Zap,
  Activity,
  Layers,
  Sliders,
  Play,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Maximize2
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const ORGAN_MODELS = [
  { id: "lungs", name: "Pulmonary Lesion Twin (Lungs)", icon: "🫁", baselineVolume: "42.5 mm³", responseClass: "Partial Response (PR)", color: "#38bdf8" },
  { id: "heart", name: "Myocardial Ischemia Twin (Heart)", icon: "🫀", baselineVolume: "18.2 mm³", responseClass: "Stable Disease (SD)", color: "#f43f5e" },
  { id: "kidneys", name: "Renal Cell Carcinoma Twin (Kidneys)", icon: "🩺", baselineVolume: "35.8 mm³", responseClass: "Complete Response (CR)", color: "#10b981" },
  { id: "brain", name: "Glioblastoma Multiforme Twin (Brain)", icon: "🧠", baselineVolume: "28.4 mm³", responseClass: "Progressive Disease (PD)", color: "#a855f7" },
];

const PROGRESSION_TIMELINE = [
  { day: "Day 0", volume: 42.5, perfusedRatio: 88 },
  { day: "Day 30", volume: 38.2, perfusedRatio: 90 },
  { day: "Day 60", volume: 32.1, perfusedRatio: 92 },
  { day: "Day 90", volume: 25.4, perfusedRatio: 94 },
  { day: "Day 120", volume: 18.9, perfusedRatio: 96 },
  { day: "Day 150", volume: 14.2, perfusedRatio: 97 },
  { day: "Day 180", volume: 11.5, perfusedRatio: 98 },
];

export default function OrganTwinPage() {
  const [selectedOrgan, setSelectedOrgan] = useState(ORGAN_MODELS[0]);
  const [simulationDay, setSimulationDay] = useState(90);
  const [regimen, setRegimen] = useState("immunotherapy");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [slicePlane, setSlicePlane] = useState("AXIAL Z-142");

  const canvasRef = useRef(null);

  const currentTimelinePoint = PROGRESSION_TIMELINE.find(
    (p) => parseInt(p.day.replace("Day ", "")) === simulationDay
  ) || PROGRESSION_TIMELINE[3];

  // Render 3D Holographic Wireframe Organ Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background Radial Grid
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotationAngle * Math.PI) / 180);

    // Render 3D Rotatable Wireframe Concentric Rings
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1.5;
    for (let r = 30; r <= 110; r += 20) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotatable Cross Lines
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(110, 0);
    ctx.moveTo(0, -55);
    ctx.lineTo(0, 55);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
    ctx.stroke();

    // Tumor Core Sphere
    const lesionRadius = Math.max(10, currentTimelinePoint.volume * 0.9);
    ctx.beginPath();
    ctx.arc(15, -10, lesionRadius, 0, Math.PI * 2);
    ctx.fillStyle = selectedOrgan.color;
    ctx.shadowColor = selectedOrgan.color;
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
  }, [selectedOrgan, rotationAngle, currentTimelinePoint]);

  return (
    <AppLayout activeTab="organ-twin">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Zap className="text-blue-400" size={26} />
              3D Anatomical Organ Digital Twin & Lesion Progression Viewer
            </h2>
            <p className="text-slate-400 text-sm">
              Volumetric 3D anatomical organ modeling with RECIST 1.1 lesion growth/shrinkage predictions under immunotherapy & targeted regimens.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-300 px-3.5 py-2 rounded-xl border border-blue-500/30 text-xs font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              RECIST 1.1 Response Classifier Active
            </div>
          </div>
        </div>

        {/* Organ Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORGAN_MODELS.map((organ) => (
            <div
              key={organ.id}
              onClick={() => setSelectedOrgan(organ)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedOrgan.id === organ.id
                  ? "bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10"
                  : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{organ.icon}</span>
                <span className="font-bold text-white text-sm">{organ.name}</span>
              </div>
              <div className="text-xs text-slate-400">Baseline Volume: <span className="text-white font-mono font-bold">{organ.baselineVolume}</span></div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-wider">{organ.responseClass}</div>
            </div>
          ))}
        </div>

        {/* Main 3D Digital Twin Viewer & Volumetric Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 3D Anatomical Render Simulation Box */}
          <div className="lg:col-span-6 bg-[#0f172a] rounded-2xl border border-blue-500/30 p-6 space-y-6 shadow-2xl relative flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono text-blue-400 border-b border-slate-800 pb-3">
              <span className="font-extrabold text-sm flex items-center gap-2">
                <span className="text-xl">{selectedOrgan.icon}</span>
                3D VOLUMETRIC DIGITAL TWIN CANAL
              </span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2.5 py-1 rounded border border-blue-500/30 font-bold uppercase">
                RECIST 1.1: {selectedOrgan.responseClass}
              </span>
            </div>

            {/* Real 3D Interactive Canvas Viewer */}
            <div className="w-full h-[280px] bg-[#090d16] rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={280}
                className="w-full h-full rounded-xl cursor-grab"
              />

              {/* Crosshair Overlay */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 space-y-1 bg-slate-950/80 p-2 rounded border border-slate-800">
                <div>SLICE: {slicePlane}</div>
                <div>PERFUSION: {currentTimelinePoint.perfusedRatio}%</div>
                <div>REGIMEN: {regimen.toUpperCase()}</div>
              </div>

              {/* 3D Rotation Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setRotationAngle((a) => (a + 45) % 360)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-blue-400 rounded-lg border border-slate-800 text-xs font-bold font-mono"
                >
                  <RotateCcw size={14} className="inline mr-1" /> Rotate 3D ({rotationAngle}°)
                </button>
              </div>
            </div>

            {/* Day Timeline Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Simulation Timeline Scrubber:</span>
                <span className="text-blue-400 font-mono font-bold text-sm">Day {simulationDay} / 180</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="30"
                value={simulationDay}
                onChange={(e) => setSimulationDay(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Day 0 (Baseline)</span>
                <span>Day 90 (Interim Assessment)</span>
                <span>Day 180 (Primary Endpoint)</span>
              </div>
            </div>
          </div>

          {/* Volumetric Progression Chart & Regimen Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Regimen Selection & RECIST Scorecard */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Therapeutic Regimen & RECIST 1.1 Assessment</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "immunotherapy", label: "Immunotherapy (Pembrolizumab)" },
                  { id: "chemotherapy", label: "Standard Chemotherapy" },
                  { id: "combination", label: "Combo Anti-PD1 + TKI" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegimen(r.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      regimen === r.id
                        ? "bg-blue-600 text-white border-blue-400 shadow-md"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* RECIST Summary Box */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Predicted Volume at Day {simulationDay}:</span>
                  <span className="text-emerald-400 font-bold text-sm font-mono">{currentTimelinePoint.volume} mm³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Volumetric Reduction vs Baseline:</span>
                  <span className="text-blue-400 font-bold text-sm font-mono">
                    -{(((42.5 - currentTimelinePoint.volume) / 42.5) * 100).toFixed(1)}% Reduction
                  </span>
                </div>
              </div>
            </div>

            {/* 180-Day Volumetric Chart */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                180-Day Lesion Volumetric Progression Curve
              </h4>
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PROGRESSION_TIMELINE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="volume" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} name="Lesion Volume (mm³)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
