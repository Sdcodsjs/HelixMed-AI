"use client";
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Users,
  Server,
  Zap,
  ShieldCheck,
  Activity,
  Loader2,
  Play,
  RotateCcw,
  AlertTriangle,
  Download,
  Lock,
  FileCheck,
  Eye,
  Sliders,
  X,
  CheckCircle2,
  Database
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const INITIAL_NODES = [
  {
    id: "nodeA",
    name: "Mayo Clinic",
    color: "#3b82f6",
    dataSize: "4,500 Patients",
    accuracy: "88.2",
    privacyBudget: 0.8,
    status: "Online",
    details: {
      loss: 0.118,
      localEpochs: 5,
      noiseScale: "1.2 (Laplacian)",
      dataCategories: "Oncology, Cardiology",
      lastSync: "Just now",
    },
  },
  {
    id: "nodeB",
    name: "Johns Hopkins",
    color: "#a855f7",
    dataSize: "3,200 Patients",
    accuracy: "86.5",
    privacyBudget: 1.2,
    status: "Online",
    details: {
      loss: 0.135,
      localEpochs: 5,
      noiseScale: "1.5 (Gaussian)",
      dataCategories: "Endocrinology, ICU",
      lastSync: "2 mins ago",
    },
  },
  {
    id: "nodeC",
    name: "Mount Sinai",
    color: "#f97316",
    dataSize: "2,800 Patients",
    accuracy: "85.9",
    privacyBudget: 0.5,
    status: "Syncing",
    details: {
      loss: 0.141,
      localEpochs: 5,
      noiseScale: "1.0 (Laplacian)",
      dataCategories: "Genomics, Pulmonology",
      lastSync: "Syncing...",
    },
  },
];

