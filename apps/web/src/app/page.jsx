"use client";
import React from "react";
import AppLayout from "../components/AppLayout";
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
  TrendingUp,
  AlertCircle,
  Stethoscope,
  Brain,
  FlaskConical,
  HeartPulse,
  Pill,
  Watch,
  DollarSign,
  Compass,
  Sparkles,
  Command,
  ArrowRight,
  Utensils
} from "lucide-react";
import { usePatient } from "../context/PatientContext";

const colorMap = {
  blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  orange: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${colorMap[color] || "bg-slate-800 text-slate-400"}`}>
        <Icon size={22} />
      </div>
      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {trend}
      </span>
    </div>
    <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-black text-white">{value}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, href, category, badge }) => (
  <a
    href={href}
    className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all group flex flex-col justify-between"
  >
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-blue-600 transition-colors shadow-inner">
          <Icon size={22} className="text-blue-400 group-hover:text-white transition-colors" />
        </div>
        {badge && (
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors mb-1.5">
        {title}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed mb-4">{description}</p>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-blue-400 text-xs font-bold">
      <span className="group-hover:underline">Launch Module</span>
      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </a>
);

export default function Dashboard() {
  const { activePatient } = usePatient();

  const stats = [
    {
      label: "Active Patient Cohort",
      value: "12,402",
      trend: "+8.4%",
      icon: Users,
      color: "green",
    },
    {
      label: "Trained Kaggle AI Models",
      value: "8 / 8 Online",
      trend: "100% Ready",
      icon: Brain,
      color: "purple",
    },
    {
      label: "Avg Inference Latency",
      value: "38.4 ms",
      trend: "GPU Accelerated",
      icon: Zap,
      color: "blue",
    },
    {
      label: "Active Vitals Deterioration Alerts",
      value: "18 Alerts",
      trend: "Live Monitoring",
      icon: AlertCircle,
      color: "orange",
    },
  ];

  const allFeatures = [
    {
      title: "Doctor Workspace & Case Review",
      icon: Stethoscope,
      description: "Comprehensive physician workstation for telemetry review, AI audit notes, and treatment plan sign-offs.",
      href: "/doctor-workspace",
      badge: "Featured",
    },
    {
      title: "AI Predictions Playground",
      icon: Brain,
      description: "Interactive testing studio for all 8 Kaggle trained PyTorch & Scikit-learn clinical inference models.",
      href: "/ai-predictions",
      badge: "Interactive",
    },
    {
      title: "Early Warning LSTM Telemetry",
      icon: HeartPulse,
      description: "Real-time ICU vital sign monitoring with sequence anomaly detection for patient deterioration prevention.",
      href: "/early-warning",
      badge: "Real-time",
    },
    {
      title: "Digital Twin Patient Simulator",
      icon: Zap,
      description: "Virtual bio-simulation mapping 6-month patient trajectories under different clinical trial protocols.",
      href: "/digital-twin",
      badge: "Simulation",
    },
    {
      title: "AI Trial Matching Engine",
      icon: Search,
      description: "Hybrid vector similarity search matching patient records against active clinical trial inclusion criteria.",
      href: "/trial-matching",
    },
    {
      title: "Researcher Copilot AI",
      icon: MessageSquare,
      description: "Conversational intelligence assistant for PubMed search, risk stratification, and trial documentation.",
      href: "/copilot",
    },
    {
      title: "Explainable AI (XAI) Dashboard",
      icon: BarChart3,
      description: "SHAP feature contribution charts providing clinicians full transparency into model decision criteria.",
      href: "/predictions",
    },
    {
      title: "Protocol Optimizer AI",
      icon: Workflow,
      description: "Automated analysis of trial design criteria to reduce patient burden and predict recruitment delays.",
      href: "/protocol-optimizer",
    },
    {
      title: "Medication Hub & Interaction Checker",
      icon: Pill,
      description: "Pharmaceutical interaction checking with automated dosage alerts and contraindication warnings.",
      href: "/medication-hub",
    },
    {
      title: "CareMaze Healthcare Navigator",
      icon: Compass,
      description: "Multi-facility clinical referral routing and care pathway optimizer for complex patients.",
      href: "/care-maze",
    },
    {
      title: "HealthConnect Wearable Tracking",
      icon: Watch,
      description: "Continuous telemetry stream integration for Apple Watch, Fitbit, and medical patch sensor data.",
      href: "/health-connect",
    },
    {
      title: "Patient Financial Advocate",
      icon: DollarSign,
      description: "Automated medical bill auditing, overcharge detection, and zero-interest financing eligibility analysis.",
      href: "/financial-advocate",
    },
    {
      title: "ADK Clinical Recipe Studio",
      icon: Utensils,
      description: "Personalized anti-inflammatory meal planning tailored to patient bio-markers and chronic conditions.",
      href: "/recipe-studio",
    },
    {
      title: "Blockchain Immutable Audit Ledger",
      icon: ShieldCheck,
      description: "Decentralized immutable trial log verification ensuring FDA regulatory compliance and patient consent records.",
      href: "/blockchain",
    },
    {
      title: "Federated Learning Infrastructure",
      icon: Users,
      description: "Privacy-preserving multi-institutional model training without exposing raw patient data.",
      href: "/federated",
    },
    {
      title: "Kaggle Training & Metrics Studio",
      icon: FlaskConical,
      description: "Training pipeline dashboards showing ROC-AUC curves, confusion matrices, and model benchmarks.",
      href: "/kaggle-training",
    },
    {
      title: "Voice Symptom Reporter (Whisper AI)",
      icon: Mic,
      description: "Speech-to-text symptom intake parsing natural voice recordings into structured clinical EHR fields.",
      href: "/voice-reporter",
    },
    {
      title: "Multilingual Clinical Translator",
      icon: Globe,
      description: "Instant translation for medical instructions across 6+ international languages.",
      href: "/multilingual",
    },
  ];

  return (
    <AppLayout activeTab="dashboard">
      <div className="space-y-8">
        {/* Patient Context Active Banner */}
        <div className="bg-gradient-to-r from-blue-900/50 via-slate-900 to-indigo-900/40 p-6 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <img
                src={activePatient?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"}
                alt={activePatient?.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-400/50 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{activePatient?.name}</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {activePatient?.mrn}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {activePatient?.condition} • {activePatient?.department} ({activePatient?.age} yrs, {activePatient?.gender})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">LSTM Deterioration Risk</div>
              <div className="text-xl font-extrabold text-red-400">{activePatient?.riskScore}% Score</div>
            </div>
            <a
              href="/doctor-workspace"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-1.5"
            >
              Open Doctor Workspace <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={20} />
              Clinical & AI Platform Modules ({allFeatures.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Ctrl+K</kbd> to search
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
