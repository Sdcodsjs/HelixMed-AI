"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Dna,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sparkles,
  Sliders,
  ShieldCheck,
  BarChart3,
  Layers,
  FileCode,
  Info
} from "lucide-react";

export default function CrisprEditorPage() {
  const [selectedGene, setSelectedGene] = useState("BRCA1");
  const [pamType, setPamType] = useState("SpCas9 (NGG)");
  const [sgRNASequence, setSgRNASequence] = useState("GCTCACCACAGGGGAAAAGC");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("off-target");

  const genePresets = {
    BRCA1: {
      name: "BRCA1 (Breast Cancer Type 1)",
      locus: "Chr17:43,044,295-43,125,483",
      exon: "Exon 11 (Pathogenic Variant Hotspot)",
      sequence: "ATGCTGCTCACCACAGGGGAAAAGCTGGACCCCTTGGAACAGCGTG...",
      recommendedSgRNA: "GCTCACCACAGGGGAAAAGC",
      onTargetEfficiency: 92.4,
      cfdScore: 0.88,
      mitScore: 84.5
    },
    TP53: {
      name: "TP53 (Tumor Protein p53)",
      locus: "Chr17:7,668,421-7,687,490",
      exon: "Exon 5 (DNA Binding Domain)",
      sequence: "TACTCCCCCCTGCCCTCAACAAGATGTTTTGCCAACTGGCCAAGAC...",
      recommendedSgRNA: "CCCCCTGCCCTCAACAAGAT",
      onTargetEfficiency: 88.7,
      cfdScore: 0.82,
      mitScore: 79.1
    },
    EGFR: {
      name: "EGFR (Epidermal Growth Factor Receptor)",
      locus: "Chr7:55,086,724-55,275,031",
      exon: "Exon 19 (Deletion E746-A750)",
      sequence: "GGACTCTGGATCCCAGAAGGTGAGAAAGTTAAAATTCCCGTCGCTA...",
      recommendedSgRNA: "ACTCTGGATCCCAGAAGGTG",
      onTargetEfficiency: 94.1,
      cfdScore: 0.91,
      mitScore: 89.3
    },
    CFTR: {
      name: "CFTR (Cystic Fibrosis Transmembrane Regulator)",
      locus: "Chr7:117,480,025-117,668,665",
      exon: "Exon 10 (F508del Deletion Site)",
      sequence: "ACCATTAAAGAAAATATCATCTTTGGTGTTTCCTATGATGAATATA...",
      recommendedSgRNA: "TAAAGAAAATATCATCTTTG",
      onTargetEfficiency: 90.2,
      cfdScore: 0.85,
      mitScore: 82.0
    }
  };

  const currentGene = genePresets[selectedGene];

  const offTargetSites = [
    { chr: "Chr 4", locus: "4:122,891,014", mismatches: "1 MM (Pos 18)", gene: "Intergenic", cfd: 0.12, mit: 14.2, risk: "Low" },
    { chr: "Chr 12", locus: "12:56,331,902", mismatches: "2 MM (Pos 3, 19)", gene: "KMT2D", cfd: 0.08, mit: 8.5, risk: "Low" },
    { chr: "Chr 19", locus: "19:11,045,612", mismatches: "2 MM (Pos 7, 14)", gene: "NOTCH3", cfd: 0.04, mit: 4.1, risk: "Negligible" },
    { chr: "Chr 2", locus: "2:204,112,890", mismatches: "3 MM (Pos 2, 8, 15)", gene: "SF3B1", cfd: 0.01, mit: 1.2, risk: "Negligible" }
  ];

  const handleGeneSelect = (geneKey) => {
    setSelectedGene(geneKey);
    setSgRNASequence(genePresets[geneKey].recommendedSgRNA);
  };

  const handleRunPredictor = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <AppLayout activeTab="/crispr-editor">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Genomic Editing AI
              </span>
              <span className="text-xs text-slate-400">DeepCRISPR v3.4 Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <Dna className="h-7 w-7 text-emerald-400" />
              CRISPR sgRNA Off-Target & Cleavage Efficiency Predictor
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Deep learning sequence-matching engine evaluating CRISPR-Cas9/Cas12 sgRNA efficiency vs genome-wide off-target cleavage risks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunPredictor}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Running Neural Alignment...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  Run Off-Target Prediction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Selection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.keys(genePresets).map((geneKey) => (
            <button
              key={geneKey}
              onClick={() => handleGeneSelect(geneKey)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedGene === geneKey
                  ? "bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-base">{geneKey}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {genePresets[geneKey].onTargetEfficiency}% Eff
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{genePresets[geneKey].exon}</p>
              <p className="text-[11px] font-mono text-emerald-400/90 mt-2">{genePresets[geneKey].locus}</p>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & sgRNA Configuration */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-emerald-400" />
              Guide RNA Configuration
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Target Gene Model</label>
              <input
                type="text"
                disabled
                value={currentGene.name}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Cas Nuclease & PAM Motif</label>
              <select
                value={pamType}
                onChange={(e) => setPamType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="SpCas9 (NGG)">SpCas9 (PAM: NGG) - Standard</option>
                <option value="SaCas9 (NNGRRT)">SaCas9 (PAM: NNGRRT) - Compact</option>
                <option value="AsCas12a (TTTV)">AsCas12a / Cpf1 (PAM: TTTV) - Staggered Cut</option>
                <option value="PrimeEditor (PE3)">Prime Editing PE3 - Flap Target</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">20bp Protospacer sgRNA Sequence</label>
              <div className="relative">
                <input
                  type="text"
                  value={sgRNASequence}
                  onChange={(e) => setSgRNASequence(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 uppercase tracking-wider"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">
                  {sgRNASequence.length}bp
                </span>
              </div>
            </div>

            {/* Score Overview Cards */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <span className="text-xs text-slate-400 block">On-Target Efficiency</span>
                <span className="text-xl font-bold text-emerald-400 mt-1 block">
                  {currentGene.onTargetEfficiency}%
                </span>
                <span className="text-[10px] text-slate-500">DeepSpCas9 Score</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <span className="text-xs text-slate-400 block">MIT Off-Target Score</span>
                <span className="text-xl font-bold text-blue-400 mt-1 block">
                  {currentGene.mitScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
                <span className="text-[10px] text-emerald-400">High Specificity</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300/90 leading-relaxed">
                Zero off-target cleavage risk detected in coding exons. 4 low-probability intergenic sites identified on Chr 4 & Chr 12.
              </p>
            </div>
          </div>

          {/* Results & Off-Target Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("off-target")}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      activeTab === "off-target"
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Off-Target Genome Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("mismatch")}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      activeTab === "mismatch"
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Protospacer Mismatch Matrix
                  </button>
                </div>
                <span className="text-xs text-slate-400 font-mono">GRCh38 / hg38 Reference</span>
              </div>

              {activeTab === "off-target" ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono">
                        <tr>
                          <th className="py-2.5 px-3">Genomic Locus</th>
                          <th className="py-2.5 px-3">Mismatches</th>
                          <th className="py-2.5 px-3">Overlapping Gene</th>
                          <th className="py-2.5 px-3">CFD Score</th>
                          <th className="py-2.5 px-3">MIT Score</th>
                          <th className="py-2.5 px-3">Cleavage Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {offTargetSites.map((site, i) => (
                          <tr key={i} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                            <td className="py-2.5 px-3 font-semibold text-emerald-400">{site.locus}</td>
                            <td className="py-2.5 px-3">{site.mismatches}</td>
                            <td className="py-2.5 px-3">{site.gene}</td>
                            <td className="py-2.5 px-3 text-slate-200">{site.cfd}</td>
                            <td className="py-2.5 px-3 text-slate-200">{site.mit}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                site.risk === "Low" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {site.risk}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Sequence Visualizer */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
                    <span className="text-xs text-slate-400 font-medium block">20bp Guide + PAM Sequence Alignment</span>
                    <div className="flex items-center gap-1 font-mono text-sm tracking-widest text-emerald-400 bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto">
                      {sgRNASequence.split("").map((char, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                          {char}
                        </span>
                      ))}
                      <span className="ml-2 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400 font-bold">
                        AGG (PAM)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Positional sensitivity analysis showing cleavage tolerance per base pair mismatch along the 20bp protospacer seed region (Positions 1-12 seed vs 13-20 non-seed).
                  </p>
                  <div className="grid grid-cols-10 gap-1.5 font-mono text-center">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const pos = idx + 1;
                      const isSeed = pos >= 1 && pos <= 12;
                      return (
                        <div
                          key={pos}
                          className={`p-2 rounded border text-xs ${
                            isSeed
                              ? "bg-rose-950/30 border-rose-500/30 text-rose-300"
                              : "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                          }`}
                        >
                          <div className="font-bold">{pos}</div>
                          <div className="text-[10px] opacity-75 mt-1">{isSeed ? "Seed" : "Tail"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* GenBank FASTA Payload Export */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Export Ready CRISPR Vector Oligo Payload</h4>
                  <p className="text-xs text-slate-400">Generates forward & reverse sense oligo sequences with BsmBI restriction overhangs.</p>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloaded CRISPR oligo payload for ${selectedGene}`)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-2 border border-slate-700"
              >
                <Download className="h-3.5 w-3.5" />
                Export Oligo Payload (.FASTA)
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