export default function FederatedLearningPage() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [rounds, setRounds] = useState([
    { round: 1, accuracy: 68.4, loss: 0.316 },
    { round: 2, accuracy: 74.1, loss: 0.259 },
    { round: 3, accuracy: 81.2, loss: 0.188 },
  ]);
  const [isTraining, setIsTraining] = useState(false);
  const [currentRound, setCurrentRound] = useState(3);
  const [replayRound, setReplayRound] = useState(0);
  const [userRole, setUserRole] = useState("researcher"); // researcher, clinician, auditor
  const [epsilonBudget, setEpsilonBudget] = useState(0.45);
  const [privacyAlert, setPrivacyAlert] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);
  const [auditLedger, setAuditLedger] = useState([
    { round: 1, time: "11:30:15", event: "Node Initialized & DP Noise Injected", hash: "0x8f2a...39b1" },
    { round: 2, time: "11:31:02", event: "FedAvg Weight Vector Aggregated", hash: "0x4b91...c81f" },
    { round: 3, time: "11:32:44", event: "Mayo Clinic & Johns Hopkins Synced", hash: "0x91d4...a20e" },
  ]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const startTraining = () => {
    if (userRole === "clinician") {
      showToast("Access Restricted: Clinical Investigators are in View-Only mode.");
      return;
    }
    setIsTraining(true);
    showToast("FedAvg Synchronization Started across 3 hospital nodes...");
  };

  const handleMitigation = () => {
    setEpsilonBudget(0.55);
    setPrivacyAlert(false);
    showToast("Adaptive Gaussian noise scaling applied! Privacy budget reset to 0.55 ε.");
  };

  useEffect(() => {
    if (isTraining && currentRound < 10) {
      const timer = setTimeout(() => {
        const nextRoundNum = currentRound + 1;
        
        setRounds((prev) => {
          const lastAcc = prev.length > 0 ? prev[prev.length - 1].accuracy : 65;
          const newAcc = Math.min(lastAcc + Math.random() * 3.5, 94.8);
          return [
            ...prev,
            {
              round: nextRoundNum,
              accuracy: parseFloat(newAcc.toFixed(1)),
              loss: parseFloat((1 - newAcc / 100).toFixed(3)),
            },
          ];
        });

        setEpsilonBudget((prev) => {
          const updated = prev + 0.14;
          if (updated > 1.2 && !privacyAlert) setPrivacyAlert(true);
          return parseFloat(updated.toFixed(2));
        });

        // Update local node accuracies
        setNodes((prevNodes) =>
          prevNodes.map((n) => ({
            ...n,
            accuracy: (parseFloat(n.accuracy) + Math.random() * 0.8).toFixed(1),
            status: "Online",
          }))
        );

        setAuditLedger((prev) => [
          {
            round: nextRoundNum,
            time: new Date().toLocaleTimeString(),
            event: `FedAvg Round ${nextRoundNum} Weights Aggregated (DP Noise Injected)`,
            hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          },
          ...prev,
        ]);

        setCurrentRound(nextRoundNum);
        if (nextRoundNum >= 10) {
          setIsTraining(false);
          showToast("FedAvg Convergence Achieved (Round 10/10 - 94.8% Accuracy)");
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isTraining, currentRound]);

  const exportTopologySnapshot = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            nodes,
            rounds,
            auditLedger,
            epsilonBudget,
            role: userRole,
            exportTime: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `federated_topology_snapshot_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Federated Topology Snapshot exported to JSON file.");
  };

  const displayedRounds =
    replayRound > 0 ? rounds.slice(0, replayRound) : rounds;

  return (
    <AppLayout activeTab="federated">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Notification */}
        {actionNotice && (
          <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 border border-blue-400/40 animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Users className="text-blue-400" size={24} />
              Federated Node Network Topology & Privacy Budget Visualizer
            </h2>
            <p className="text-slate-400 text-sm">
              Collaborative FedAvg training across hospital nodes with Differential Privacy (ε-budget) & Blockchain Audit Ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* RBAC Selector */}
            <div className="flex items-center gap-2 bg-[#1e293b] px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-semibold">
              <Lock size={14} className="text-blue-400" />
              <span className="text-slate-400">RBAC Role:</span>
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value);
                  showToast(`Switched role to: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-slate-900 text-white font-bold border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value="researcher">Lead Researcher</option>
                <option value="clinician">Clinical Investigator</option>
                <option value="auditor">Compliance Auditor</option>
              </select>
            </div>

            <button
              onClick={exportTopologySnapshot}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download size={15} className="text-blue-400" /> Export Snapshot
            </button>

            <button
              onClick={startTraining}
              disabled={isTraining}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {isTraining ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Play size={18} />
              )}
              {isTraining ? `Syncing Round ${currentRound}/10...` : "Start FedAvg Sync"}
            </button>
          </div>
        </div>

        {/* Adaptive Privacy Budget Alert Toast */}
        {privacyAlert && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-400 shrink-0" size={22} />
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  Differential Privacy Threshold Alert (ε-Budget Near Limit)
                </h4>
                <p className="text-xs text-amber-200/80">
                  Cumulative privacy budget has reached <span className="font-bold text-white">{epsilonBudget} ε</span> / 2.00 ε limit. Adaptive Gaussian noise scaling recommended.
                </p>
              </div>
            </div>
            <button
              onClick={handleMitigation}
              className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3.5 py-2 rounded-lg border border-amber-500/40 transition-colors shrink-0"
            >
              Apply Noise Mitigation
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Hospital Nodes Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Hospital Nodes (Click for Drill-Down)
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DP ε-Protected
              </span>
            </h3>

            {nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <Server size={18} style={{ color: node.color }} />
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">
                        {node.name}
                      </span>
                      <div className="text-[10px] text-slate-400">{node.details.dataCategories}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {node.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Dataset</div>
                    <div className="font-bold text-white">{node.dataSize}</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Local Acc</div>
                    <div className="font-bold text-blue-400">{node.accuracy}%</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Differential Privacy Counter Gauge */}
            <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-3 text-center shadow-md">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Differential Privacy Budget (ε-Budget Consumption)
              </h4>
              <div className="text-3xl font-extrabold font-mono text-white">
                {epsilonBudget} <span className="text-xs font-normal text-slate-400">/ 2.00 ε</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500 shadow-inner"
                  style={{ width: `${Math.min((epsilonBudget / 2.0) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                DP Noise Type: <span className="text-emerald-400 font-bold">Gaussian (σ=1.2)</span>
              </div>
            </div>
          </div>

          {/* Training Convergence, Replay Scrubber & Audit Trail */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">Global Model Accuracy Convergence</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    RBAC Role:{" "}
                    <span className="text-blue-400 font-extrabold capitalize bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {userRole} Mode
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 text-xs font-mono">
                  <span className="text-blue-400 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Round: {currentRound}/10
                  </span>
                  <span className="text-emerald-400 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    Global Acc: {displayedRounds.length > 0 ? displayedRounds[displayedRounds.length - 1].accuracy : "--"}%
                  </span>
                </div>
              </div>

              {/* Topology Replay Scrubber */}
              {rounds.length > 0 && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <RotateCcw size={14} className="text-purple-400" /> Topology Replay Scrubber
                    </span>
                    <span className="font-mono text-purple-400 font-bold">
                      {replayRound > 0 ? `Viewing Round ${replayRound}` : "Live Aggregation Feed"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={rounds.length}
                    value={replayRound}
                    onChange={(e) => setReplayRound(Number(e.target.value))}
                    className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Recharts Accuracy Graph */}
              <div className="h-[230px] w-full">
                {displayedRounds.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayedRounds}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="round" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }}
                        itemStyle={{ color: "#38bdf8", fontWeight: "bold", fontSize: "12px" }}
                        labelStyle={{ color: "#94a3b8", fontSize: "11px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#3b82f6" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-xs italic">
                    Click "Start FedAvg Sync" to visualize node aggregation history.
                  </div>
                )}
              </div>
            </div>

            {/* Blockchain Audit Ledger */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileCheck size={18} className="text-emerald-400" />
                  Blockchain Tamper-Proof Audit Ledger
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {auditLedger.length} Verified Logs
                </span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-xs custom-scrollbar">
                {auditLedger.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex justify-between items-center hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-white font-sans font-semibold">{item.event}</div>
                      <div className="text-[10px] text-slate-400">Timestamp: {item.time}</div>
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 shrink-0">
                      {item.hash}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Drill-Down Analytics Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Server size={20} style={{ color: selectedNode.color }} />
                  {selectedNode.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Drill-Down Node Telemetry & Privacy Consumption Profile</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Local Loss Rate:</span>
                <span className="font-mono text-blue-400 font-bold">{selectedNode.details.loss}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Local Epochs per Round:</span>
                <span className="font-mono text-white font-bold">{selectedNode.details.localEpochs}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">DP Noise Scale:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedNode.details.noiseScale}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Data Categories:</span>
                <span className="text-slate-200 font-semibold">{selectedNode.details.dataCategories}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Last Weight Sync:</span>
                <span className="text-slate-300 font-mono">{selectedNode.details.lastSync}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              Close Node Analytics
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
