"use client";
import React from "react";
import { FileText, AlertTriangle, CheckCircle2, DollarSign, ExternalLink, ShieldCheck, Download } from "lucide-react";
import { generateAuditedBillPDF } from "@/utils/generateAuditedBillPDF";

export default function BillViewer({ auditData }) {
  if (!auditData) return null;

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-400" size={22} />
            <h3 className="text-lg font-bold text-white">Interactive Medical Bill Audit Viewer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Parsed via <code className="text-blue-400">opendataloader-pdf</code> & audited by ADK Financial Agent.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <button
            onClick={() => generateAuditedBillPDF(auditData)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Download size={14} /> Export Audited Bill Report
          </button>
          <span className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-1">
            <AlertTriangle size={14} /> Potential Savings: ${auditData.overchargeGap.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bill Overview Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Total Billed</div>
          <div className="text-lg font-bold text-white font-mono">${auditData.totalBilled.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Audited Fair Cost</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">${auditData.auditedCorrected.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Bill ID</div>
          <div className="text-sm font-bold text-slate-200 font-mono">{auditData.billId}</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Provider</div>
          <div className="text-sm font-bold text-slate-200">{auditData.provider}</div>
        </div>
      </div>

      {/* Interactive Line-Item Annotation List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annotated Line-Item Audit Layer</div>
        <div className="space-y-2">
          {auditData.lineItems.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                item.recommended < item.billed
                  ? "bg-red-500/5 border-red-500/30 hover:border-red-500/50"
                  : "bg-slate-900/50 border-slate-800"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-200">{item.code}</span>
                  {item.recommended < item.billed ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                      {item.flag}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.flag}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Billed</span>
                  <span className="text-slate-300 font-bold">${(item.billed || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Fair Rate</span>
                  <span className="text-emerald-400 font-bold">${(item.recommended || 0).toFixed(2)}</span>
                </div>
                {(item.billed || 0) > (item.recommended || 0) && (
                  <div className="bg-red-500/10 px-2 py-1 rounded border border-red-500/20 text-red-400 font-bold">
                    -${((item.billed || 0) - (item.recommended || 0)).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
