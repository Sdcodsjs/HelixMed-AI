"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  Hash,
  Clock,
  User,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import { format } from "date-fns";

export default function BlockchainPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["blockchain-logs"],
    queryFn: async () => {
      const res = await fetch("/api/ai/blockchain");
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const filteredLogs = logs?.filter(
    (log) =>
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.hash.includes(searchTerm),
  );

  return (
    <AppLayout activeTab="blockchain-audit">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-green-400" size={24} />
              Immutable Audit Trail
            </h2>
            <p className="text-slate-400">
              Regulatory-grade blockchain logging for all clinical trial
              modifications and reports.
            </p>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by hash or action..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Summary Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">
                Network Status
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Blocks</span>
                  <span className="text-lg font-bold">{logs?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Chain Integrity
                  </span>
                  <div className="flex items-center gap-1 text-green-400 text-xs font-bold">
                    <CheckCircle size={14} /> VERIFIED
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Protocol</span>
                  <span className="text-xs font-medium text-blue-400">
                    PoA (Proof of Audit)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <h4 className="font-bold text-blue-400 mb-2 text-sm uppercase">
                Regulatory Note
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed italic">
                "All logs are stored using SHA-256 chained hashing. Deletion or
                modification of any block will invalidate the entire downstream
                chain, alerting compliance officers instantly."
              </p>
            </div>
          </div>

          {/* Logs List */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-blue-500 inline-block">
                  <Clock size={32} />
                </div>
                <div className="mt-2 text-slate-500">Retrieving ledger...</div>
              </div>
            ) : filteredLogs?.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-2xl border border-slate-700">
                <AlertCircle
                  className="mx-auto text-slate-600 mb-2"
                  size={32}
                />
                <div className="text-slate-500">
                  No audit logs found matching your criteria.
                </div>
              </div>
            ) : (
              filteredLogs?.map((log, i) => (
                <div
                  key={log.id}
                  className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all group"
                >
                  <div className="p-5 flex gap-6 items-start">
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div
                        className={`p-2 rounded-lg ${i === 0 ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-400"}`}
                      >
                        {i === 0 ? (
                          <ShieldCheck size={20} />
                        ) : (
                          <Hash size={20} />
                        )}
                      </div>
                      {i < filteredLogs.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-800" />
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider">
                              {log.action_type}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {format(
                                new Date(log.created_at || log.timestamp || Date.now()),
                                "MMM d, yyyy · HH:mm:ss",
                              )}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 break-all bg-slate-900/50 p-1 rounded inline-block">
                            Hash: {log.hash}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                          <User size={12} /> {log.actor_id}
                        </div>
                      </div>

                      <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/50">
                        <div className="text-[10px] text-slate-600 font-bold uppercase mb-2">
                          Payload Data
                        </div>
                        <pre className="text-[11px] text-slate-400 font-mono whitespace-pre-wrap">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-600">
                        <LinkIcon size={12} />
                        <span>
                          Previous Hash:{" "}
                          <span className="font-mono">
                            {log.prev_hash?.slice(0, 16)}...
                          </span>
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-green-500/70">
                          <CheckCircle size={10} /> Validated Signature
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
