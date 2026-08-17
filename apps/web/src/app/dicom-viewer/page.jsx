"use client";
import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Scan,
  Eye,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Crosshair,
  Download,
  Maximize2
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const DICOM_STUDIES = [
  {
    id: "ct-lung-01",
    modality: "CT Chest 3mm (High Resolution)",
    organ: "Pulmonary / Lungs",
    findings: "Sub-solid lung nodule in Right Upper Lobe (14.2 mm)",
    aiConfidence: "96.4%",
    hounsfieldUnits: "-450 HU (Ground-glass opacification)",
    sliceCount: 32,
    lesionVolume: "1.42 cm³",
    malignancyRisk: "High (78.4%)",
    dicomTag: "0020,0032 (Image Position Patient): [-142.5, -168.0, 42.0]"
  },
  {
    id: "mri-brain-02",
    modality: "MRI Brain T2-FLAIR",
    organ: "Neurology / Brain",
    findings: "Hyper-intense white matter lesion in Left Frontal Lobe",
    aiConfidence: "94.1%",
    hounsfieldUnits: "T2 Hyperintensity Signal",
    sliceCount: 24,
    lesionVolume: "0.88 cm³",
    malignancyRisk: "Moderate (42.1%)",
    dicomTag: "0018,0081 (Echo Time TE): 95 ms"
  },
  {
    id: "ct-abdomen-03",
    modality: "CT Abdomen Contrast",
    organ: "Renal / Kidneys",
    findings: "Hypodense renal cortical lesion in Right Kidney",
    aiConfidence: "91.8%",
    hounsfieldUnits: "25 HU (Fluid density)",
    sliceCount: 28,
    lesionVolume: "2.10 cm³",
    malignancyRisk: "Low (12.5%)",
    dicomTag: "0018,0080 (Repetition Time TR): 450 ms"
  }
];

