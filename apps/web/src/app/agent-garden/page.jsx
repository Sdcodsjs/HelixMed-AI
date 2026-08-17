"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Bot,
  Activity,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  Code2,
  Clock,
  Terminal,
  Database,
  Lock,
} from "lucide-react";

export default function AgentGardenPage() {
  const [prompt, setPrompt] = useState("Audit medical bill for duplicate lab charges and find 0% APR loan offers");
  const [running, setRunning] = useState(false);
  const [traceData, setTraceData] = useState(null);

  const runOrchestrator = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/ai/adk-orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setTraceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppLayout activeTab="agent-garden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Bot className="text-purple-400" size={24} />
              ADK Agent Garden & Arize Phoenix OpenTelemetry Dashboard
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Live OpenTelemetry trace inspector tracking Agent-to-Agent (A2A) spans, MCP tool payloads, and Presidio PHI scrubbing.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-purple-400">
            <Activity size={16} /> Live Arize Phoenix Tracing (Active)
          </div>
        </div>

        {/* Prompt Execution & Trace Launcher */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Zap className="text-amber-400" size={20} /> OpenTelemetry ADK Trace Inspector Launcher
          </h3>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono"
              placeholder="Type prompt to execute live OpenTelemetry trace..."
            />
            <button
              onClick={runOrchestrator}
              disabled={running}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 text-xs"
            >
              {running ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
              {running ? "Tracing Spans..." : "Execute & Inspect Trace"}
            </button>
          </div>

          {/* Quick Preset Workflows */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-semibold self-center">Preset Traces:</span>
            {[
              "Audit medical bill for duplicate lab charges and find 0% APR loan offers",
              "Scan prescription and check for eczema anti-inflammatory meal options",
              "Get patient vitals and check drug-drug interactions",
            ].map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors font-mono text-[11px]"
              >
                {p.slice(0, 45)}...
              </button>
            ))}
          </div>

          {/* Live OpenTelemetry Trace Results */}
          {traceData && (
            <div className="space-y-6 pt-4 border-t border-slate-800">
              {/* Telemetry Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Trace ID</div>
                  <div className="text-purple-400 font-bold truncate">{traceData.traceId}</div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Total Latency</div>
                  <div className="text-white font-bold">{traceData.telemetry.totalDurationMs} ms</div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Token Consumption</div>
                  <div className="text-emerald-400 font-bold">{traceData.telemetry.tokens.totalTokens} Tokens</div>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Spans / MCP Calls</div>
                  <div className="text-blue-400 font-bold">{traceData.telemetry.spansCount} Spans | {traceData.telemetry.mcpToolCallsCount} Tool Calls</div>
                </div>
              </div>

              {/* Presidio PHI Entity De-identification Inspection */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-emerald-400" /> Presidio PHI Local De-identification Shield
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Sanitized in {traceData.phiScrubbing.sanitizationTimeMs} ms</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                  <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Sanitized Prompt Payload:</div>
                  "{traceData.phiScrubbing.scrubbedPrompt}"
                </div>
              </div>

              {/* OpenTelemetry Spans Execution Sequence */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-purple-400" /> OpenTelemetry Execution Spans Timeline
                </h4>
                <div className="space-y-2">
                  {traceData.spans.map((span) => (
                    <div key={span.spanId} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-bold">{span.spanId}</span>
                        <span className="font-bold text-slate-200">{span.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400">{span.durationMs} ms</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {span.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MCP Model Context Protocol Tool Call Registry */}
              {traceData.mcpToolCalls.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal size={14} className="text-blue-400" /> Executed MCP Tool Call Payloads
                  </h4>
                  <div className="space-y-3">
                    {traceData.mcpToolCalls.map((tool, idx) => (
                      <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center text-blue-400 font-bold border-b border-slate-800 pb-2">
                          <span>Tool: {tool.toolName}</span>
                          <span className="text-[10px] text-emerald-400">MCP-2026-01-15 Protocol</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Arguments:</div>
                            <pre className="text-slate-300 text-[10px]">{JSON.stringify(tool.args, null, 2)}</pre>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Response Payload:</div>
                            <pre className="text-emerald-300 text-[10px]">{JSON.stringify(tool.result, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final ADK Agent Synthesis */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2 text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Final ADK Agent Output</div>
                {traceData.response}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
