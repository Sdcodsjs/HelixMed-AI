import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Search,
  MessageSquare,
  Zap,
  ShieldCheck,
  Globe,
  Mic,
  BarChart3,
  Workflow,
  LayoutDashboard,
  Menu,
  X,
  Database,
  Brain,
  FlaskConical,
  Stethoscope,
  Command,
  Bell,
  FileText,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
  AlertCircle,
  Pill,
  HeartPulse,
  Utensils,
  Watch,
  DollarSign,
  Compass,
  Cpu,
  Dna,
  Scan,
  FileCheck,
  ShieldAlert,
  Layers,
  Lock
} from "lucide-react";
import { usePatient } from "../context/PatientContext";
import CommandPalette from "./CommandPalette";
import DiagnosticsModal from "./DiagnosticsModal";
import NotificationCenter from "./NotificationCenter";
import FloatingCopilot from "./FloatingCopilot";
import ClinicalReportModal from "./ClinicalReportModal";

const SidebarItem = ({ icon: Icon, label, href, active, badge }) => (
  <a
    href={href}
    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-medium text-xs ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
        : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? "text-white" : "text-blue-400/80"} />
      <span>{label}</span>
    </div>
    {badge && (
      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
        {badge}
      </span>
    )}
  </a>
);

export default function AppLayout({ children, activeTab }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [isDiagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isCopilotOpen, setCopilotOpen] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);
  const [isPatientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Auth Gate — redirect to /login if no session token
  useEffect(() => {
    const token = typeof window !== "undefined" && localStorage.getItem("cn_auth_token");
    if (!token) {
      window.location.href = "/login";
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  const { activePatient, patients, setActivePatient } = usePatient();

  // Don't render anything until auth is verified (prevents flash of dashboard)
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const navigationCategories = [
    {
      title: "Main Platform",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/" },
        { label: "Doctor Workspace", icon: Stethoscope, href: "/doctor-workspace", badge: "Live" },
        { label: "Portal Login / Auth", icon: Lock, href: "/login", badge: "2FA" },
      ],
    },
    {
      title: "AI & Inference Engine",
      items: [
        { label: "AI Predictions", icon: Brain, href: "/ai-predictions", badge: "8 Models" },
        { label: "Early Warning", icon: HeartPulse, href: "/early-warning" },
        { label: "Digital Twin", icon: Zap, href: "/digital-twin" },
        { label: "XAI Predictions", icon: BarChart3, href: "/predictions" },
        { label: "Kaggle Training", icon: FlaskConical, href: "/kaggle-training" },
        { label: "Model Metrics", icon: Cpu, href: "/model-metrics" },
      ],
    },
    {
      title: "Clinical Research",
      items: [
        { label: "Trial Matching", icon: Search, href: "/trial-matching" },
        { label: "Researcher Copilot", icon: MessageSquare, href: "/copilot" },
        { label: "Protocol Optimizer", icon: Workflow, href: "/protocol-optimizer" },
        { label: "Dataset Integration", icon: Database, href: "/datasets" },
      ],
    },
    {
      title: "Precision Medicine & Simulation",
      items: [
        { label: "Genomic Explorer", icon: Dna, href: "/genomics", badge: "Multi-Omics" },
        { label: "ICU Waveform Studio", icon: HeartPulse, href: "/icu-telemetry", badge: "250Hz ECG" },
        { label: "Cohort Stress-Tester", icon: Database, href: "/cohort-simulator", badge: "Real EHR" },
        { label: "3D Organ Digital Twin", icon: Zap, href: "/organ-twin", badge: "RECIST 1.1" },
        { label: "FDA eCTD Dossier", icon: FileText, href: "/fda-dossier", badge: "Part 11" },
        { label: "Edge TinyML Detector", icon: Cpu, href: "/edge-tinyml", badge: "Wearable" },
      ],
    },
    {
      title: "EHR Interoperability & Governance",
      items: [
        { label: "DICOM Radiomics Studio", icon: Scan, href: "/dicom-viewer", badge: "AI Imaging" },
        { label: "FHIR R4 EHR Pipeline", icon: Database, href: "/fhir-pipeline", badge: "HL7 Interop" },
        { label: "Part 11 Smart e-Consent", icon: FileCheck, href: "/e-consent", badge: "21 CFR 11" },
        { label: "Pharmacovigilance & MedDRA", icon: ShieldAlert, href: "/adverse-events", badge: "Naranjo" },
        { label: "Trial Financial ROI", icon: DollarSign, href: "/trial-financials", badge: "Milestones" },
        { label: "CDS Hooks Rule Engine", icon: Zap, href: "/cds-hooks", badge: "Rules Engine" },
      ],
    },
    {
      title: "Biotech & Next-Gen Workflows",
      items: [
        { label: "MedCore Intelligence Hub", icon: Brain, href: "/medcore-hub", badge: "12 AI Modules" },
        { label: "CRISPR Gene Editor", icon: Dna, href: "/crispr-editor", badge: "Cas9/12" },
        { label: "EEG Neuro-Telemetry", icon: Brain, href: "/eeg-telemetry", badge: "16-Channel" },
        { label: "3D Protein Docking", icon: Layers, href: "/protein-docking", badge: "AlphaFold" },
        { label: "ED AI Triage Predictor", icon: ShieldAlert, href: "/ed-triage", badge: "ESI 1-5" },
        { label: "RECIST Oncology Tracker", icon: Scan, href: "/oncology-tracker", badge: "RECIST 1.1" },
        { label: "Ambient Voice SOAP Note", icon: Mic, href: "/ambient-soap", badge: "NLP Voice" },
      ],
    },
    {
      title: "Patient Care & Hub",
      items: [
        { label: "CareMaze Navigator", icon: Compass, href: "/care-maze" },
        { label: "Medication Hub", icon: Pill, href: "/medication-hub" },
        { label: "HealthConnect Watch", icon: Watch, href: "/health-connect" },
        { label: "Financial Advocate", icon: DollarSign, href: "/financial-advocate" },
        { label: "Recipe Studio", icon: Utensils, href: "/recipe-studio" },
        { label: "Voice Symptom Reporter", icon: Mic, href: "/voice-reporter" },
        { label: "Multilingual Support", icon: Globe, href: "/multilingual" },
      ],
    },
    {
      title: "Infrastructure & Security",
      items: [
        { label: "Blockchain Audit", icon: ShieldCheck, href: "/blockchain" },
        { label: "Federated Learning", icon: Users, href: "/federated" },
        { label: "ADK Agent Garden", icon: Brain, href: "/agent-garden" },
      ],
    },
  ];

  return (
    <div
      className={`flex h-screen ${
        isHighContrast ? "bg-black text-yellow-300" : "bg-[#0f172a] text-slate-100"
      } font-sans overflow-hidden`}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-slate-800 rounded-lg text-white"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        fixed md:relative z-40 w-64 h-full bg-[#1e293b] border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col shrink-0
      `}
      >
        <div className="p-5 border-b border-slate-800/80">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-wide leading-tight">
                HelixMed <span className="text-blue-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Next-Gen Clinical Research
              </p>
            </div>
          </a>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {navigationCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {cat.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {cat.items.map((item) => {
                  const isActive =
                    activeTab === item.label.toLowerCase().replace(/\s+/g, "-") ||
                    (activeTab === "dashboard" && item.href === "/") ||
                    (activeTab === "" && item.href === "/");
                  return (
                    <SidebarItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      href={item.href}
                      active={isActive}
                      badge={item.badge}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Context */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[11px] font-semibold text-slate-300">PyTorch CUDA 12.1</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-bold">v2.4-Kaggle</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 w-full h-16 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          {/* Left: Breadcrumbs & Quick Search Trigger */}
          <div className="flex items-center gap-4">
            <div className="text-slate-400 text-xs hidden sm:block font-medium">
              Clinical Nexus AI &gt;{" "}
              <span className="text-white font-bold capitalize">
                {activeTab ? activeTab.replace(/-/g, " ") : "Dashboard"}
              </span>
            </div>

            {/* Quick Command Palette Search Bar */}
            <button
              onClick={() => setCmdPaletteOpen(true)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700/80 transition-all shadow-inner group"
            >
              <Search size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-medium">Search commands, patients, AI models...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700 rounded-md">
                <Command size={10} /> K
              </kbd>
            </button>
          </div>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-3">
            {/* Patient Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPatientDropdownOpen(!isPatientDropdownOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
              >
                <Stethoscope size={14} className="text-blue-400" />
                <span className="font-bold hidden sm:inline">{activePatient?.name || "Select Patient"}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isPatientDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Active Patient Profiles
                  </div>
                  {patients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePatient(p);
                        setPatientDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        activePatient?.id === p.id
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[10px] opacity-80">{p.condition}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700">
                        {p.mrn}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Diagnostics Pill */}
            <button
              onClick={() => setDiagnosticsOpen(true)}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              title="View Inference Health & Model Latency"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline">AI Server</span> 38ms
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
              title="Clinical Deterioration Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
            </button>

            {/* Report Export Button */}
            <button
              onClick={() => setReportOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
              title="Export Clinical PDF Summary"
            >
              <FileText size={16} className="text-blue-400" />
              <span className="hidden lg:inline">Report</span>
            </button>

            {/* Login / Portal Button */}
            <a
              href="/login"
              className="p-2 text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600 rounded-xl border border-blue-500/30 transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Clinician / Doctor Portal Login"
            >
              <Lock size={15} />
              <span className="hidden md:inline">Login</span>
            </a>

            {/* High Contrast Theme Toggle */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors"
              title="Toggle High Contrast Mode"
            >
              {isHighContrast ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        onOpenReport={() => setReportOpen(true)}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

      {/* Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Clinical Report Export Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setReportOpen(false)}
      />

      {/* Floating AI Assistant Drawer */}
      <FloatingCopilot
        isOpen={isCopilotOpen}
        onToggle={() => setCopilotOpen(!isCopilotOpen)}
      />
    </div>
  );
}
