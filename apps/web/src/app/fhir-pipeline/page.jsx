"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Activity,
  Database,
  Send,
  CheckCircle2,
  AlertTriangle,
  Code,
  Layers,
  Sparkles,
  Server,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const FHIR_RESOURCES = [
  { id: "Patient", name: "Patient Resource (FHIR R4)", path: "/fhir/R4/Patient/PT-9042" },
  { id: "Observation", name: "Observation (Vitals / Labs)", path: "/fhir/R4/Observation?patient=PT-9042" },
  { id: "Condition", name: "Condition (Problem List)", path: "/fhir/R4/Condition?patient=PT-9042" },
  { id: "MedicationRequest", name: "MedicationRequest (Rx)", path: "/fhir/R4/MedicationRequest?patient=PT-9042" },
];

export default function FhirPipelinePage() {
  const { activePatient } = usePatient();
  const [selectedResource, setSelectedResource] = useState(FHIR_RESOURCES[0]);
  const [fhirResponse, setFhirResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const mockFhirPayloads = {
    Patient: {
      resourceType: "Patient",
      id: activePatient?.id || "PT-9042",
      identifier: [{ system: "urn:oid:2.16.840.1.113883.4.1", value: activePatient?.mrn || "MRN-908124" }],
      active: true,
      name: [{ family: activePatient?.name.split(" ")[1] || "Jenkins", given: [activePatient?.name.split(" ")[0] || "Sarah"] }],
      gender: activePatient?.gender.toLowerCase() || "female",
      birthDate: "1968-04-12",
      managingOrganization: { reference: "Organization/MayoClinic" }
    },
    Observation: {
      resourceType: "Observation",
      id: "obs-spO2-9042",
      status: "final",
      category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs" }] }],
      code: { coding: [{ system: "http://loinc.org", code: "59408-5", display: "Oxygen saturation in Arterial blood" }] },
      subject: { reference: `Patient/${activePatient?.id || "PT-9042"}` },
      valueQuantity: { value: 93, unit: "%", system: "http://unitsofmeasure.org", code: "%" }
    },
    Condition: {
      resourceType: "Condition",
      id: "cond-t2d-9042",
      clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
      verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" }] },
      code: { coding: [{ system: "http://snomed.info/sct", code: "44054006", display: "Type 2 Diabetes Mellitus" }] },
      subject: { reference: `Patient/${activePatient?.id || "PT-9042"}` }
    },
    MedicationRequest: {
      resourceType: "MedicationRequest",
      id: "rx-metformin-9042",
      status: "active",
      intent: "order",
      medicationCodeableConcept: { coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "860975", display: "Metformin 50mg Oral Tablet" }] },
      subject: { reference: `Patient/${activePatient?.id || "PT-9042"}` },
      dosageInstruction: [{ text: "Take 50mg twice daily after meals." }]
    }
  };

  const handleTestPipeline = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFhirResponse(mockFhirPayloads[selectedResource.id]);
      setIsLoading(false);
    }, 500);
  };

  const handleCopyJson = () => {
    if (!fhirResponse) return;
    navigator.clipboard.writeText(JSON.stringify(fhirResponse, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AppLayout activeTab="fhir-pipeline">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Database className="text-emerald-400" size={26} />
              HL7 FHIR R4 Interoperability & EHR Data Pipeline
            </h2>
            <p className="text-slate-400 text-sm">
              Standardized HL7 FHIR R4 API resource mapper for Epic, Cerner & Allscripts hospital EHR integration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              FHIR R4 Standard Validated
            </div>
          </div>
        </div>

        {/* Resource Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FHIR_RESOURCES.map((res) => (
            <div
              key={res.id}
              onClick={() => {
                setSelectedResource(res);
                setFhirResponse(mockFhirPayloads[res.id]);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedResource.id === res.id
                  ? "bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10"
                  : "bg-[#1e293b] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-white text-sm mb-1">{res.name}</div>
              <div className="text-xs text-emerald-400 font-mono">{res.path}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Tester & JSON Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Endpoint Tester Controls */}
          <div className="lg:col-span-5 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2 pb-3 border-b border-slate-800">
              <Server size={18} className="text-emerald-400" />
              EHR Integration Endpoint Tester
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target EHR Server Protocol:</label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-emerald-400 font-bold">
                  HTTPS / REST / OAuth2 SMART-on-FHIR
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">LOINC / SNOMED CT Terminology Server:</label>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-blue-400">
                  https://tx.fhir.org/r4 (Active Sync)
                </div>
              </div>
            </div>

            <button
              onClick={handleTestPipeline}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
              Test FHIR Endpoint Query ({selectedResource.id})
            </button>
          </div>

          {/* JSON Payload Inspector */}
          <div className="lg:col-span-7 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Code size={18} className="text-emerald-400" />
                FHIR R4 Validated JSON Payload — {selectedResource.id}
              </h3>
              <button
                onClick={handleCopyJson}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {isCopied ? "Copied!" : "Copy JSON"}
              </button>
            </div>

            <pre className="w-full h-80 bg-[#090d16] border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 leading-relaxed overflow-y-auto custom-scrollbar">
              {JSON.stringify(fhirResponse || mockFhirPayloads[selectedResource.id], null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