export default function DicomViewerPage() {
  const { activePatient } = usePatient();
  const [selectedStudy, setSelectedStudy] = useState(DICOM_STUDIES[0]);
  const [currentSlice, setCurrentSlice] = useState(16);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [windowLevel, setWindowLevel] = useState(40);
  const [windowWidth, setWindowWidth] = useState(400);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [crosshairPos, setCrosshairPos] = useState({ x: 150, y: 150 });
  const [isCrosshairActive, setIsCrosshairActive] = useState(false);

  const canvasRef = useRef(null);

  // Real Canvas Render of DICOM Image Manipulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear Canvas
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // Apply Contrast & Brightness Filters based on WL / WW Sliders
    const brightness = 100 + (windowLevel - 40) * 1.5;
    const contrast = 100 + (windowWidth - 400) * 0.2;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Draw Simulated Anatomical Scan Image
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoomLevel / 100, zoomLevel / 100);
    ctx.translate(-width / 2, -height / 2);

    // Outer Anatomical Body Contour
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 110, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Organ Parenchyma (Lungs / Brain / Kidney)
    ctx.beginPath();
    ctx.arc(width / 2 - 40, height / 2 - 10, 45, 0, Math.PI * 2);
    ctx.arc(width / 2 + 40, height / 2 - 10, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.stroke();

    // Tumor Lesion Core
    const lesionRadius = 12 + (currentSlice % 5);
    ctx.beginPath();
    ctx.arc(width / 2 + 35, height / 2 - 20, lesionRadius, 0, Math.PI * 2);
    ctx.fillStyle = selectedStudy.color;
    ctx.fill();

    ctx.restore();
    ctx.filter = "none";

    // AI Bounding Box Overlay
    if (showAiOverlay) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(width / 2 + 10, height / 2 - 45, 50, 50);
      ctx.setLineDash([]);

      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`AI NODULE (${selectedStudy.lesionVolume})`, width / 2 + 10, height / 2 - 50);
    }

    // Interactive Crosshair Tool
    if (isCrosshairActive) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(crosshairPos.x, 0);
      ctx.lineTo(crosshairPos.x, height);
      ctx.moveTo(0, crosshairPos.y);
      ctx.lineTo(width, crosshairPos.y);
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px monospace";
      ctx.fillText(`X:${crosshairPos.x} Y:${crosshairPos.y}`, crosshairPos.x + 5, crosshairPos.y - 5);
    }
  }, [selectedStudy, currentSlice, windowLevel, windowWidth, zoomLevel, showAiOverlay, crosshairPos, isCrosshairActive]);

  const handleCanvasMouseMove = (e) => {
    if (!isCrosshairActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setCrosshairPos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  return (
    <AppLayout activeTab="dicom-viewer">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Scan className="text-blue-400" size={26} />
              AI Medical Imaging & DICOM Radiomics Studio
            </h2>
            <p className="text-slate-400 text-sm">
              Interactive DICOM CT/MRI scan viewer with real-time Canvas Windowing (WL/WW), AI lesion segmentation & HU radiomics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-300 px-3.5 py-2 rounded-xl border border-blue-500/30 text-xs font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              Real Canvas Windowing Engine Active
            </div>
          </div>
        </div>

        {/* Study Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {DICOM_STUDIES.map((study) => (
            <div
              key={study.id}
              onClick={() => {
                setSelectedStudy(study);
                setCurrentSlice(Math.floor(study.sliceCount / 2));
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedStudy.id === study.id
                  ? "bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10"
                  : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-sm">{study.modality}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {study.organ}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{study.findings}</p>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">AI Confidence:</span>
                <span className="text-emerald-400 font-bold">{study.aiConfidence}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main DICOM Canvas & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* DICOM Slice Viewer Canvas Box */}
          <div className="lg:col-span-8 bg-[#090d16] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-2xl relative flex flex-col justify-between">
            {/* Top Toolbar */}
            <div className="flex flex-wrap justify-between items-center text-xs font-mono text-slate-400 border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">{selectedStudy.modality}</span>
                <span className="text-blue-400">PATIENT: {activePatient?.name || "Sarah Jenkins"} ({activePatient?.mrn || "MRN-908124"})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCrosshairActive(!isCrosshairActive)}
                  className={`px-3 py-1 rounded-lg border font-sans text-xs font-bold transition-colors ${
                    isCrosshairActive
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  <Crosshair size={14} className="inline mr-1" /> Crosshair Tool
                </button>
                <button
                  onClick={() => setShowAiOverlay(!showAiOverlay)}
                  className={`px-3 py-1 rounded-lg border font-sans text-xs font-bold transition-colors ${
                    showAiOverlay
                      ? "bg-red-600 text-white border-red-400"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  <Eye size={14} className="inline mr-1" /> AI Bounding Box {showAiOverlay ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Real HTML5 Canvas Viewer */}
            <div className="w-full h-[320px] bg-[#020617] rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={320}
                onMouseMove={handleCanvasMouseMove}
                className="w-full h-full rounded-xl cursor-crosshair"
              />

              {/* HUD Header */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 space-y-1 bg-slate-950/80 p-2 rounded border border-slate-800">
                <div>SLICE: {currentSlice} / {selectedStudy.sliceCount}</div>
                <div>WL: {windowLevel} / WW: {windowWidth}</div>
                <div>HU: {selectedStudy.hounsfieldUnits}</div>
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-emerald-400 bg-slate-950/80 p-1.5 rounded border border-slate-800">
                ZOOM: {zoomLevel}%
              </div>
            </div>

            {/* Slice Scrubber Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">2D Slice Scrubber:</span>
                <span className="text-blue-400 font-mono font-bold text-sm">Slice {currentSlice} of {selectedStudy.sliceCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedStudy.sliceCount}
                value={currentSlice}
                onChange={(e) => setCurrentSlice(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Radiomics Analytics & Controls */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contrast Windowing Sliders */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sliders size={16} className="text-blue-400" />
                DICOM Window & Level Controls
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Window Level (WL - Brightness):</span>
                    <span className="text-white font-mono font-bold">{windowLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={windowLevel}
                    onChange={(e) => setWindowLevel(Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Window Width (WW - Contrast):</span>
                    <span className="text-white font-mono font-bold">{windowWidth}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    value={windowWidth}
                    onChange={(e) => setWindowWidth(Number(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 20, 200))}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <ZoomIn size={14} /> Zoom +
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 20, 80))}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <ZoomOut size={14} /> Zoom -
                </button>
              </div>
            </div>

            {/* DICOM Tag Header Inspector */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
              <h3 className="font-bold text-white text-sm flex items-center justify-between">
                <span>DICOM Tag Header Inspector</span>
                <FileText size={16} className="text-emerald-400" />
              </h3>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 truncate">
                {selectedStudy.dicomTag}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
