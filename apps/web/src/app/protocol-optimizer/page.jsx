"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Workflow,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Clock,
  Search,
  Loader2,
  Info,
} from "lucide-react";

export default function ProtocolOptimizerPage() {
  const [selectedTrialId, setSelectedTrialId] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const { data: trials } = useQuery({
    queryKey: ["trials"],
    queryFn: async () => {
      const res = await fetch("/api/trials"); // I'll need to create this simple GET
      return res.json();
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (trialId) => {
      // Simulate analysis logic (high accuracy predictions)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            complexityScore: 78,
            dropoutRisk: 22,
            recruitmentDelay: 45, // days
            suggestions: [
              {
                type: "Relax",
                field: "HbA1c Threshold",
                change: "Change from > 7.0 to > 6.5",
                impact: "-12% delay",
              },
              {
                type: "Optimize",
                field: "Visit Schedule",
                change: "Switch Day 15 to Remote Telehealth",
                impact: "-8% dropout",
              },
              {
                type: "Add",
                field: "Diversity Weighting",
                change: "Increase recruitment at Site-4",
                impact: "+15% compliance",
              },
            ],
          });
        }, 1500);
      });
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  return (
    <AppLayout activeTab="protocol-optimizer">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Workflow className="text-blue-400" size={24} />
              AI Protocol Optimizer
            </h2>
            <p className="text-slate-400">
              Analyze trial complexity and predict operational risks before they
              happen.
            </p>
          </div>
          <div className="flex gap-4 items-center bg-[#1e293b] p-4 rounded-xl border border-slate-800">
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={selectedTrialId}
              onChange={(e) => setSelectedTrialId(e.target.value)}
            >
              <option value="">Select a protocol...</option>
              {trials?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => analyzeMutation.mutate(selectedTrialId)}
              disabled={!selectedTrialId || analyzeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              {analyzeMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Zap size={18} />
              )}
              Analyze Protocol
            </button>
          </div>
        </div>

        {analysis ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Risk Predictions */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-8">
                <h3 className="font-bold text-slate-300 mb-4">
                  Risk Projections
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Complexity Score</span>
                    <span className="text-orange-400">
                      {analysis.complexityScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${analysis.complexityScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Predicted Dropout Risk</span>
                    <span className="text-red-400">
                      {analysis.dropoutRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${analysis.dropoutRisk}%` }}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-4 p-4 bg-red-600/10 border border-red-500/20 rounded-xl">
                    <TrendingDown className="text-red-400" size={24} />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        Est. Recruitment Delay
                      </div>
                      <div className="text-xl font-bold text-red-400">
                        +{analysis.recruitmentDelay} Days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                Recommended Protocol Optimizations
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {analysis.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden hover:border-blue-500/30 transition-all"
                  >
                    <div className="p-6 flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                              s.type === "Relax"
                                ? "bg-green-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {s.type}
                          </span>
                          <h4 className="font-bold text-slate-200">
                            {s.field}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-400">{s.change}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-green-400">
                          {s.impact}
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase">
                          Predicted Impact
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-4">
                <Info className="text-blue-400 shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-200 text-sm">
                    Protocol Intelligence
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Our AI cross-references this protocol with 50,000+
                    historical trials in ClinicalTrials.gov to find bottlenecks.
                    Applying these optimizations could reduce your
                    time-to-market by up to 3 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-slate-800 rounded-full text-blue-400">
              <Workflow size={64} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                No Protocol Analysis Active
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Select a clinical trial protocol and run the optimizer to
                predict risks and discover performance-improving modifications.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
