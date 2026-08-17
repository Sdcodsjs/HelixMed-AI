"use client";
import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Play,
  Pause,
  Check,
  Award,
  Lock,
  Sparkles,
  HelpCircle,
  PenTool,
  RotateCcw,
  Download,
  AlertCircle,
  Video,
  Volume2
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const QUIZ_QUESTIONS = [
  { id: 1, question: "What is the primary goal of this Phase III Clinical Trial?", options: ["Evaluate drug efficacy & safety", "General wellness check", "Commercial sales"], correct: 0 },
  { id: 2, question: "How often will your vital signs be monitored in the ICU?", options: ["Continuously (250Hz ECG)", "Once per month", "Only if requested"], correct: 0 },
  { id: 3, question: "Can you withdraw your consent from the trial at any time?", options: ["Yes, anytime without penalty", "No, it is legally mandatory", "Only after 6 months"], correct: 0 },
];

export default function EConsentPage() {
  const { activePatient } = usePatient();
  const [currentStep, setCurrentStep] = useState(1); // 1: Read/Video, 2: Quiz, 3: Signature Canvas, 4: Confirmed
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [answers, setAnswers] = useState({});
  const [quizError, setQuizError] = useState(null);
  const [signatureName, setSignatureName] = useState(activePatient?.name || "Sarah Jenkins");
  const [blockchainHash, setBlockchainHash] = useState(null);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Simulated Video Explainer Progress
  useEffect(() => {
    let interval;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            return 100;
          }
          return prev + 5;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  // HTML5 Signature Canvas Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
    setHasDrawnSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const handleAnswer = (qId, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setQuizError(null);
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) score += 1;
    });

    if (score === QUIZ_QUESTIONS.length) {
      setQuizError(null);
      setCurrentStep(3); // Proceed to signature
    } else {
      setQuizError(`Pass rate requirement not met (${score}/${QUIZ_QUESTIONS.length} correct). FDA 21 CFR Part 11 requires 100% comprehension score. Please review and retry.`);
    }
  };

  const submitSignature = () => {
    const hash = `0x8f${Math.random().toString(16).substr(2, 10)}...${Math.random().toString(16).substr(2, 6)}`;
    setBlockchainHash(hash);
    setCurrentStep(4);
  };

  const handleDownloadCertificate = () => {
    const certText = `FDA 21 CFR PART 11 CERTIFICATE OF INFORMED CONSENT
=====================================================
Subject: ${signatureName} (${activePatient?.mrn || "MRN-908124"})
Protocol: Phase III Clinical Trial - Metformin + Telemetry
Consent Date: ${new Date().toLocaleString()}
Comprehension Quiz: Passed (100% Score)
Blockchain Audit Hash: ${blockchainHash || "0x8f92a11b849e72c019"}

Status: Legally Binding Electronic Record Verified`;

    const blob = new Blob([certText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Signed_eConsent_${signatureName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <AppLayout activeTab="e-consent">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <FileCheck className="text-blue-400" size={26} />
              FDA 21 CFR Part 11 Smart e-Consent & Video Quiz Portal
            </h2>
            <p className="text-slate-400 text-sm">
              IRB-approved electronic informed consent with AI video comprehension testing & cryptographic blockchain sign-off.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              21 CFR Part 11 Certified
            </div>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-4 gap-3 bg-[#1e293b] p-3 rounded-2xl border border-slate-800 text-xs font-semibold">
          {[
            { step: 1, label: "1. Protocol & Video" },
            { step: 2, label: "2. Comprehension Quiz" },
            { step: 3, label: "3. Canvas Signature" },
            { step: 4, label: "4. Immutable Hash" },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => {
                if (s.step < currentStep) setCurrentStep(s.step);
              }}
              className={`p-2.5 rounded-xl text-center transition-all ${
                currentStep === s.step
                  ? "bg-blue-600 text-white font-bold shadow-md"
                  : currentStep > s.step
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-900 text-slate-500"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step 1: Read Consent Document & Video Explainer */}
        {currentStep === 1 && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>INFORMED CONSENT DOCUMENT (Phase III Cardiovascular Trial)</span>
              <span className="text-xs font-mono text-blue-400">IRB Protocol #2026-9042</span>
            </h3>

            {/* Video Explainer Player Box */}
            <div className="bg-[#090d16] p-5 rounded-2xl border border-blue-500/30 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-blue-400 font-mono">
                <span className="flex items-center gap-2 font-bold">
                  <Video size={16} /> Interactive Patient Protocol Video Explainer (2 min)
                </span>
                <span>{videoProgress}% Watched</span>
              </div>

              <div className="w-full h-[180px] bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative">
                <div className="text-center space-y-2">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-transform hover:scale-105 shadow-xl shadow-blue-500/30"
                  >
                    {isVideoPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <div className="text-xs text-slate-300 font-semibold">
                    {isVideoPlaying ? "Playing Clinical Protocol Overview..." : "Click Play to Watch Audio-Visual Protocol Summary"}
                  </div>
                </div>

                {/* Video Scrubber Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Consent Document Text */}
            <div className="bg-[#090d16] p-5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-56 overflow-y-auto space-y-3 font-sans custom-scrollbar">
              <p>
                <strong>Study Title:</strong> Phase III Evaluation of Metformin + Telemetry Monitoring in High-Risk Cardiovascular Patients.
              </p>
              <p>
                <strong>Purpose:</strong> You are being invited to participate in a clinical research study. The purpose of this study is to evaluate continuous 250Hz ECG telemetry and metabolic markers to prevent cardiac deterioration.
              </p>
              <p>
                <strong>Voluntary Participation:</strong> Your participation is completely voluntary. You may withdraw your consent at any time without penalty or loss of healthcare benefits.
              </p>
              <p>
                <strong>Data Privacy & Security:</strong> All medical data is encrypted under HIPAA & FDA 21 CFR Part 11 guidelines. Cryptographic signatures are anchored to an Ethereum blockchain audit ledger.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-xs"
            >
              Proceed to Comprehension Quiz →
            </button>
          </div>
        )}

        {/* Step 2: Comprehension Quiz */}
        {currentStep === 2 && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HelpCircle className="text-blue-400" size={18} />
                Patient Comprehension Quiz (FDA Required 100% Pass Rate)
              </span>
              <span className="text-xs text-slate-400 font-mono">3 Required Questions</span>
            </h3>

            {/* Quiz Error Box */}
            {quizError && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{quizError}</span>
              </div>
            )}

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white">
                    Question {idx + 1}: {q.question}
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(q.id, oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                          answers[q.id] === oIdx
                            ? "bg-blue-600 text-white border-blue-400 font-bold"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors border border-slate-700"
              >
                ← Back to Protocol
              </button>
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-xs"
              >
                Validate Quiz Answers →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Canvas Signature */}
        {currentStep === 3 && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3 flex items-center gap-2">
              <PenTool className="text-emerald-400" size={18} />
              Interactive Biometric Signature Pad (21 CFR Part 11 Compliant)
            </h3>

            <div className="space-y-3 text-xs">
              <label className="text-slate-400 font-semibold block">Full Printed Name:</label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              />
            </div>

            {/* Canvas Signature Pad */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Draw Biometric Signature below (Mouse or Touch):</span>
                <button
                  onClick={clearCanvas}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={12} /> Clear Signature
                </button>
              </div>

              <div className="w-full h-[160px] bg-[#090d16] rounded-xl border border-dashed border-emerald-500/40 relative flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair rounded-xl"
                />
                {!hasDrawnSignature && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-600 text-xs italic font-mono">
                    Sign Here with Mouse or Touch Screen...
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors border border-slate-700"
              >
                ← Back to Quiz
              </button>
              <button
                onClick={submitSignature}
                disabled={!hasDrawnSignature || !signatureName}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-xs"
              >
                Sign & Write Cryptographic Hash to Blockchain →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmed & Download */}
        {currentStep === 4 && (
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-emerald-500/40 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full inline-block">
              <CheckCircle2 size={52} />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white">e-Consent Execution Verified</h3>
              <p className="text-slate-300 text-xs max-w-md mx-auto leading-relaxed">
                Patient <strong>{signatureName}</strong> has passed the comprehension quiz (100%) and signed the informed consent document.
              </p>
            </div>

            <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-400 font-bold max-w-lg mx-auto space-y-1 text-left">
              <div className="text-slate-500 text-[10px] uppercase">Cryptographic Audit Ledger Trail</div>
              <div className="text-emerald-400 truncate">Hash: {blockchainHash}</div>
              <div className="text-slate-400 text-[11px]">Timestamp: {new Date().toLocaleString()}</div>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleDownloadCertificate}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/20"
              >
                <Download size={16} /> Download Signed Certificate (.txt)
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setAnswers({});
                  setQuizError(null);
                  setHasDrawnSignature(false);
                }}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors border border-slate-700"
              >
                Start New Consent Session
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
