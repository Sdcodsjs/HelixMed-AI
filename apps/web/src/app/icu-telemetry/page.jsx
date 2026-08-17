"use client";
import React, { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import {
  HeartPulse,
  Activity,
  Zap,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  BedDouble
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

export default function ICUTelemetryPage() {
  const { activePatient } = usePatient();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [heartRate, setHeartRate] = useState(118);
  const [spO2, setSpO2] = useState(93);
  const [qtcInterval, setQtcInterval] = useState(442);
  const [sweepSpeed, setSweepSpeed] = useState(25); // mm/s
  const [gainLevel, setGainLevel] = useState(10); // mm/mV
  const [arrhythmiaAlert, setArrhythmiaAlert] = useState("Sinus Tachycardia with Occasional PACs");
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Web Audio API Audio Beep Trigger
  const triggerAudioBeep = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz A5 pitch
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let x = 0;
    const points = [];

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const generateECGPoint = (t) => {
      const cycle = t % 100;
      if (cycle > 40 && cycle < 46) return midY - 15 * (gainLevel / 10); // P wave
      if (cycle >= 46 && cycle < 50) return midY + 5 * (gainLevel / 10);  // Q wave
      if (cycle >= 50 && cycle < 56) {
        if (cycle === 50) triggerAudioBeep(); // Audio beep on R-peak
        return midY - 70 * (gainLevel / 10); // R wave peak
      }
      if (cycle >= 56 && cycle < 60) return midY + 25 * (gainLevel / 10); // S wave dip
      if (cycle >= 70 && cycle < 82) return midY - 20 * (gainLevel / 10); // T wave
      return midY + (Math.random() - 0.5) * 3; // Baseline noise
    };

    let tick = 0;
    const speedFactor = sweepSpeed / 25;

    const render = () => {
      if (!isPlaying) return;

      tick += 1.5 * speedFactor;
      x = (x + 2 * speedFactor) % width;
      const y = generateECGPoint(tick);

      points[Math.floor(x)] = y;

      // Draw background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw Hospital Monitor Grid
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw Waveform Line
      ctx.beginPath();
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 8;

      let started = false;
      for (let i = 0; i < width; i++) {
        if (points[i] !== undefined) {
          if (Math.abs(i - x) < 10) {
            ctx.stroke();
            ctx.beginPath();
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(i, points[i]);
            started = true;
          } else {
            ctx.lineTo(i, points[i]);
          }
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Scanner Head Circle
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(x, points[Math.floor(x)] || midY, 4, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, sweepSpeed, gainLevel, isMuted]);

  return (
    <AppLayout activeTab="icu-telemetry">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <HeartPulse className="text-red-500 animate-pulse" size={26} />
              ICU High-Frequency ECG Waveform & Telemetry Studio
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time 250Hz multi-lead ECG oscilloscope stream with Web Audio API sound synthesized monitor beeps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400 animate-pulse" />}
              {isMuted ? "Beep Audio Muted" : "Beep Audio Active (880Hz)"}
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-blue-500/30"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? "Freeze Waveform" : "Resume Stream"}
            </button>
          </div>
        </div>

        {/* ICU Bed Profile Context Banner */}
        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <BedDouble size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">ICU Bed 04 — {activePatient?.name || "Sarah Jenkins"}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  Telemetry Alert Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                MRN: {activePatient?.mrn || "MRN-908124"} • Attending: Dr. A. Wright, MD • Monitor Model: Mindray BeneVision N22
              </p>
            </div>
          </div>

          {/* Sweep Speed & Gain Selectors */}
          <div className="flex items-center gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">SWEEP SPEED:</span>
              <select
                value={sweepSpeed}
                onChange={(e) => setSweepSpeed(Number(e.target.value))}
                className="bg-slate-900 text-emerald-400 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs font-bold"
              >
                <option value={12.5}>12.5 mm/s</option>
                <option value={25}>25 mm/s (Standard)</option>
                <option value={50}>50 mm/s (Fast)</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold block text-[10px]">GAIN AMPLITUDE:</span>
              <select
                value={gainLevel}
                onChange={(e) => setGainLevel(Number(e.target.value))}
                className="bg-slate-900 text-blue-400 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs font-bold"
              >
                <option value={5}>5 mm/mV</option>
                <option value={10}>10 mm/mV (Standard)</option>
                <option value={20}>20 mm/mV (High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Waveform Canvas Monitor */}
        <div className="bg-[#090d16] rounded-2xl border border-emerald-500/30 p-6 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-emerald-400 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm tracking-wider">LEAD II ECG — LIVE OSCILLOSCOPE</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                SWEEP: {sweepSpeed} mm/s
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>GAIN: {gainLevel} mm/mV</span>
              <span className="text-slate-400">FILTER: 0.5 - 40 Hz</span>
            </div>
          </div>

          {/* HTML5 Canvas Waveform */}
          <div className="w-full h-[240px] relative">
            <canvas
              ref={canvasRef}
              width={1000}
              height={240}
              className="w-full h-full rounded-xl cursor-crosshair"
            />
          </div>

          {/* Monitor Footer Alarm Status */}
          <div className="pt-3 border-t border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertCircle size={16} />
              <span>Arrhythmia Engine: {arrhythmiaAlert}</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              QRS Width: 88ms • PR Interval: 154ms • QTc: {qtcInterval}ms
            </div>
          </div>
        </div>

        {/* Live Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Heart Rate (HR)</div>
            <div className="text-3xl font-extrabold text-red-400 font-mono flex items-baseline gap-1">
              {heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
            </div>
            <div className="text-[10px] text-red-400 font-bold">↑ Tachycardia Warning</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">SpO2 Oxygen</div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono flex items-baseline gap-1">
              {spO2} <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="text-[10px] text-amber-400 font-bold">↓ Mild Hypoxia Threshold</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Blood Pressure</div>
            <div className="text-3xl font-extrabold text-blue-400 font-mono">142/92</div>
            <div className="text-[10px] text-blue-400 font-bold">Stage 1 Hypertension</div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">QTc Interval</div>
            <div className="text-3xl font-extrabold text-purple-400 font-mono flex items-baseline gap-1">
              {qtcInterval} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-purple-400 font-bold">Normal Range (&lt;450ms)</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
