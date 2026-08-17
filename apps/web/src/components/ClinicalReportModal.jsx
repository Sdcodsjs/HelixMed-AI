import React from "react";
import { X, Printer, Download, ShieldCheck, Activity, Stethoscope, FileText, CheckCircle2 } from "lucide-react";
import { usePatient } from "../context/PatientContext";

export default function ClinicalReportModal({ isOpen, onClose }) {
  const { activePatient } = usePatient();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const patient = activePatient || {
    name: "Sarah Jenkins",
    mrn: "MRN-908124",
    age: 58,
    gender: "Female",
    department: "ICU Telemetry",
    condition: "Type-2 Diabetes & Severe Eczema",
    heartRate: "118 bpm",
    bp: "142/92 mmHg",
    spO2: "93%",
    glucose: "185 mg/dL",
    riskScore: 88,
    digitalTwinScore: 0.74,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Clinical Precision Report — {patient.name}
              </h2>
              <p className="text-xs text-slate-400">Generated via HelixMed AI Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto bg-slate-950 text-slate-200 font-sans space-y-6">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-blue-400 flex items-center gap-2">
                <Activity size={26} /> CLINICAL NEXUS AI HEALTH SYSTEM
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Precision Health Analytics & AI Prediction Report
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div className="font-bold text-white">CONFIDENTIAL MEDICAL REPORT</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Report ID: RPT-2026-0817</div>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Patient Name</span>
              <span className="text-sm font-bold text-white">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">MRN / ID</span>
              <span className="text-sm font-bold text-blue-400">{patient.mrn}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Age / Gender</span>
              <span className="text-sm font-bold text-white">
                {patient.age} yrs / {patient.gender}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Department</span>
              <span className="text-sm font-bold text-emerald-400">{patient.department}</span>
            </div>
          </div>

          {/* Active Vitals Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Real-Time Telemetry Vitals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Heart Rate</span>
                <div className="text-lg font-extrabold text-red-400">{patient.heartRate}</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Blood Pressure</span>
                <div className="text-lg font-extrabold text-blue-400">{patient.bp}</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">SpO2 Level</span>
                <div className="text-lg font-extrabold text-amber-400">{patient.spO2}</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400">Blood Glucose</span>
                <div className="text-lg font-extrabold text-purple-400">{patient.glucose}</div>
              </div>
            </div>
          </div>

          {/* Kaggle AI Predictions Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Kaggle AI Inference Scores & Digital Twin Trajectory
            </h3>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="font-bold text-sm text-white">Model 2: Early Warning LSTM Anomaly Score</span>
                  <div className="text-xs text-slate-400">Trained on ICU vital telemetry (Kaggle)</div>
                </div>
                <span className="text-base font-extrabold text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                  {patient.riskScore}% Deterioration Risk
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="font-bold text-sm text-white">Model 5: Digital Twin 6-Month Trajectory</span>
                  <div className="text-xs text-slate-400">Trained on NHANES longitudinal cohort</div>
                </div>
                <span className="text-base font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                  {(patient.digitalTwinScore * 100).toFixed(0)}% Recovery Outlook
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-sm text-white">Model 1: Trial Matching Eligibility</span>
                  <div className="text-xs text-slate-400">Matched to 3 active clinical trial protocols</div>
                </div>
                <span className="text-base font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/30">
                  Eligible (94% Match)
                </span>
              </div>
            </div>
          </div>

          {/* Attending Physician & Sign-off Block */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck size={16} className="text-emerald-400" /> Blockchain Immutable Audit Proof
              </div>
              <div className="font-mono text-[10px] text-slate-500">
                TxHash: 0x8f92a11b849e72c01994ad23ff91a2bc0019284fa
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">Dr. Alexander Wright, MD</div>
              <div className="text-slate-400">Chief of Precision Medicine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
