"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Sliders,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Code,
  Layers,
  X
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const INITIAL_RULES = [
  {
    id: "RULE-01",
    name: "ICU Hypoxia & Beta-Blocker Alert",
    trigger: "patient-view",
    condition: "SpO2 < 90% AND Active Rx = Metoprolol",
    action: "Trigger ICU Telemetry Alert & Recommend Oxygen Titration",
    status: "ACTIVE",
    triggeredCount: 42
  },
  {
    id: "RULE-02",
    name: "CYP2D6 Poor Metabolizer Dosing Guard",
    trigger: "medication-prescribe",
    condition: "Gene = CYP2D6 (*4/*5) AND Drug = Tamoxifen",
    action: "Suggest 50% Dose Reduction or Switch to Anastrozole",
    status: "ACTIVE",
    triggeredCount: 18
  },
  {
    id: "RULE-03",
    name: "Renal Impairment Metformin Guard",
    trigger: "order-select",
    condition: "eGFR < 30 mL/min AND Drug = Metformin",
    action: "Contraindicated: Discontinue Metformin immediately",
    status: "ACTIVE",
    triggeredCount: 29
  }
];

export default function CdsHooksPage() {
  const { activePatient } = usePatient();
  const [rules, setRules] = useState(INITIAL_RULES);
  const [testResultCard, setTestResultCard] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleTrigger, setNewRuleTrigger] = useState("medication-prescribe");
  const [newRuleCondition, setNewRuleCondition] = useState("");
  const [newRuleAction, setNewRuleAction] = useState("");

  const handleCreateRule = () => {
    if (!newRuleName || !newRuleCondition) return;
    const ruleObj = {
      id: `RULE-0${rules.length + 1}`,
      name: newRuleName,
      trigger: newRuleTrigger,
      condition: newRuleCondition,
      action: newRuleAction || "Suggest clinical dose adjustment",
      status: "ACTIVE",
      triggeredCount: 0
    };
    setRules([...rules, ruleObj]);
    setIsNewRuleModalOpen(false);
    setNewRuleName("");
    setNewRuleCondition("");
    setNewRuleAction("");
  };

  const handleTestRule = (rule) => {
    setIsEvaluating(true);
    setTimeout(() => {
      setTestResultCard({
        summary: `CDS Card Triggered: ${rule.name}`,
        indicator: "warning",
        detail: `Rule evaluated true for active patient ${activePatient?.name || "Sarah Jenkins"}. Action: ${rule.action}`,
        source: "HelixMed AI CDS Hooks Engine (v2.4)",
        jsonPayload: {
          hook: rule.trigger,
          hookInstance: "d1577c69-994b-4b5d-b047-970799787a22",
          fhirServer: "https://fhir.hospital.org/R4",
          cards: [
            {
              summary: rule.name,
              indicator: "warning",
              source: { label: "HelixMed AI CDS Engine" },
              detail: rule.action,
              suggestions: [
                {
                  label: "Accept Clinical Recommendation",
                  actions: [{ type: "update", description: rule.action }]
                }
              ]
            }
          ]
        }
      });
      setIsEvaluating(false);
    }, 400);
  };

  return (
    <AppLayout activeTab="cds-hooks">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Zap className="text-yellow-400" size={26} />
              Visual CDS Hooks Clinical Decision Support Rule Engine
            </h2>
            <p className="text-slate-400 text-sm">
              Visual rule builder for HL7 CDS Hooks standard cards triggered during patient view & medication ordering workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewRuleModalOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-yellow-500/20"
            >
              <Plus size={16} /> Create Custom CDS Rule
            </button>
          </div>
        </div>

        {/* Modal: New Rule Creation */}
        {isNewRuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1e293b] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Zap className="text-yellow-400" size={18} />
                  Create New CDS Hooks Rule
                </h3>
                <button onClick={() => setIsNewRuleModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Rule Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. QT Interval Prolongation Risk Guard"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">HL7 CDS Hook Trigger Event:</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-yellow-500 outline-none font-bold"
                  >
                    <option value="medication-prescribe">medication-prescribe (During Rx entry)</option>
                    <option value="patient-view">patient-view (Opening EHR Chart)</option>
                    <option value="order-select">order-select (Lab order entry)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Logic Condition Expression:</label>
                  <input
                    type="text"
                    placeholder="e.g. QTc > 450ms AND Drug = Haloperidol"
                    value={newRuleCondition}
                    onChange={(e) => setNewRuleCondition(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Recommended CDS Action Detail:</label>
                  <input
                    type="text"
                    placeholder="e.g. Monitor QTc via ICU Telemetry & reduce dosage"
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsNewRuleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRule}
                  disabled={!newRuleName || !newRuleCondition}
                  className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-yellow-500/20"
                >
                  Save & Deploy Rule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rule List & Test Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Rules List */}
          <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Active CDS Hooks Rules ({rules.length})</span>
              <Sliders size={18} className="text-yellow-400" />
            </h3>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-yellow-500/40 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-white text-sm">{rule.name}</span>
                      <span className="text-[10px] text-yellow-400 font-mono block">Trigger: {rule.trigger}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {rule.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    IF {rule.condition}
                  </div>
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <span className="text-slate-400 text-[11px]">Fired: {rule.triggeredCount} times</span>
                    <button
                      onClick={() => handleTestRule(rule)}
                      disabled={isEvaluating}
                      className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 font-bold px-3 py-1.5 rounded-lg border border-yellow-500/30 transition-colors text-xs flex items-center gap-1"
                    >
                      <Play size={13} /> Test Rule Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Card Result Viewer */}
          <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800 flex items-center gap-2">
                <Code size={18} className="text-yellow-400" />
                CDS Hooks Card Output Preview
              </h3>

              {testResultCard ? (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-lg animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <AlertTriangle size={18} />
                      {testResultCard.summary}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {testResultCard.detail}
                    </p>
                    <div className="pt-2 border-t border-amber-500/20 flex justify-between text-[10px] text-amber-300 font-mono">
                      <span>{testResultCard.source}</span>
                      <span>Format: HL7 CDS Card</span>
                    </div>
                  </div>

                  {/* JSON Payload Display */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">HL7 CDS Card JSON Payload</span>
                    <pre className="w-full h-44 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-yellow-400 overflow-y-auto custom-scrollbar">
                      {JSON.stringify(testResultCard.jsonPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 p-12 rounded-xl border border-slate-800 text-center space-y-2 text-slate-500 text-xs">
                  <Zap size={36} className="mx-auto text-slate-600" />
                  <p>Click "Test Rule Card" on any CDS rule to evaluate and preview the generated decision support card.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-slate-300 italic">
              "CDS Hooks allows principal investigators to inject automated clinical safety guards into doctor EHR screens at the exact moment of prescribing."
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
