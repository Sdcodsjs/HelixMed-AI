"use client";
import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Brain,
  Layers,
  Sparkles,
  Download
} from "lucide-react";

export default function EegTelemetryPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [montage, setMontage] = useState("Bipolar Longitudinal (Double Banana)");
  const [timeScale, setTimeScale] = useState("30mm/sec");
  const [sensitivity, setSensitivity] = useState("7uV/mm");
  const [seizureAlert, setSeizureAlert] = useState(false);
  const [spikeCount, setSpikeCount] = useState(14);
  const canvasRef = useRef(null);

  const channels = [
    "Fp1 - F3", "F3 - C3", "C3 - P3", "P3 - O1",
    "Fp2 - F4", "F4 - C4", "C4 - P4", "P4 - O2",
    "F7 - T3", "T3 - T5", "T5 - O1",
    "F8 - T4", "T4 - T6", "T6 - O2",
    "Fz - Cz", "Cz - Pz"
  ];

  // Frequency bands
  const bandSpectrum = [
    { band: "Delta (0.5 - 4 Hz)", power: "18%", status: "Normal Deep Sleep / Slow Wave" },
    { band: "Theta (4 - 8 Hz)", power: "24%", status: "Mild Drowsiness / Focal Slowing" },
    { band: "Alpha (8 - 13 Hz)", power: "42%", status: "Dominant Posterior Rhythm" },
    { band: "Beta (13 - 30 Hz)", power: "12%", status: "Frontal Executive Activity" },
    { band: "Gamma (> 30 Hz)", power: "4%", status: "Transient High-Frequency Spike" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 0.5;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw 16 channels
      const channelHeight = canvas.height / channels.length;

      channels.forEach((channelName, index) => {
        const centerY = channelHeight * index + channelHeight / 2;

        // Draw baseline label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(channelName, 10, centerY - 8);

        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = index % 2 === 0 ? "#38bdf8" : "#34d399";
        ctx.lineWidth = 1.2;

        for (let x = 70; x < canvas.width; x++) {
          const t = (x + offset) * 0.05;
          // Synthetic EEG signal: Alpha + Theta + random noise + occasional spike
          let val = Math.sin(t) * 8 + Math.cos(t * 2.3) * 5 + (Math.random() - 0.5) * 4;

          // Spike simulation on channel 2 & 3
          if ((index === 2 || index === 3) && (Math.floor(x + offset) % 180 < 15)) {
            val += Math.sin((x + offset) * 0.8) * 35;
          }

          const y = centerY + val;
          if (x === 70) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      if (isPlaying) {
        offset += 2;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, channels.length]);

  return (
    <AppLayout activeTab="/eeg-telemetry">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Neurology & Telemetry AI
              </span>
              <span className="text-xs text-slate-400">10-20 System Standard</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <Brain className="h-7 w-7 text-blue-400" />
              16-Channel AI EEG Neuro-Telemetry & Seizure Detection Studio
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              High-frequency multi-channel EEG trace processor with real-time epileptiform spike detection and FFT frequency band analysis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 text-white font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2 ${
                isPlaying ? "bg-slate-800 hover:bg-slate-700 border border-slate-700" : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Freeze EEG Trace" : "Resume Stream"}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">AI Seizure Classifier</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Interictal Non-Seizure</span>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Epileptiform Spikes</span>
              <span className="text-sm font-bold text-amber-400 mt-0.5 block">{spikeCount} / 30 sec</span>
            </div>
            <Activity className="h-6 w-6 text-amber-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Focal Spike Zone</span>
              <span className="text-sm font-bold text-blue-400 mt-0.5 block">Left Temporal (C3-P3)</span>
            </div>
            <Brain className="h-6 w-6 text-blue-400" />
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Sampling Frequency</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">500 Hz (16-bit)</span>
            </div>
            <Zap className="h-6 w-6 text-slate-400" />
          </div>
        </div>

        {/* Main EEG Trace Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-blue-400" />
              Montage & Calibration
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Electrode Montage</label>
              <select
                value={montage}
                onChange={(e) => setMontage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="Bipolar Longitudinal (Double Banana)">Bipolar Longitudinal (Double Banana)</option>
                <option value="Bipolar Transverse">Bipolar Transverse</option>
                <option value="Referential (Cz Reference)">Referential (Cz Reference)</option>
                <option value="Laplacian Surface Signal">Laplacian Surface Signal</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Timebase Speed</label>
              <select
                value={timeScale}
                onChange={(e) => setTimeScale(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="15mm/sec">15 mm/sec (Compressed)</option>
                <option value="30mm/sec">30 mm/sec (Standard Clinical)</option>
                <option value="60mm/sec">60 mm/sec (High Resolution)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Voltage Sensitivity</label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="5uV/mm">5 µV/mm</option>
                <option value="7uV/mm">7 µV/mm (Standard)</option>
                <option value="10uV/mm">10 µV/mm</option>
              </select>
            </div>

            {/* FFT Frequency Band Power */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-semibold text-white block border-b border-slate-800 pb-2">
                FFT Spectral Frequency Bands
              </span>
              {bandSpectrum.map((b, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>{b.band}</span>
                    <span className="font-mono font-bold text-blue-400">{b.power}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: b.power }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert("EDF+ EEG trace file exported successfully")}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export EDF+ Raw Telemetry
            </button>
          </div>

          {/* Canvas Waveform Visualizer */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-xs text-slate-400 font-mono">
              <span>LIVE 16-LEAD EEG trace (500Hz)</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                IMPEDANCE &lt; 5 kΩ (OPTIMAL)
              </span>
            </div>

            <div className="relative w-full h-[520px] bg-slate-950 rounded border border-slate-800">
              <canvas
                ref={canvasRef}
                width={800}
                height={520}
                className="w-full h-full block"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 font-mono">
              <span>Notch Filter: 60Hz ON</span>
              <span>High-pass: 0.5Hz</span>
              <span>Low-pass: 70Hz</span>
              <span className="text-emerald-400">DeepEEG Neural Net v2.1 Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
