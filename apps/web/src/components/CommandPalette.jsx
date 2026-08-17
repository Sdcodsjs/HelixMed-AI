import React, { useState, useEffect } from "react";
import {
  Search,
  Zap,
  Activity,
  Users,
  ShieldCheck,
  Brain,
  FileText,
  Stethoscope,
  Workflow,
  Sparkles,
  ArrowRight,
  X,
  Database,
  FlaskConical,
  Mic,
  Globe,
  BarChart3
} from "lucide-react";
import { PATIENTS, usePatient } from "../context/PatientContext";

const MODULE_COMMANDS = [
  { label: "Dashboard", href: "/", icon: Activity, category: "Module" },
  { label: "AI Predictions", href: "/ai-predictions", icon: Brain, category: "Module" },
  { label: "Doctor Workspace", href: "/doctor-workspace", icon: Stethoscope, category: "Module" },
  { label: "Early Warning LSTM", href: "/early-warning", icon: Activity, category: "Module" },
  { label: "Digital Twin Simulator", href: "/digital-twin", icon: Zap, category: "Module" },
  { label: "Trial Matching AI", href: "/trial-matching", icon: Search, category: "Module" },
  { label: "Protocol Optimizer", href: "/protocol-optimizer", icon: Workflow, category: "Module" },
  { label: "Researcher Copilot", href: "/copilot", icon: Sparkles, category: "Module" },
  { label: "Blockchain Audit Ledger", href: "/blockchain", icon: ShieldCheck, category: "Module" },
  { label: "Federated Learning", href: "/federated", icon: Users, category: "Module" },
  { label: "Explainable AI (XAI)", href: "/predictions", icon: BarChart3, category: "Module" },
  { label: "Medication Hub", href: "/medication-hub", icon: Brain, category: "Module" },
  { label: "CareMaze Navigator", href: "/care-maze", icon: Activity, category: "Module" },
  { label: "Financial Advocate", href: "/financial-advocate", icon: Brain, category: "Module" },
  { label: "Recipe Studio", href: "/recipe-studio", icon: FlaskConical, category: "Module" },
  { label: "HealthConnect Watch", href: "/health-connect", icon: Activity, category: "Module" },
  { label: "ADK Agent Garden", href: "/agent-garden", icon: Brain, category: "Module" },
  { label: "Voice Symptom Reporter", href: "/voice-reporter", icon: Mic, category: "Module" },
  { label: "Multilingual Support", href: "/multilingual", icon: Globe, category: "Module" },
  { label: "Kaggle Model Training", href: "/kaggle-training", icon: FlaskConical, category: "Module" },
  { label: "Dataset Integration", href: "/datasets", icon: Database, category: "Module" },
  { label: "Model Metrics", href: "/model-metrics", icon: Brain, category: "Module" },
];

export default function CommandPalette({ isOpen, onClose, onOpenDiagnostics, onOpenReport, onOpenCopilot }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setActivePatient } = usePatient();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build filter list
  const filteredPatients = PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase())
  ).map((p) => ({
    label: `${p.name} (${p.mrn})`,
    detail: p.condition,
    category: "Patient Profile",
    icon: Stethoscope,
    action: () => {
      setActivePatient(p);
      window.location.href = "/doctor-workspace";
    },
  }));

  const filteredModules = MODULE_COMMANDS.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  ).map((m) => ({
    ...m,
    detail: `Navigate to ${m.label}`,
    action: () => {
      window.location.href = m.href;
    },
  }));

  const quickActions = [
    {
      label: "Open Clinical AI Assistant",
      detail: "Ask AI for instant medical insights",
      category: "Action",
      icon: Sparkles,
      action: () => {
        onClose();
        if (onOpenCopilot) onOpenCopilot();
      },
    },
    {
      label: "Generate Clinical Summary Report",
      detail: "Export active patient PDF summary",
      category: "Action",
      icon: FileText,
      action: () => {
        onClose();
        if (onOpenReport) onOpenReport();
      },
    },
    {
      label: "Check AI Model Diagnostics & Latency",
      detail: "View Python inference server status",
      category: "Action",
      icon: Zap,
      action: () => {
        onClose();
        if (onOpenDiagnostics) onOpenDiagnostics();
      },
    },
  ].filter(
    (a) =>
      a.label.toLowerCase().includes(query.toLowerCase()) ||
      a.detail.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...quickActions, ...filteredPatients, ...filteredModules];

  const handleKeyDownInModal = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === "Enter" && allItems[selectedIndex]) {
      e.preventDefault();
      allItems[selectedIndex].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md transition-all animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#1e293b] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDownInModal}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search size={20} className="text-blue-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, patient MRN, module name, or AI model..."
            className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching commands or patients found for "{query}".
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon || Search;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600/90 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-300 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-blue-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-snug">{item.label}</div>
                      {item.detail && (
                        <div
                          className={`text-xs ${
                            isSelected ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          {item.detail}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        isSelected
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {item.category}
                    </span>
                    <ArrowRight
                      size={16}
                      className={isSelected ? "text-white" : "text-slate-500"}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">
                Esc
              </kbd>{" "}
              Close
            </span>
          </div>
          <div className="text-blue-400 font-semibold">HelixMed AI Command Center</div>
        </div>
      </div>
    </div>
  );
}
