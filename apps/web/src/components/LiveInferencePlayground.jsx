"use client";
import React, { useState } from "react";
import { Zap, Play, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Activity, Clock } from "lucide-react";

const MODEL_CONFIGS = {
  1: {
    endpoint: "trial_matching",
    name: "Trial Matching (UCI Heart)",
    defaultFeatures: { age: 58, sex: 1, cp: 2, trestbps: 135, chol: 240, fbs: 0, restecg: 1, thalach: 152, exang: 0, oldpeak: 1.2, slope: 1, ca: 0, thal: 2 },
    fields: [
      { name: "age", label: "Age (years)", min: 20, max: 90, step: 1 },
      { name: "trestbps", label: "Resting BP (mmHg)", min: 80, max: 200, step: 1 },
      { name: "chol", label: "Serum Chol (mg/dl)", min: 100, max: 500, step: 5 },
      { name: "thalach", label: "Max Heart Rate", min: 70, max: 220, step: 1 },
      { name: "oldpeak", label: "ST Depression", min: 0, max: 6, step: 0.1 },
    ],
  },
  3: {
    endpoint: "diabetes_risk",
    name: "Diabetes Risk (Pima Ensemble)",
    defaultFeatures: { Pregnancies: 3, Glucose: 125, BP: 72, SkinThickness: 25, Insulin: 90, BMI: 32.5, DPF: 0.45, Age: 42 },
    fields: [
      { name: "Glucose", label: "Glucose Level (mg/dL)", min: 50, max: 250, step: 1 },
      { name: "BP", label: "Blood Pressure (mmHg)", min: 40, max: 130, step: 1 },
      { name: "Insulin", label: "Insulin (mu U/ml)", min: 0, max: 400, step: 5 },
      { name: "BMI", label: "BMI (kg/m²)", min: 15, max: 55, step: 0.1 },
      { name: "Age", label: "Age (years)", min: 18, max: 90, step: 1 },
    ],
  },
  4: {
    endpoint: "mortality_risk",
    name: "Mortality Risk (LightGBM)",
    defaultFeatures: { radius_mean: 14.2, texture_mean: 19.3, perimeter_mean: 92.0, area_mean: 650.0, smoothness_mean: 0.096 },
    fields: [
      { name: "radius_mean", label: "Radius Mean", min: 5, max: 30, step: 0.1 },
      { name: "texture_mean", label: "Texture Mean", min: 8, max: 40, step: 0.1 },
      { name: "perimeter_mean", label: "Perimeter Mean", min: 40, max: 190, step: 1 },
      { name: "area_mean", label: "Area Mean", min: 150, max: 2500, step: 10 },
    ],
  },
  8: {
    endpoint: "protocol_risk",
    name: "Protocol Risk (Dropout Prediction)",
    defaultFeatures: { visits_completed: 4, protocol_deviations: 1, age: 45, distance_km: 15 },
    fields: [
      { name: "visits_completed", label: "Visits Completed", min: 0, max: 20, step: 1 },
      { name: "protocol_deviations", label: "Protocol Deviations", min: 0, max: 10, step: 1 },
      { name: "age", label: "Patient Age", min: 18, max: 85, step: 1 },
      { name: "distance_km", label: "Distance to Clinic (km)", min: 1, max: 150, step: 5 },
    ],
  },
};

export default function LiveInferencePlayground({ selectedModelId = 3 }) {
  const config = MODEL_CONFIGS[selectedModelId] || MODEL_CONFIGS[3];
  const [params, setParams] = useState(config.defaultFeatures);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [latency, setLatency] = useState(null);

  const handleSliderChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const runLiveInference = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const payload = { features: params };
      const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PYTHON_INFERENCE_URL) || "http://127.0.0.1:5000";
      const res = await fetch(`${baseUrl}/predict/${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      const simulatedProb = Math.min(0.98, Math.max(0.05, (params.Glucose || params.age || 50) / 200 + (params.BMI || 25) / 100));
      setResult({
        prediction: simulatedProb > 0.5 ? 1 : 0,
        probability: { high: simulatedProb, low: 1 - simulatedProb },
        risk_level: simulatedProb > 0.7 ? "High" : simulatedProb > 0.4 ? "Medium" : "Low",
        simulated: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const probValue = result
    ? typeof result.probability === "number"
      ? result.probability
      : result.probability?.diabetic ?? result.probability?.high_risk ?? result.probability?.eligible ?? result.probability?.high ?? 0.5
    : 0;

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="text-amber-400" size={22} />
            <h3 className="text-xl font-bold text-white">Live Model Playground ("Try It Live")</h3>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Adjust clinical vitals and execute predictions directly against the Python inference server.
          </p>
        </div>
        <button
          onClick={runLiveInference}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
          {loading ? "Calculating..." : "Execute Prediction"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 space-y-5 bg-slate-900/50 p-5 rounded-xl border border-slate-800">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} className="text-blue-400" /> Patient Clinical Parameters
          </h4>
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{field.label}</span>
                  <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {params[field.name] ?? field.min}
                  </span>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={params[field.name] ?? field.min}
                  onChange={(e) => handleSliderChange(field.name, e.target.value)}
                  className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Output Gauge & Results */}
        <div className="lg:col-span-5 bg-slate-900/70 p-6 rounded-xl border border-slate-800 flex flex-col justify-between items-center text-center space-y-4">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" /> Live Risk Assessment
          </h4>

          {/* Radial Gauge SVG */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="10" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={probValue > 0.7 ? "#ef4444" : probValue > 0.4 ? "#f59e0b" : "#10b981"}
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - 251.2 * probValue}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">
                {Math.round(probValue * 100)}%
              </span>
              <span className="text-xs text-slate-400">Risk Prob</span>
            </div>
          </div>

          {result ? (
            <div className="space-y-2 w-full">
              <div
                className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 ${
                  result.risk_level === "Critical" || result.risk_level === "High"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : result.risk_level === "Medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {result.risk_level === "High" || result.risk_level === "Critical" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Risk Level: {result.risk_level || "Normal"}
              </div>

              {latency !== null && (
                <div className="flex justify-center items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock size={14} className="text-blue-400" />
                  Latency: <span className="text-slate-200">{latency} ms</span>
                  {result.simulated && <span className="text-amber-400 text-[10px]">(Local Simulation)</span>}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-xs italic">
              Adjust parameters and click "Execute Prediction" to get live inference results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
