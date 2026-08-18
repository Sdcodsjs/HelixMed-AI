"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Star, MessageSquare, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ThumbsUp, ThumbsDown, BarChart3, Users, ArrowUpRight, ArrowDownRight,
  Filter, Search, Zap, Heart, Smile, Frown, Meh
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const NPS_TREND = [
  { month: "Mar", nps: 62 }, { month: "Apr", nps: 58 }, { month: "May", nps: 65 },
  { month: "Jun", nps: 71 }, { month: "Jul", nps: 68 }, { month: "Aug", nps: 74 },
];

const DEPT_RATINGS = [
  { dept: "Cardiology", rating: 4.6, responses: 142, trend: "up" },
  { dept: "Pediatrics", rating: 4.8, responses: 98, trend: "up" },
  { dept: "Emergency", rating: 3.9, responses: 210, trend: "down" },
  { dept: "Oncology", rating: 4.5, responses: 76, trend: "up" },
  { dept: "General Medicine", rating: 4.2, responses: 188, trend: "up" },
  { dept: "Orthopedics", rating: 4.1, responses: 124, trend: "down" },
];

const COMPLAINTS = [
  { id: "CMP-301", patient: "Anonymous", dept: "Emergency", category: "Wait Time", text: "Waited 3 hours in ER before being seen. Unacceptable for chest pain.", status: "investigating", sla: "2h left", severity: "high", created: "Aug 18, 11:30 AM" },
  { id: "CMP-302", patient: "Mrs. Geeta I.", dept: "General Ward", category: "Food Quality", text: "Hospital food was cold and tasteless. Not suitable for post-surgery recovery.", status: "acknowledged", sla: "6h left", severity: "medium", created: "Aug 18, 09:15 AM" },
  { id: "CMP-303", patient: "Mr. Vijay P.", dept: "Billing", category: "Billing Error", text: "Charged twice for the same blood test. Need immediate correction.", status: "resolved", sla: "Resolved", severity: "medium", created: "Aug 17, 03:45 PM" },
  { id: "CMP-304", patient: "Anonymous", dept: "ICU", category: "Staff Attitude", text: "Night shift nurse was dismissive when I asked about my father's condition.", status: "open", sla: "12h left", severity: "high", created: "Aug 18, 06:00 AM" },
];

const WORD_CLOUD = [
  { word: "waiting", size: 28, color: "#ef4444" }, { word: "caring", size: 32, color: "#10b981" },
  { word: "clean", size: 24, color: "#10b981" }, { word: "expensive", size: 22, color: "#f59e0b" },
  { word: "professional", size: 30, color: "#3b82f6" }, { word: "delay", size: 26, color: "#ef4444" },
  { word: "friendly", size: 20, color: "#10b981" }, { word: "parking", size: 18, color: "#f59e0b" },
  { word: "doctor", size: 34, color: "#8b5cf6" }, { word: "excellent", size: 28, color: "#10b981" },
  { word: "crowded", size: 24, color: "#ef4444" }, { word: "helpful", size: 22, color: "#3b82f6" },
  { word: "food", size: 20, color: "#f59e0b" }, { word: "nurse", size: 26, color: "#8b5cf6" },
  { word: "communication", size: 22, color: "#3b82f6" }, { word: "billing", size: 18, color: "#ef4444" },
];

const SENTIMENTS = [
  { text: "Dr. Sharma was incredibly thorough and explained everything clearly. Best cardiac care I've received.", sentiment: "positive", confidence: 96, emotions: ["gratitude", "trust"] },
  { text: "The billing department is a nightmare. Nobody can give a straight answer about insurance coverage.", sentiment: "negative", confidence: 91, emotions: ["frustration", "anger"] },
  { text: "Decent experience overall. Room was clean but food could be much better.", sentiment: "neutral", confidence: 78, emotions: ["indifference"] },
  { text: "The pediatric team saved my daughter's life. I will forever be grateful to Dr. Menon and his team.", sentiment: "positive", confidence: 99, emotions: ["gratitude", "relief", "joy"] },
];

const complaintStatus = { open: "text-red-400 bg-red-500/10 border-red-500/30", acknowledged: "text-amber-400 bg-amber-500/10 border-amber-500/30", investigating: "text-blue-400 bg-blue-500/10 border-blue-500/30", resolved: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
const sentimentIcon = { positive: Smile, negative: Frown, neutral: Meh };
const sentimentColor = { positive: "text-emerald-400", negative: "text-red-400", neutral: "text-amber-400" };

export default function PatientFeedbackPage() {
  const [activeTab, setActiveTab] = useState("nps");
  const tabs = [
    { id: "nps", label: "NPS & Ratings", icon: Star },
    { id: "sentiment", label: "AI Sentiment", icon: Heart },
    { id: "complaints", label: "Complaint Tracker", icon: AlertTriangle },
    { id: "wordcloud", label: "Themes", icon: MessageSquare },
  ];

  return (
    <AppLayout activeTab="patient-feedback">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/20">
                <Star className="text-white" size={24} />
              </div>
              Patient Satisfaction & Feedback Analytics
            </h1>
            <p className="text-slate-400 text-sm mt-1">NPS scoring · AI sentiment · Complaint tracking · Theme analysis</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-5 py-3 rounded-xl text-center"><p className="text-[10px] text-white/70 uppercase font-bold">Current NPS</p><p className="text-3xl font-black text-white">+74</p></div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "nps" && (
          <div className="space-y-4">
            <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">NPS Trend (6-Month)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={NPS_TREND}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="month" stroke="#64748b" fontSize={11} /><YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} /><Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} /><Line type="monotone" dataKey="nps" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 5 }} /></LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPT_RATINGS.map(d => (
                <div key={d.dept} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{d.dept}</h3>
                    <span className={`text-xs font-bold ${d.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>{d.trend === "up" ? <ArrowUpRight size={14} className="inline" /> : <ArrowDownRight size={14} className="inline" />}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-white">{d.rating}</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.floor(d.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />)}</div>
                  </div>
                  <p className="text-[10px] text-slate-500">{d.responses} responses</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sentiment" && (
          <div className="space-y-4">
            {SENTIMENTS.map((s, i) => {
              const Icon = sentimentIcon[s.sentiment];
              return (
                <div key={i} className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl bg-slate-800 ${sentimentColor[s.sentiment]}`}><Icon size={24} /></div>
                    <div className="flex-1">
                      <p className="text-slate-200 text-sm italic mb-2">&ldquo;{s.text}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${sentimentColor[s.sentiment]}`}>{s.sentiment} ({s.confidence}%)</span>
                        {s.emotions.map(e => <span key={e} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{e}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="space-y-4">
            {COMPLAINTS.map(c => (
              <div key={c.id} className={`bg-[#1e293b] rounded-2xl border ${c.severity === "high" ? "border-red-500/30" : "border-slate-800"} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3"><span className="text-blue-400 font-mono font-bold text-xs">{c.id}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{c.dept}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">{c.category}</span></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{c.sla}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-extrabold ${complaintStatus[c.status]}`}>{c.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mb-2">{c.text}</p>
                <p className="text-[10px] text-slate-500">{c.patient} · {c.created}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "wordcloud" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-8">
            <h3 className="text-sm font-bold text-white mb-6 text-center">Most Frequent Themes in Patient Feedback</h3>
            <div className="flex flex-wrap items-center justify-center gap-3 min-h-[200px]">
              {WORD_CLOUD.map((w, i) => (
                <span key={i} style={{ fontSize: `${w.size}px`, color: w.color }} className="font-bold cursor-default hover:opacity-80 transition-opacity">{w.word}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
