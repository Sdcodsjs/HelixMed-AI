"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { AgentOrchestrator } from "@/utils/agentOrchestrator";
import {
  Mic,
  MicOff,
  Volume2,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Send,
  Zap,
  User,
  Stethoscope,
  Tag,
  RefreshCw,
  Sliders,
  Check,
  X,
  Play
} from "lucide-react";

export default function AmbientSoapPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState("Doctor");
  const [copied, setCopied] = useState(false);
  const [orchestrationTrace, setOrchestrationTrace] = useState([]);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  
  const [soapSections, setSoapSections] = useState({
    subjective: "64-year-old female presenting for hypertension follow-up. Reports dry persistent non-productive cough for 5 days following Lisinopril titration. Denies shortness of breath, chest pain, or peripheral edema.",
    objective: "Vitals: BP 132/84 mmHg, HR 72 bpm, SpO2 98% room air. Lungs clear to auscultation bilaterally. No wheezing, rales, or rhonchi.",
    assessment: "1. ACE inhibitor-induced cough (ICD-10: R05.3)\n2. Essential primary hypertension, controlled (ICD-10: I10)",
    plan: "1. Discontinue Lisinopril 20mg oral daily.\n2. Initiate Losartan 50mg oral daily (ARBs class alternative).\n3. Recheck BP & renal panel in 4 weeks."
  });

  const [hitlStatus, setHitlStatus] = useState({
    subjective: "PENDING_REVIEW",
    objective: "PENDING_REVIEW",
    assessment: "PENDING_REVIEW",
    plan: "PENDING_REVIEW"
  });

  const dialogue = [
    { speaker: "Dr. Harrison", role: "Doctor", time: "00:04", text: "Good morning Mrs. Gable, how are you feeling with the new dosage of Lisinopril?" },
    { speaker: "Patient (Clara)", role: "Patient", time: "00:12", text: "Well doctor, the blood pressure seems better at 132 over 84, but I've had a dry persistent cough for the past 5 days." },
    { speaker: "Dr. Harrison", role: "Doctor", time: "00:28", text: "I see. ACE inhibitor induced dry cough is a known reaction. Any swelling in your ankles or shortness of breath?" },
    { speaker: "Patient (Clara)", role: "Patient", time: "00:36", text: "No ankle swelling or shortness of breath, just the tickling cough especially at night." },
    { speaker: "Dr. Harrison", role: "Doctor", time: "00:52", text: "Let's switch you from Lisinopril 20mg to Losartan 50mg daily. It's an ARB so it won't trigger that cough mechanism." }
  ];

  const extractedEntities = [
    { text: "Lisinopril 20mg", type: "Medication (Discontinued)", code: "RxNorm 29046" },
    { text: "Losartan 50mg", type: "Medication (Initiated)", code: "RxNorm 52175" },
    { text: "Dry persistent cough", type: "Symptom / Adverse Effect", code: "ICD-10 R05.3" },
    { text: "Essential Hypertension", type: "Primary Diagnosis", code: "ICD-10 I10" },
    { text: "Office Visit - Moderate", type: "CPT Billing Code", code: "CPT 99214" }
  ];

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const triggerOrchestrator = async () => {
    setIsOrchestrating(true);
    setOrchestrationTrace([]);
    const orchestrator = new AgentOrchestrator();
    
    // Simulate multi-agent processing step-by-step
    const result = await orchestrator.processQuery("Generate clinical notes and diagnose Lisinopril dry cough case");
    
    for (let i = 0; i < result.executionTrace.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrchestrationTrace(prev => [...prev, result.executionTrace[i]]);
    }
    
    setIsOrchestrating(false);
  };

  useEffect(() => {
    triggerOrchestrator();
  }, []);

  const copySoap = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifySection = (section, isApproved) => {
    setHitlStatus(prev => ({
      ...prev,
      [section]: isApproved ? "APPROVED" : "REJECTED"
    }));
  };

  return (
    <AppLayout activeTab="/ambient-soap">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Multi-Agent Graph Orchestration
              </span>
              <span className="text-xs text-slate-400">Whisper Clinical & LangGraph Routing</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <Mic className="h-7 w-7 text-cyan-400" />
              Ambient Clinical Voice Transcription & Multi-Agent SOAP Scribe
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Multi-agent workflow routing transcription chunks to SOAP compilers, ICD-10 extraction, and human-in-the-loop review nodes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerOrchestrator}
              className="px-4 py-2 font-medium rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isOrchestrating ? "animate-spin" : ""}`} />
              Re-run Multi-Agent Pipeline
            </button>
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2 ${
                isRecording
                  ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              }`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isRecording ? "Stop Ambient Recording" : "Start Live Consultation Stream"}
            </button>
          </div>
        </div>

        {/* Multi-Agent Orchestration Visualizer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Agent-to-Agent Handoff Log & Graph Trace
            </h3>
            <span className="text-xs text-slate-400">LangGraph Active Router Context</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["router", "transcriber", "soapScribe", "icdExtractor"].map((node, i) => {
              const activeTrace = orchestrationTrace.find(t => t.agent === node);
              const isActive = activeTrace !== undefined;
              const names = {
                router: "1. Central Router",
                transcriber: "2. Audio Transcriber",
                soapScribe: "3. SOAP Compiler",
                icdExtractor: "4. ICD-10 Extractor"
              };
              return (
                <div key={i} className={`p-3 rounded-lg border transition-all ${
                  isActive
                    ? "bg-cyan-950/20 border-cyan-500/40 text-white"
                    : "bg-slate-950/40 border-slate-800 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{names[node]}</span>
                    {isActive ? (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-800" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {isActive ? activeTrace.status : "Waiting to activate..."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio Dialogue Diarization */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-cyan-400" />
                Live Acoustic Diarized Dialogue Stream
              </h3>
              <span className="text-xs font-mono text-cyan-400">99.1% Transcription Accuracy</span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {dialogue.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border space-y-1 ${
                    item.role === "Doctor"
                      ? "bg-slate-950/80 border-slate-800"
                      : "bg-cyan-950/20 border-cyan-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      item.role === "Doctor" ? "text-slate-300" : "text-cyan-300"
                    }`}>
                      {item.role === "Doctor" ? <Stethoscope className="h-3.5 w-3.5 text-blue-400" /> : <User className="h-3.5 w-3.5 text-cyan-400" />}
                      {item.speaker}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed pl-5">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Extracted Entity Tags */}
            <div className="pt-2 space-y-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">NLP Medical Entity Extraction</span>
              <div className="flex flex-wrap gap-1.5">
                {extractedEntities.map((ent, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                    <Tag className="h-3 w-3 text-cyan-400" />
                    {ent.text} <span className="text-slate-500">[{ent.code}]</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Auto SOAP Note View with HITL */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Human-in-the-Loop SOAP Synthesizer
              </h3>
              <button
                onClick={copySoap}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy SOAP"}
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {Object.keys(soapSections).map((section) => {
                const colorMap = {
                  subjective: "text-cyan-400",
                  objective: "text-blue-400",
                  assessment: "text-amber-400",
                  plan: "text-emerald-400"
                };
                const status = hitlStatus[section];

                return (
                  <div key={section} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold uppercase ${colorMap[section]}`}>{section[0]} - {section}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleVerifySection(section, true)}
                          className={`p-1 rounded transition-all ${
                            status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                          }`}
                          title="Accept Section"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleVerifySection(section, false)}
                          className={`p-1 rounded transition-all ${
                            status === "REJECTED" ? "bg-rose-500/20 text-rose-400" : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                          }`}
                          title="Reject / Flag Section"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={soapSections[section]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSoapSections(prev => ({ ...prev, [section]: val }));
                      }}
                      className="w-full bg-slate-950 text-slate-300 leading-relaxed border-0 focus:ring-1 focus:ring-cyan-500 p-0 resize-none h-16 font-sans text-xs"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Interactive Edit Field</span>
                      <span className={`font-bold ${
                        status === "APPROVED" ? "text-emerald-400" : status === "REJECTED" ? "text-rose-400" : "text-amber-400"
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => alert("Approved SOAP Note synced to EHR database via FHIR R4 API")}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="h-4 w-4" />
              1-Click Sync verified SOAP to Hospital EHR (Epic/FHIR)
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
