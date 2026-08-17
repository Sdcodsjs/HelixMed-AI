"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Download,
  Search,
  Activity,
  Dna,
  ShieldCheck,
  Info
} from "lucide-react";

export default function ProteinDockingPage() {
  const [selectedTarget, setSelectedTarget] = useState("KRAS_G12C");
  const [activeLigand, setActiveLigand] = useState("Sotorasib (AMG 510)");
  const [rotationAngle, setRotationAngle] = useState(45);
  const [pocketSurface, setPocketSurface] = useState(true);
  const [isDocking, setIsDocking] = useState(false);

  const targetTargets = {
    KRAS_G12C: {
      pdbId: "6V56",
      name: "KRAS G12C Mutant (Oncogenic GTPase)",
      disease: "Non-Small Cell Lung Cancer (NSCLC)",
      pocketResidues: "Cys12, Asp69, His95, Tyr96",
      bindingAffinityKd: "0.42 nM",
      bindingEnergy: "-11.8 kcal/mol",
      hBonds: 4,
      ligands: ["Sotorasib (AMG 510)", "Adagrasib (MRTX849)", "Divarasib (GDC-6036)"]
    },
    EGFR_T790M: {
      pdbId: "4ZAU",
      name: "EGFR T790M / L858R Double Mutant Kinase",
      disease: "EGFR-Mutated Adenocarcinoma",
      pocketResidues: "Met790, Cys797, Leu844, Thr854",
      bindingAffinityKd: "0.18 nM",
      bindingEnergy: "-12.4 kcal/mol",
      hBonds: 5,
      ligands: ["Osimertinib (AZD9291)", "Nazartinib (EGF816)", "Alflutinib"]
    },
    HER2_ECD: {
      pdbId: "1N8Z",
      name: "HER2 (ErbB2) Extracellular Domain",
      disease: "HER2-Positive Breast Carcinoma",
      pocketResidues: "Cys563, Phe573, Lys591, Glu609",
      bindingAffinityKd: "5.10 nM",
      bindingEnergy: "-9.7 kcal/mol",
      hBonds: 3,
      ligands: ["Trastuzumab Deruxtecan", "Tucatinib (ONT-380)", "Lapatinib"]
    },
    Mpro_CoV2: {
      pdbId: "6LU7",
      name: "SARS-CoV-2 Main Protease (Mpro / 3CLpro)",
      disease: "Viral Polyprotein Cleavage",
      pocketResidues: "His41, Cys145, Glu166, Gln189",
      bindingAffinityKd: "3.10 nM",
      bindingEnergy: "-10.2 kcal/mol",
      hBonds: 6,
      ligands: ["Nirmatrelvir (PF-07321332)", "Ensitrelvir (S-217622)", "Ritonavir"]
    }
  };

  const current = targetTargets[selectedTarget];

  const handleDockSim = () => {
    setIsDocking(true);
    setTimeout(() => {
      setIsDocking(false);
    }, 700);
  };

  return (
    <AppLayout activeTab="/protein-docking">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                AlphaFold & AutoDock Vina AI
              </span>
              <span className="text-xs text-slate-400">PDB Structural Bank</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
              <Layers className="h-7 w-7 text-purple-400" />
              AlphaFold 3D Protein Structure & Ligand Docking Studio
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Interactive 3D macromolecular protein surface viewer calculating binding affinities ($K_d$) and hydrogen bond distances for small-molecule drug candidates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDockSim}
              disabled={isDocking}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
            >
              {isDocking ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Calculating AutoDock Vina Field...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  Run Docking Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.keys(targetTargets).map((tKey) => (
            <button
              key={tKey}
              onClick={() => {
                setSelectedTarget(tKey);
                setActiveLigand(targetTargets[tKey].ligands[0]);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedTarget === tKey
                  ? "bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-base">{tKey}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                  PDB: {targetTargets[tKey].pdbId}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{targetTargets[tKey].name}</p>
              <p className="text-[11px] font-mono text-purple-400 mt-2">{targetTargets[tKey].bindingEnergy}</p>
            </button>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Metrics */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="h-4 w-4 text-purple-400" />
              Docking & Ligand Controls
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Target Protein Macromolecule</label>
              <input
                type="text"
                disabled
                value={current.name}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Small Molecule Candidate Ligand</label>
              <select
                value={activeLigand}
                onChange={(e) => setActiveLigand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {current.ligands.map((lig, idx) => (
                  <option key={idx} value={lig}>{lig}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300">Pocket Binding Surface Mesh</span>
              <button
                onClick={() => setPocketSurface(!pocketSurface)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  pocketSurface ? "bg-purple-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    pocketSurface ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Affinity Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <span className="text-xs text-slate-400 block">Binding Affinity ($K_d$)</span>
                <span className="text-lg font-bold text-purple-400 mt-1 block">{current.bindingAffinityKd}</span>
                <span className="text-[10px] text-emerald-400">Sub-nanomolar Potency</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <span className="text-xs text-slate-400 block">Gibbs Free Energy ($\Delta G$)</span>
                <span className="text-lg font-bold text-indigo-400 mt-1 block">{current.bindingEnergy}</span>
                <span className="text-[10px] text-slate-500">AutoDock Score</span>
              </div>
            </div>

            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-lg space-y-1">
              <span className="text-xs font-semibold text-purple-300 block">Key Binding Residues</span>
              <p className="text-xs font-mono text-purple-200">{current.pocketResidues}</p>
              <p className="text-[11px] text-slate-400 pt-1">{current.hBonds} Hydrogen bonds formed in binding cavity.</p>
            </div>

            <button
              onClick={() => alert(`Exported PDBQT structure file for ${selectedTarget}`)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export Docked Complex (.PDBQT)
            </button>
          </div>

          {/* 3D Visualizer Mockup Canvas */}
          <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 relative flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <Dna className="h-4 w-4 text-purple-400" />
                AlphaFold3 3D Ribbons + Pocket Mesh
              </span>
              <span>PDB: {current.pdbId} | Resolution: 1.85 Å</span>
            </div>

            {/* Simulated 3D Protein Canvas Render */}
            <div className="my-6 relative w-full h-[400px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0,transparent_70%)]" />

              {/* Central 3D Ribbon Mock Graphics */}
              <div
                className="relative transition-transform duration-500 flex items-center justify-center"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-purple-500/40 animate-spin-slow flex items-center justify-center relative">
                  <div className="w-32 h-32 rounded-full border-2 border-indigo-400/60 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-xl shadow-purple-500/50 flex items-center justify-center text-white font-bold font-mono text-xs">
                      LIGAND
                    </div>
                  </div>
                </div>

                {/* Hydrogen bond vectors */}
                <div className="absolute -top-6 -right-6 px-2 py-1 bg-purple-950/80 border border-purple-500/40 rounded text-[10px] font-mono text-purple-300">
                  H-Bond: Cys12 (2.4 Å)
                </div>
                <div className="absolute -bottom-6 -left-6 px-2 py-1 bg-indigo-950/80 border border-indigo-500/40 rounded text-[10px] font-mono text-indigo-300">
                  H-Bond: Asp69 (2.8 Å)
                </div>
              </div>

              {/* Rotation HUD Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-slate-300 font-mono">Viewport Angle:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationAngle}
                    onChange={(e) => setRotationAngle(Number(e.target.value))}
                    className="w-32 accent-purple-500"
                  />
                  <span className="text-xs font-mono text-purple-300">{rotationAngle}°</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">Van der Waals Surface Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-800 pt-3">
              <span>Force Field: AMBER14 / GAFF2</span>
              <span className="text-purple-400 font-semibold">Active Ligand: {activeLigand}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
