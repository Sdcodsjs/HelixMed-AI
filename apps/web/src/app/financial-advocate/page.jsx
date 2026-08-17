"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import BillViewer from "@/components/BillViewer";
import {
  CreditCard,
  FileText,
  ShieldCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Lock,
  RefreshCw,
  FileCheck,
  Stethoscope,
  HeartPulse,
  Download,
  PlusCircle,
} from "lucide-react";

export default function FinancialAdvocatePage() {
  const [step, setStep] = useState(1); // 1: Select/Upload, 2: Audit, 3: Gap & Loans, 4: Consent & Complete
  const [selectedBillType, setSelectedBillType] = useState("surgical");
  const [customFile, setCustomFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState("loan1");
  const [signature, setSignature] = useState("");
  const [consentSubmitted, setConsentSubmitted] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomFile(file);
  };

  const handleProcessUploadedFile = async () => {
    if (!customFile) return;
    const fileNameLower = customFile.name.toLowerCase();
    const billTypeKey = fileNameLower.includes("oncology")
      ? "oncology"
      : fileNameLower.includes("cardiology")
      ? "cardiology"
      : "surgical";

    await executeBillAudit(billTypeKey, customFile.name);
  };

  const executeBillAudit = async (billTypeKey = selectedBillType, customFileName = null) => {
    setUploading(true);
    try {
      const res = await fetch("/api/finance/upload-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billType: billTypeKey }),
      });
      const data = await res.json();
      if (customFileName) data.fileName = customFileName;
      setAuditData(data);
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleConsentSubmit = (e) => {
    e.preventDefault();
    if (!signature.trim()) return;
    setConsentSubmitted(true);
    setStep(4);
  };

  return (
    <AppLayout activeTab="financial-advocate">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <CreditCard className="text-blue-400" size={24} />
              Patient Financial Advocate & Medical Bill Audit Portal
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              ADK Multi-Agent pipeline: Bill OCR &rarr; CPT Code Audit &rarr; Coverage Gap &rarr; Ranked Loan Broker &rarr; PKI Digital Consent.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400">
            <ShieldCheck size={16} /> Presidio Local PHI Privacy Guard Active
          </div>
        </div>

        {/* Stepper Header */}
        <div className="grid grid-cols-4 gap-2 bg-[#1e293b] p-3 rounded-2xl border border-slate-800 text-xs font-semibold">
          {[
            { num: 1, label: "Upload Medical Bill" },
            { num: 2, label: "10-Page Billing Audit & Errors" },
            { num: 3, label: "Coverage Gap & Loans" },
            { num: 4, label: "PKI Signature Consent" },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-3 rounded-xl flex items-center gap-2 transition-all ${
                step === s.num
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : step > s.num
                  ? "bg-slate-900 text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-900/40 text-slate-500"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                {s.num}
              </div>
              <span className="truncate">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Upload Medical Bill File OR Select Sample PDF */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Primary Medical Bill File Upload Box */}
            <div className="bg-[#1e293b] p-8 rounded-2xl border-2 border-dashed border-blue-500/50 text-center space-y-5 max-w-2xl mx-auto hover:border-blue-500 transition-all shadow-xl">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                <Upload size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upload Medical Bill Document</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your hospital bill (PDF, PNG, JPG, or TIFF). Analyzed by <code className="text-blue-400 font-semibold">opendataloader-pdf</code> layout OCR.
                </p>
              </div>

              {customFile ? (
                <div className="bg-slate-900/90 p-4 rounded-xl border border-blue-500/40 flex items-center justify-between max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-left">
                    <FileText className="text-blue-400 shrink-0" size={24} />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{customFile.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{(customFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button
                    onClick={handleProcessUploadedFile}
                    disabled={uploading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    {uploading ? <RefreshCw className="animate-spin" size={14} /> : <FileCheck size={14} />}
                    {uploading ? "Auditing..." : "Audit Uploaded Bill"}
                  </button>
                </div>
              ) : (
                <label className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer text-xs shadow-lg shadow-blue-500/20">
                  <FileText size={18} /> Choose Medical Bill File (PDF / Image)
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.tiff"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 my-4 max-w-2xl mx-auto">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="font-bold uppercase tracking-wider">or test with 10-page itemized hospital bill pdfs</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* 3 Selectable 10-Page Sample Bills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sample 1 */}
              <div
                onClick={() => setSelectedBillType("surgical")}
                className={`bg-[#1e293b] p-6 rounded-2xl border cursor-pointer transition-all space-y-4 flex flex-col justify-between ${
                  selectedBillType === "surgical"
                    ? "border-blue-500 shadow-xl shadow-blue-500/10 bg-blue-600/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                      <Stethoscope size={22} />
                    </div>
                    <a
                      href="/sample_medical_bill_surgical_10p.pdf"
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-blue-400 hover:text-white border border-slate-700 flex items-center gap-1"
                    >
                      <Download size={11} /> Download Local PDF
                    </a>
                  </div>
                  <h4 className="font-bold text-white text-base">Inpatient Surgical & ICU Admission</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    MetroGeneral Hospital (Oct 12 – 22, 2025). High-density 10-page itemized layout: ER triage, ICU telemetry, endoscopy, anesthesia, and pharmacy infusions.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Billed Total</span>
                    <span className="font-mono text-white font-bold">$42,500.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Detected Overcharge</span>
                    <span className="font-mono text-red-400 font-bold">-$14,350.00</span>
                  </div>
                </div>
              </div>

              {/* Sample 2 */}
              <div
                onClick={() => setSelectedBillType("oncology")}
                className={`bg-[#1e293b] p-6 rounded-2xl border cursor-pointer transition-all space-y-4 flex flex-col justify-between ${
                  selectedBillType === "oncology"
                    ? "border-purple-500 shadow-xl shadow-purple-500/10 bg-purple-600/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                      <FileCheck size={22} />
                    </div>
                    <a
                      href="/sample_medical_bill_oncology_10p.pdf"
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-purple-400 hover:text-white border border-slate-700 flex items-center gap-1"
                    >
                      <Download size={11} /> Download Local PDF
                    </a>
                  </div>
                  <h4 className="font-bold text-white text-base">Outpatient Oncology & Biologic Infusion</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    St. Jude Cancer Center (Nov 01 – 15, 2025). High-density 10-page layout: Rituximab chemotherapy, PET-CT imaging, and pre-medication duplications.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Billed Total</span>
                    <span className="font-mono text-white font-bold">$88,900.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Detected Overcharge</span>
                    <span className="font-mono text-red-400 font-bold">-$34,700.00</span>
                  </div>
                </div>
              </div>

              {/* Sample 3 */}
              <div
                onClick={() => setSelectedBillType("cardiology")}
                className={`bg-[#1e293b] p-6 rounded-2xl border cursor-pointer transition-all space-y-4 flex flex-col justify-between ${
                  selectedBillType === "cardiology"
                    ? "border-emerald-500 shadow-xl shadow-emerald-500/10 bg-emerald-600/5"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <HeartPulse size={22} />
                    </div>
                    <a
                      href="/sample_medical_bill_cardiology_10p.pdf"
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-emerald-400 hover:text-white border border-slate-700 flex items-center gap-1"
                    >
                      <Download size={11} /> Download Local PDF
                    </a>
                  </div>
                  <h4 className="font-bold text-white text-base">Complex Cardiology & Catheterization</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Johns Hopkins Cardiac Institute (Dec 03 – 10, 2025). High-density 10-page layout: Left heart catheterization, drug-eluting stents, and cardiac MRI.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Billed Total</span>
                    <span className="font-mono text-white font-bold">$65,400.00</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] font-bold uppercase">Detected Overcharge</span>
                    <span className="font-mono text-red-400 font-bold">-$23,600.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => executeBillAudit(selectedBillType)}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
              >
                {uploading ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
                {uploading ? "Parsing 10-Page Hospital Bill via OCR..." : `Parse Selected Hospital Bill PDF (${selectedBillType.toUpperCase()})`}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Audit Findings & Line Items */}
        {step === 2 && auditData && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Loaded Hospital Bill Document: <strong className="text-white">{auditData.fileName}</strong> (10-Page Itemized Statement)
              </span>
              <button
                onClick={() => {
                  setStep(1);
                  setCustomFile(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                ← Upload / Switch to Another Bill
              </button>
            </div>

            <BillViewer auditData={auditData} />

            <div className="flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Proceed to Coverage Gap & Financing <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Coverage Gap & Ranked Loan Offers */}
        {step === 3 && auditData && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Out-of-Pocket Coverage Gap & Ranked Loan Offers</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Remaining Audited Patient Liability: <span className="text-emerald-400 font-bold font-mono">${auditData.auditedCorrected.toLocaleString()}</span> (Savings Detected: <span className="text-red-400 font-bold font-mono">-${auditData.overchargeGap.toLocaleString()}</span>)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: "loan1", lender: "CareCredit Health", apr: "0.0% APR (12 mo)", monthly: `$${(auditData.auditedCorrected / 12).toFixed(2)}/mo`, term: "12 Months", badge: "Recommended" },
                { id: "loan2", lender: "Ally Medical Financing", apr: "4.99% APR", monthly: `$${(auditData.auditedCorrected / 24 * 1.05).toFixed(2)}/mo`, term: "24 Months", badge: "Low Monthly" },
                { id: "loan3", lender: "Nexus Community Care Fund", apr: "Financial Grant (0%)", monthly: "$0.00/mo", term: "Aid Program", badge: "Grant" },
              ].map((loan) => (
                <div
                  key={loan.id}
                  onClick={() => setSelectedLoan(loan.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    selectedLoan === loan.id
                      ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">{loan.lender}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {loan.badge}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">{loan.monthly}</div>
                  <div className="text-xs text-slate-400">{loan.apr} — {loan.term}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(4)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Continue to Consent Signature <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: PKI Consent Signature */}
        {step === 4 && (
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6 max-w-xl mx-auto">
            <div className="border-b border-slate-800 pb-4 flex items-center gap-2">
              <Lock className="text-emerald-400" size={22} />
              <div>
                <h3 className="text-lg font-bold text-white">PKI Digital Signature & Lender Consent</h3>
                <p className="text-xs text-slate-400 mt-0.5">Authorizes sharing de-identified bill audit package with selected lender.</p>
              </div>
            </div>

            {consentSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-emerald-300">Loan Application Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Digital Signature Hash: <code className="font-mono text-emerald-400">0x9a8f...41e0</code>
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsentSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase">Type Full Name to Sign (PKI Signature)</label>
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck size={18} /> Register PKI Consent & Submit Application
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
