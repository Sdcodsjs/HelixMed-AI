"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { SafetyAgent } from "@/utils/safetyAgent";
import {
  Pill,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Activity,
  Clock,
  ExternalLink,
  ShieldCheck,
  ShieldAlert as AlertIcon
} from "lucide-react";

const INITIAL_MEDICATIONS = [
  { id: 1, name: "Levetiracetam (Keppra)", dosage: "500 mg", frequency: "Twice Daily (BID)", condition: "Focal Epilepsy", prescribingDoctor: "Dr. Rachel Vance" },
  { id: 2, name: "Clobetasol Propionate", dosage: "0.05% Ointment", frequency: "Apply Twice Daily", condition: "Atopic Eczema", prescribingDoctor: "Dr. Marcus Thorne" },
  { id: 3, name: "Metformin HCl", dosage: "500 mg", frequency: "Once Daily with Meals", condition: "Type-2 Diabetes", prescribingDoctor: "Dr. Sarah Lin" },
];

export default function MedicationHubPage() {
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [newDrugName, setNewDrugName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [activeDDIWarning, setActiveDDIWarning] = useState(null);
  const [safetyAlerts, setSafetyAlerts] = useState([]);

  const runSafetyAudit = (currentMeds) => {
    const agent = new SafetyAgent();
    const names = currentMeds.map(m => m.name.split(" ")[0]);
    const alerts = agent.checkInteractions(names);
    setSafetyAlerts(alerts);
  };

  useEffect(() => {
    runSafetyAudit(medications);
  }, [medications]);

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newDrugName.trim()) return;

    const newMed = {
      id: Date.now(),
      name: newDrugName,
      dosage: newDosage || "250 mg",
      frequency: "Daily",
      condition: "General Health",
      prescribingDoctor: "Dr. HelixMed AI",
    };

    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);

    // Double check specific input triggers
    if (newDrugName.toLowerCase().includes("warfarin") || newDrugName.toLowerCase().includes("aspirin")) {
      setActiveDDIWarning({
        severity: "SEVERE",
        msg: "DDI Alert Detected: High Risk Anticoagulant Interaction with active regimen!",
      });
    }

    setNewDrugName("");
    setNewDosage("");
  };

  const handleRemoveMedication = (id) => {
    const updatedMeds = medications.filter((m) => m.id !== id);
    setMedications(updatedMeds);
  };

  return (
    <AppLayout activeTab="medication-hub">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Pill className="text-purple-400" size={24} />
              Active Medication Hub & Clinical Safety Agent
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Active prescription management monitored by our automated Clinical Safety Agent.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400">
            <ShieldCheck size={16} /> Drug Safety Monitor Active
          </div>
        </div>

        {/* Severe DDI Alert Banner */}
        {activeDDIWarning && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-between text-xs text-red-300">
            <div className="flex items-center gap-3">
              <ShieldAlert size={22} className="text-red-400 shrink-0" />
              <span className="font-bold">{activeDDIWarning.msg}</span>
            </div>
            <button
              onClick={() => setActiveDDIWarning(null)}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-bold border border-red-500/30"
            >
              Acknowledge Alert
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Prescriptions Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="font-bold text-white text-lg">Active Patient Prescriptions</h3>
                <span className="text-xs font-mono text-purple-400 font-bold">{medications.length} Regimens Active</span>
              </div>

              <div className="space-y-3">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <Pill size={16} className="text-purple-400" /> {med.name}
                      </div>
                      <div className="text-slate-400">
                        Dosage: <strong className="text-slate-200">{med.dosage}</strong> | Frequency: <span className="text-slate-300">{med.frequency}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Condition: {med.condition} (Prescribed by {med.prescribingDoctor})</div>
                    </div>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Prescription Form */}
              <form onSubmit={handleAddMedication} className="space-y-3 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase">Add New Prescription</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDrugName}
                    onChange={(e) => setNewDrugName(e.target.value)}
                    placeholder="Medication name (e.g. Losartan, Warfarin)"
                    className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    placeholder="Dosage (e.g. 50mg)"
                    className="w-28 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-purple-500/20"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Safety Agent Verification Alerts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Clinical Safety Warnings</span>
                <AlertIcon size={16} className="text-amber-400" />
              </h3>

              <div className="space-y-3">
                {safetyAlerts.length === 0 ? (
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs text-center py-8">
                    No active drug interactions or contraindications found in regimen.
                  </div>
                ) : (
                  safetyAlerts.map((alert, idx) => (
                    <div key={idx} className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-400 font-mono capitalize">
                          {alert.drugs[0]} + {alert.drugs[1]}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20">
                          {alert.severity} RISK
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
