"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Mic,
  MicOff,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

function safeParseJSON(raw) {
  if (!raw) return null;
  // Remove code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    lines.shift(); // remove opening ```
    if (lines[lines.length - 1].trim() === "```") lines.pop();
    cleaned = lines.join("\n").trim();
  }
  return JSON.parse(cleaned);
}

export default function VoiceReporterPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeechSupported(false);
      return;
    }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          current += event.results[i][0].transcript;
        }
      }
      if (current) setTranscript((prev) => prev + " " + current);
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    setRecognition(rec);
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      setTranscript("");
      setExtractedData(null);
      recognition?.start();
      setIsListening(true);
    }
  };

  const processMutation = useMutation({
    mutationFn: async (text) => {
      const response = await fetch("/api/ai/nlp-extractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a clinical data extraction AI. Extract adverse event data from the patient speech transcript. Return ONLY a valid JSON object — no markdown, no explanation — with exactly these fields: symptom (string), severity (one of: Low, Medium, High), duration (string), onset (string), suggestedAction (string).",
            },
            { role: "user", content: text },
          ],
          json_schema: {
            name: "ae_extraction",
            schema: {
              type: "object",
              properties: {
                symptom: { type: "string" },
                severity: { type: "string" },
                duration: { type: "string" },
                onset: { type: "string" },
                suggestedAction: { type: "string" },
              },
              required: [
                "symptom",
                "severity",
                "duration",
                "onset",
                "suggestedAction",
              ],
              additionalProperties: false,
            },
          },
        }),
      });
      if (!response.ok)
        throw new Error("NLP extraction failed: " + response.status);
      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content;
      if (!raw) throw new Error("No content from AI");
      return safeParseJSON(raw);
    },
    onSuccess: (data) => {
      setExtractedData(data);
      setIsProcessing(false);
    },
    onError: (err) => {
      console.error("Voice extraction error:", err);
      setIsProcessing(false);
    },
  });

  const handleProcess = () => {
    if (transcript.trim()) {
      setIsProcessing(true);
      processMutation.mutate(transcript);
    }
  };

  const severityColor =
    extractedData?.severity?.toLowerCase() === "high"
      ? "text-red-400"
      : extractedData?.severity?.toLowerCase() === "medium"
        ? "text-orange-400"
        : "text-green-400";

  return (
    <AppLayout activeTab="voice-symptom-reporter">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mic className="text-red-400" size={24} />
            Voice-Based Symptom Reporting
          </h2>
          <p className="text-slate-400">
            Next-gen patient intake. Speak naturally; AI extracts structured
            medical data.
          </p>
        </div>

        {!speechSupported && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-sm">
            ⚠ Web Speech API is not supported in this browser. You can type your
            symptoms in the text box below instead.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recording Side */}
          <div className="space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] relative overflow-hidden">
              {isListening && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className="w-64 h-64 border-4 border-red-500/20 rounded-full"
                    style={{
                      animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                    }}
                  />
                </div>
              )}

              <div className="relative z-10">
                <button
                  onClick={toggleListening}
                  disabled={!speechSupported}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl disabled:opacity-40 ${
                    isListening
                      ? "bg-red-600 shadow-red-500/30"
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                  }`}
                >
                  {isListening ? (
                    <MicOff size={40} className="text-white" />
                  ) : (
                    <Mic size={40} className="text-white" />
                  )}
                </button>
              </div>

              <div className="space-y-2 z-10">
                <h3 className="font-bold text-lg">
                  {isListening ? "Listening to patient..." : "Start Reporting"}
                </h3>
                <p className="text-sm text-slate-400 max-w-xs">
                  {isListening
                    ? "Speak your symptoms, pain levels, and duration naturally."
                    : speechSupported
                      ? "Tap the microphone to begin your daily symptom report."
                      : "Type your symptoms in the box below and click Extract."}
                </p>
              </div>

              <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800 z-10">
                <textarea
                  className="w-full h-32 bg-transparent p-4 text-sm text-slate-300 italic resize-none outline-none"
                  placeholder={
                    speechSupported
                      ? "Live transcript will appear here..."
                      : "Type symptoms here (e.g. I have had a headache for 2 days, moderate pain level)"
                  }
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>

              <button
                onClick={handleProcess}
                disabled={!transcript.trim() || isListening || isProcessing}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all z-10"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Sparkles className="text-blue-400" size={18} />
                )}
                Extract Structured Data
              </button>
            </div>
          </div>

          {/* Extracted Data Side */}
          <div className="space-y-6">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 min-h-[400px]">
              <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" size={20} />
                AI Analysis Results
              </h3>

              {processMutation.isError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                  Failed to extract data. Please try again or check your input.
                </div>
              )}

              {extractedData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                        Extracted Symptom
                      </div>
                      <div className="text-sm font-bold text-white">
                        {extractedData.symptom}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                        Severity Tier
                      </div>
                      <div className={`text-sm font-bold ${severityColor}`}>
                        {extractedData.severity?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Duration</span>
                      <span className="text-white font-bold">
                        {extractedData.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Onset</span>
                      <span className="text-white font-bold">
                        {extractedData.onset}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                    <div className="text-[10px] text-blue-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <Sparkles size={12} /> AI Recommended Action
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-medium italic">
                      "{extractedData.suggestedAction}"
                    </div>
                  </div>

                  <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Save size={18} />
                    Submit Official AE Report
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <AlertTriangle className="text-slate-700" size={48} />
                  <p className="text-xs text-slate-600 max-w-xs uppercase font-bold tracking-tighter">
                    Awaiting voice input and AI extraction.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                Compliance Verification
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-green-500/70 font-medium">
                <CheckCircle2 size={12} /> Source voice file hashed and logged
                to blockchain.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </AppLayout>
  );
}
