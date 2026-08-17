"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Dna,
  Activity,
  Zap,
  ShieldCheck,
  Search,
  Sliders,
  Sparkles,
  BarChart3,
  AlertTriangle,
  FileCheck,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const GENOMIC_VARIANTS = [
  {
    gene: "CYP2D6",
    variant: "*4/*5 (Loss of Function)",
    type: "Pharmacogenomic",
    phenotype: "Poor Metabolizer",
    drugImpact: "Tamoxifen, Codeine, Metoprolol",
    pathogenicity: "Pathogenic",
    score: 94,
    recommendedDose: "Reduce standard dose by 50% or substitute alternative drug.",
  },
  {
    gene: "EGFR",
    variant: "T790M Mutation",
    type: "Somatic Mutation",
    phenotype: "TKI Resistance",
    drugImpact: "Gefitinib, Erlotinib",
    pathogenicity: "High Risk",
    score: 88,
    recommendedDose: "Switch to 3rd generation EGFR-TKI (Osimertinib).",
  },
  {
    gene: "DPYD",
    variant: "*2A (rs3918290)",
    type: "Metabolic Risk",
    phenotype: "Deficient DPD Activity",
    drugImpact: "5-Fluorouracil, Capecitabine",
    pathogenicity: "Critical Hazard",
    score: 98,
    recommendedDose: "Avoid 5-FU/Capecitabine or reduce dose by >75% under ICU monitoring.",
  },
  {
    gene: "TPMT",
    variant: "*3A/*3C",
    type: "Myelosuppression",
    phenotype: "Intermediate Metabolizer",
    drugImpact: "Azathioprine, Mercaptopurine",
    pathogenicity: "Moderate",
    score: 72,
    recommendedDose: "Reduce Azathioprine dose by 30-50%. Monitor WBC weekly.",
  },
];

const EXPRESSION_DATA = [
  { cellType: "T-Cells CD8+", expression: 8.4, baseline: 5.2 },
  { cellType: "B-Cells CD19+", expression: 3.1, baseline: 4.8 },
  { cellType: "NK Cells", expression: 9.2, baseline: 6.0 },
  { cellType: "Macrophages M1", expression: 7.8, baseline: 4.5 },
  { cellType: "Monocytes", expression: 4.2, baseline: 4.0 },
  { cellType: "Dendritic Cells", expression: 6.5, baseline: 5.0 },
];

const RADAR_DATA = [
  { metric: "Drug Metabolism", score: 32 },
  { metric: "Toxicity Risk", score: 88 },
  { metric: "Target Affinity", score: 92 },
  { metric: "Immune Evasion", score: 65 },
  { metric: "Clearance Rate", score: 45 },
  { metric: "DNA Repair", score: 78 },
];

export default function GenomicsPage() {
  const [selectedVariant, setSelectedVariant] = useState(GENOMIC_VARIANTS[0]);
  const [activeTab, setActiveTab] = useState("variants");
  const [doseAdjustment, setDoseAdjustment] = useState(50);

  return (
    <AppLayout activeTab="genomics">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Dna className="text-purple-400" size={26} />
              Multi-Omics Genomic & Epigenomic Biomarker Explorer
            </h2>
            <p className="text-slate-400 text-sm">
              Single-cell RNA-seq expression, DNA methylation & pharmacogenomic drug metabolism dosing calculator.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 text-purple-300 px-3.5 py-2 rounded-xl border border-purple-500/30 text-xs font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              ClinVar & PharmGKB Integrated
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">Active Patient VCF Profile</div>
            <div className="text-lg font-bold text-white">PT-9042 (Sarah Jenkins)</div>
            <div className="text-[11px] text-purple-400 font-mono mt-1">Whole Genome 30x Sequenced</div>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">Pathogenic Variants Detected</div>
            <div className="text-xl font-extrabold text-red-400">4 Actionable Markers</div>
            <div className="text-[11px] text-slate-400 mt-1">CYP2D6, EGFR, DPYD, TPMT</div>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">Metabolizer Phenotype</div>
            <div className="text-xl font-extrabold text-amber-400">CYP2D6 Poor Metabolizer</div>
            <div className="text-[11px] text-slate-400 mt-1">High Toxicity Risk</div>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-1">Immune Cell Expression</div>
            <div className="text-xl font-extrabold text-emerald-400">CD8+ Infiltration 8.4x</div>
            <div className="text-[11px] text-slate-400 mt-1">High Immunotherapy Response</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Actionable Genomic Variants List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              Actionable Variants (VCF Annotation)
              <span className="text-[10px] text-purple-400 font-mono">4 Variants Filtered</span>
            </h3>

            <div className="space-y-3">
              {GENOMIC_VARIANTS.map((variant) => (
                <div
                  key={variant.gene}
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedVariant.gene === variant.gene
                      ? "bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-500/10"
                      : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-extrabold text-white text-base">{variant.gene}</span>
                      <span className="text-xs text-purple-400 font-mono block">{variant.variant}</span>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        variant.pathogenicity === "Critical Hazard" || variant.pathogenicity === "Pathogenic"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {variant.pathogenicity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500">Phenotype:</span> {variant.phenotype}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    <span className="text-slate-500">Affected Drugs:</span> {variant.drugImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Pharmacogenomic Dosing Calculator & Radar Analysis */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pharmacogenomic Dosing Calculator */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Zap className="text-yellow-400" size={18} />
                    Pharmacogenomic Dosing Calculator — {selectedVariant.gene}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Genotype-guided dose modification based on CPIC / PharmGKB guidelines
                  </p>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                  {selectedVariant.phenotype}
                </span>
              </div>

              {/* Recommendation Box */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Info size={16} className="text-blue-400" />
                  Clinical Recommendation:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{selectedVariant.recommendedDose}"
                </p>
              </div>

              {/* Dosage Slider */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Simulated Dose Percentage:</span>
                  <span className="text-purple-400 font-mono text-sm font-extrabold">{doseAdjustment}% of Standard Dose</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={doseAdjustment}
                  onChange={(e) => setDoseAdjustment(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>10% (Micro-dose)</span>
                  <span>50% (Recommended)</span>
                  <span>100% (Standard Dose - High Risk)</span>
                </div>
              </div>
            </div>

            {/* Single-Cell Expression & Pharmacogenomic Radar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Single-Cell RNA-seq Expression */}
              <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Single-Cell RNA-seq Expression
                </h4>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={EXPRESSION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="cellType" stroke="#94a3b8" fontSize={9} interval={0} />
                      <YAxis stroke="#94a3b8" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", fontSize: "11px" }} />
                      <Bar dataKey="expression" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pharmacogenomic Phenotype Radar */}
              <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Genomic Phenotype Impact
                </h4>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={9} />
                      <PolarRadiusAxis stroke="#334155" fontSize={8} />
                      <Radar name="Patient Score" dataKey="score" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
