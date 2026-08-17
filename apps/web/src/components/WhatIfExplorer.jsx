"use client";
import React, { useState } from "react";
import { Sliders, ArrowUpRight, ArrowDownRight, Activity, HelpCircle } from "lucide-react";

const INITIAL_FEATURES = [
  { id: "glucose", name: "Glucose Level (mg/dL)", base: 140, current: 140, min: 70, max: 250, shapPct: 33.02, unit: "mg/dL" },
  { id: "bmi", name: "BMI (Body Mass Index)", base: 34.2, current: 34.2, min: 18.5, max: 50, shapPct: 24.51, unit: "kg/m²" },
  { id: "age", name: "Patient Age", base: 54, current: 54, min: 20, max: 85, shapPct: 18.15, unit: "yrs" },
  { id: "bp", name: "Blood Pressure (mmHg)", base: 82, current: 82, min: 50, max: 130, shapPct: 12.80, unit: "mmHg" },
  { id: "insulin", name: "Insulin (mu U/ml)", base: 120, current: 120, min: 0, max: 350, shapPct: 11.52, unit: "mu U/ml" },
];

export default function WhatIfExplorer() {
  const [features, setFeatures] = useState(INITIAL_FEATURES);

  const handleValueChange = (id, val) => {
    const num = Number(val);
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, current: num } : f))
    );
  };

  const resetValues = () => {
    setFeatures((prev) => prev.map((f) => ({ ...f, current: f.base })));
  };

  // Calculate dynamic risk adjustment score based on feature deltas
  const baseRisk = 68.4;
  const deltaSum = features.reduce((acc, f) => {
    const deltaRatio = (f.current - f.base) / (f.max - f.min);
    return acc + deltaRatio * (f.shapPct * 0.8);
  }, 0);

  const adjustedRisk = Math.min(99.9, Math.max(1.0, baseRisk + deltaSum));
  const riskDelta = adjustedRisk - baseRisk;

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-purple-400" size={22} />
            <h3 className="text-xl font-bold text-white">Counterfactual "What-If" SHAP Explorer</h3>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Simulate how modifying individual patient clinical metrics impacts calculated risk in real-time.
          </p>
        </div>
        <button
          onClick={resetValues}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          Reset to Baseline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Adjust Clinical Inputs
          </h4>
          {features.map((f) => {
            const hasChanged = f.current !== f.base;
            return (
              <div key={f.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{f.name}</span>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      SHAP: {f.shapPct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-xs">Base: {f.base}</span>
                    <span className={`font-bold ${hasChanged ? "text-amber-400" : "text-slate-300"}`}>
                      {f.current} {f.unit}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  value={f.current}
                  onChange={(e) => handleValueChange(f.id, e.target.value)}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* SHAP Impact Waterfall & Calculated Risk Delta */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4 text-center">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Simulated Risk Impact
            </h4>
            <div className="space-y-1">
              <div className="text-4xl font-extrabold text-white font-mono">
                {(adjustedRisk || 0).toFixed(1)}%
              </div>
              <div className="flex items-center justify-center gap-1 text-xs">
                {riskDelta !== 0 && (
                  <span
                    className={`flex items-center font-bold px-2 py-0.5 rounded ${
                      riskDelta > 0
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {riskDelta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {riskDelta > 0 ? `+${(riskDelta || 0).toFixed(1)}%` : `${(riskDelta || 0).toFixed(1)}%`} vs Baseline
                  </span>
                )}
                {riskDelta === 0 && <span className="text-slate-400">Baseline Patient Risk</span>}
              </div>
            </div>
          </div>

          {/* Waterfall Feature Impact bars */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-purple-400" /> SHAP Feature Impact Ranking
            </h4>
            {features.map((f) => (
              <div key={f.id} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{f.name}</span>
                  <span className="font-mono text-purple-400 font-bold">{f.shapPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${f.shapPct * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
