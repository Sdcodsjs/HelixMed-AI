"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Truck, MapPin, Clock, Users, AlertTriangle, CheckCircle2, Phone,
  Radio, Navigation, ArrowRight, Zap, Activity, Heart, Shield,
  ChevronRight, Search, Filter
} from "lucide-react";

const AMBULANCES = [
  { id: "AMB-01", type: "ALS", status: "available", crew: "Paramedic Ravi + Driver Sunil", location: "Base Station A", lat: "28.6139", lng: "77.2090", lastUpdate: "2 min ago" },
  { id: "AMB-02", type: "BLS", status: "en-route", crew: "EMT Priya + Driver Manoj", location: "NH-48, Sector 14", lat: "28.4744", lng: "77.0266", lastUpdate: "30 sec ago", destination: "Trauma Center", eta: "8 min" },
  { id: "AMB-03", type: "ALS", status: "at-scene", crew: "Paramedic Deepak + Driver Kishore", location: "Connaught Place", lat: "28.6315", lng: "77.2167", lastUpdate: "1 min ago", patient: "Male, ~55y, chest pain" },
  { id: "AMB-04", type: "BLS", status: "returning", crew: "EMT Fatima + Driver Rajesh", location: "AIIMS Ring Road", lat: "28.5672", lng: "77.2100", lastUpdate: "5 min ago" },
  { id: "AMB-05", type: "MICU", status: "en-route", crew: "Dr. Anand + Paramedic Geeta + Driver Hari", location: "DND Flyway", lat: "28.6108", lng: "77.3031", lastUpdate: "15 sec ago", destination: "Cardiac ICU", eta: "12 min" },
  { id: "AMB-06", type: "BLS", status: "available", crew: "EMT Sanjay + Driver Vikram", location: "Base Station B", lat: "28.5355", lng: "77.2710", lastUpdate: "8 min ago" },
];

const DISPATCH_QUEUE = [
  { id: "DSP-401", caller: "Control Room", type: "Cardiac Emergency", location: "Saket Metro Station", priority: "critical", time: "12:45 PM", assigned: null },
  { id: "DSP-402", caller: "Hospital Transfer", type: "Inter-Hospital NICU", location: "Safdarjung Hospital → Max Saket", priority: "high", time: "12:50 PM", assigned: "AMB-05" },
  { id: "DSP-403", caller: "102 Helpline", type: "Road Accident (2 victims)", location: "NH-8, Mahipalpur", priority: "critical", time: "12:52 PM", assigned: null },
  { id: "DSP-404", caller: "OPD Discharge", type: "Patient Home Transport", location: "Ward 12 → Noida Sec-62", priority: "routine", time: "01:15 PM", assigned: null },
];

const TRANSFERS = [
  { id: "TF-201", patient: "Baby Arya (2d)", from: "District Hospital, Gurgaon", to: "NICU, Max Saket", reason: "Neonatal respiratory distress", status: "in-transit", eta: "18 min", bedConfirmed: true },
  { id: "TF-202", patient: "Mr. Suresh (58y)", from: "PHC Faridabad", to: "Cath Lab, Fortis Okhla", reason: "STEMI — Primary PCI needed", status: "pending-bed", eta: "—", bedConfirmed: false },
  { id: "TF-203", patient: "Mrs. Kavitha (42y)", from: "Safdarjung Hospital", to: "Oncology, AIIMS", reason: "Tumor board consultation", status: "scheduled", eta: "Tomorrow 10 AM", bedConfirmed: true },
];

const statusColor = { available: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", "en-route": "text-blue-400 bg-blue-500/10 border-blue-500/30", "at-scene": "text-red-400 bg-red-500/10 border-red-500/30", returning: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
const priorityColor = { critical: "text-red-400 bg-red-500/10 border-red-500/30", high: "text-orange-400 bg-orange-500/10 border-orange-500/30", routine: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
const transferStatus = { "in-transit": "text-blue-400 bg-blue-500/10 border-blue-500/30", "pending-bed": "text-red-400 bg-red-500/10 border-red-500/30", scheduled: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };

export default function AmbulanceTrackerPage() {
  const [activeTab, setActiveTab] = useState("fleet");
  const tabs = [
    { id: "fleet", label: "Fleet Status", icon: Truck },
    { id: "dispatch", label: "Dispatch Console", icon: Radio },
    { id: "transfers", label: "Inter-Hospital Transfers", icon: ArrowRight },
  ];

  return (
    <AppLayout activeTab="ambulance-tracker">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Truck className="text-white" size={24} />
              </div>
              Ambulance & Patient Transport Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">Fleet GPS · Dispatch optimizer · Transfer coordination</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400">{AMBULANCES.filter(a => a.status === "available").length} Available</span>
            <span className="bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400">{AMBULANCES.filter(a => a.status === "at-scene").length} At Scene</span>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AMBULANCES.map(a => (
              <div key={a.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Truck size={18} className="text-blue-400" /><span className="font-bold text-white">{a.id}</span><span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{a.type}</span></div>
                  <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${statusColor[a.status]}`}>{a.status.replace("-", " ")}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-300"><MapPin size={12} className="inline mr-1 text-slate-500" />{a.location}</p>
                  <p className="text-slate-400"><Users size={12} className="inline mr-1 text-slate-500" />{a.crew}</p>
                  {a.destination && <p className="text-blue-400 font-bold"><Navigation size={12} className="inline mr-1" />→ {a.destination} (ETA: {a.eta})</p>}
                  {a.patient && <p className="text-red-400 font-bold"><Heart size={12} className="inline mr-1" />{a.patient}</p>}
                </div>
                <p className="text-[10px] text-slate-600">Updated {a.lastUpdate}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "dispatch" && (
          <div className="space-y-4">
            {DISPATCH_QUEUE.map(d => (
              <div key={d.id} className={`bg-[#1e293b] rounded-2xl border ${d.priority === "critical" ? "border-red-500/40" : "border-slate-800"} p-5 flex items-center justify-between`}>
                <div className="flex items-center gap-6">
                  <div><p className="text-white font-bold">{d.type}</p><p className="text-xs text-slate-400"><MapPin size={12} className="inline mr-1" />{d.location}</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono">{d.time}</span>
                  <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${priorityColor[d.priority]}`}>{d.priority}</span>
                  {d.assigned ? <span className="text-xs font-bold text-blue-400">→ {d.assigned}</span> : <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors">Assign Unit</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "transfers" && (
          <div className="space-y-4">
            {TRANSFERS.map(t => (
              <div key={t.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold">{t.patient}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded border text-[10px] uppercase font-extrabold ${transferStatus[t.status]}`}>{t.status.replace("-", " ")}</span>
                    {t.bedConfirmed ? <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} />Bed Confirmed</span> : <span className="text-red-400 text-xs font-bold flex items-center gap-1"><AlertTriangle size={12} />No Bed</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg">{t.from}</span>
                  <ArrowRight size={16} className="text-blue-400" />
                  <span className="text-white font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">{t.to}</span>
                </div>
                <p className="text-xs text-slate-400"><span className="text-slate-500">Reason:</span> {t.reason}</p>
                {t.eta !== "—" && <p className="text-xs text-blue-400 font-bold">ETA: {t.eta}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
