import React, { useState } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Mic,
  FileText,
  Activity,
  Zap,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { usePatient } from "../context/PatientContext";

export default function FloatingCopilot({ isOpen, onToggle }) {
  const { activePatient } = usePatient();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm HelixMed AI Assistant. I have active context for patient **${
        activePatient ? activePatient.name : "Sarah Jenkins"
      }** (${activePatient ? activePatient.condition : "ICU Telemetry"}). How can I assist your clinical analysis today?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    `Summarize ${activePatient ? activePatient.name : "patient"}'s risk progression`,
    "Check drug interactions for current meds",
    "Draft ICU clinical discharge note",
    "Explain Early Warning LSTM anomaly score",
  ];

  const handleSend = (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const newMsgs = [...messages, { sender: "user", text: queryText }];
    setMessages(newMsgs);
    setInput("");
    setIsTyping(true);

    // Simulated AI response
    setTimeout(() => {
      let aiReply = "";
      if (queryText.toLowerCase().includes("risk") || queryText.toLowerCase().includes("summarize")) {
        aiReply = `Based on the latest Kaggle Early Warning LSTM and Digital Twin models, **${activePatient?.name}** has a deterioration risk score of **${activePatient?.riskScore}%**. Primary contributors include SpO2 fluctuation (93%) and Glucose elevation (185 mg/dL). Recommended action: adjust dosage and monitor cardiac telemetry every 30 mins.`;
      } else if (queryText.toLowerCase().includes("interaction") || queryText.toLowerCase().includes("med")) {
        aiReply = `Analysis of **${activePatient?.name}**'s medication profile shows no severe contraindications. Metformin + Dupilumab present mild GI interaction (0.12 severity). Safe to administer.`;
      } else if (queryText.toLowerCase().includes("discharge") || queryText.toLowerCase().includes("note")) {
        aiReply = `**SOAP Clinical Note Summary:**\n- **Subjective:** Patient reports mild fatigue.\n- **Objective:** HR 118 bpm, BP 142/92, SpO2 93%.\n- **Assessment:** Stable post-acute monitoring.\n- **Plan:** Continue telemetry, recheck HbA1c in 14 days.`;
      } else {
        aiReply = `Clinical AI evaluated "${queryText}". Vector search matched 14 medical literature papers on PubMed. The multi-modal Transformer model recommends continuing protocol A with 94.2% statistical confidence.`;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center gap-2 group border border-blue-400/30"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Sparkles size={20} className="animate-pulse" />
        <span className="font-bold text-xs pr-1 hidden md:inline">Clinical AI Assistant</span>
      </button>

      {/* Sliding Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md bg-[#1e293b] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px] animate-fadeIn">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  Clinical AI Assistant
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                    Active Context
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activePatient ? `${activePatient.name} • ${activePatient.mrn}` : "Global Context"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="/copilot"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Full Screen Copilot"
              >
                <Maximize2 size={16} />
              </a>
              <button
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 h-fit">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[82%] shadow-md ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none font-sans"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                {m.sender === "user" && (
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 h-fit">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Bot size={16} className="animate-spin text-blue-400" />
                <span>Analyzing clinical data...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="shrink-0 text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-all flex items-center gap-1"
              >
                <ChevronRight size={10} className="text-blue-400" />
                {qp}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Clinical AI a question..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
