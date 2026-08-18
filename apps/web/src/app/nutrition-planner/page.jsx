"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Utensils, AlertTriangle, CheckCircle2, Clock, Users, Search,
  Leaf, Apple, Flame, Droplets, ShieldAlert, Filter, Eye,
  TrendingUp, Heart, Activity, Zap, ChevronRight
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const DIET_TEMPLATES = [
  { id: "DT-01", name: "Diabetic Diet (1800 kcal)", conditions: ["Type-2 Diabetes", "Pre-Diabetes"], calories: 1800, protein: 90, carbs: 180, fat: 60, fiber: 30, restrictions: ["Low glycemic index", "No refined sugar", "Complex carbs only"], sample: ["Oats + egg whites + methi seeds", "Grilled chicken + brown rice + dal", "Multigrain roti + paneer bhurji + salad"] },
  { id: "DT-02", name: "Renal Diet (Low K+/PO4)", conditions: ["CKD Stage 3-5", "Dialysis"], calories: 2000, protein: 60, carbs: 280, fat: 70, fiber: 15, restrictions: ["Low potassium", "Low phosphorus", "Fluid restricted 1.5L/day", "Low sodium"], sample: ["White bread + jam + apple", "Rice + bottle gourd curry + egg curry", "Idli + coconut chutney"] },
  { id: "DT-03", name: "Cardiac Diet (DASH)", conditions: ["Hypertension", "Post-MI", "Heart Failure"], calories: 1600, protein: 80, carbs: 200, fat: 45, fiber: 35, restrictions: ["Low sodium (<2g)", "Low saturated fat", "High omega-3", "No trans fats"], sample: ["Ragi porridge + almonds + banana", "Grilled fish + quinoa + steamed veggies", "Moong dal khichdi + curd"] },
  { id: "DT-04", name: "Post-Surgery (High Protein)", conditions: ["Post-operative", "Wound healing"], calories: 2200, protein: 120, carbs: 250, fat: 65, fiber: 20, restrictions: ["High protein", "Vitamin C rich", "Zinc supplementation", "Easy to digest"], sample: ["Protein shake + fruit + toast", "Chicken soup + rice + green beans", "Paneer tikka + dal + chapati"] },
  { id: "DT-05", name: "Pediatric Balanced", conditions: ["General pediatric", "Growth monitoring"], calories: 1400, protein: 55, carbs: 200, fat: 50, fiber: 18, restrictions: ["Age-appropriate portions", "No added salt", "Limited sugar", "Colorful plate"], sample: ["Milk + paratha + fruit", "Rice + sambar + curd + carrot", "Khichdi + ghee + banana"] },
];

const PATIENT_MEALS = [
  { ward: "Cardiac ICU", patient: "Ramesh Kumar", diet: "Cardiac DASH", meal: "Lunch", status: "delivered", allergens: [], time: "12:30 PM" },
  { ward: "General Male", patient: "Vijay Patil", diet: "Post-Surgery HP", meal: "Lunch", status: "preparing", allergens: ["Shellfish"], time: "12:45 PM" },
  { ward: "Oncology-3B", patient: "Robert Chen", diet: "Renal Low K+", meal: "Lunch", status: "pending", allergens: ["Peanuts", "Soy"], time: "01:00 PM" },
  { ward: "Pediatric", patient: "Arya Sharma", diet: "Pediatric Balanced", meal: "Lunch", status: "delivered", allergens: ["Lactose"], time: "12:15 PM" },
  { ward: "General Female", patient: "Sunita Devi", diet: "Diabetic 1800", meal: "Lunch", status: "delivering", allergens: [], time: "12:40 PM" },
];

const CALORIC_TRACKING = [
  { meal: "Breakfast", target: 450, actual: 420 },
  { meal: "Mid-Morning", target: 150, actual: 130 },
  { meal: "Lunch", target: 550, actual: 580 },
  { meal: "Evening Snack", target: 150, actual: 100 },
  { meal: "Dinner", target: 500, actual: 0 },
];

const mealStatus = { delivered: "text-emerald-400 bg-emerald-500/10", preparing: "text-amber-400 bg-amber-500/10", pending: "text-slate-400 bg-slate-800", delivering: "text-blue-400 bg-blue-500/10" };

export default function NutritionPlannerPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(DIET_TEMPLATES[0]);

  const tabs = [
    { id: "templates", label: "Diet Templates", icon: Leaf },
    { id: "kitchen", label: "Kitchen Dashboard", icon: Utensils },
    { id: "tracking", label: "Caloric Tracking", icon: TrendingUp },
  ];

  return (
    <AppLayout activeTab="nutrition-planner">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-lime-600 to-green-500 shadow-lg shadow-lime-500/20">
                <Utensils className="text-white" size={24} />
              </div>
              Hospital Nutrition & Diet Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">AI-powered meal planning · Allergy cross-check · Kitchen operations</p>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}><t.icon size={16} /> {t.label}</button>))}
        </div>

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              {DIET_TEMPLATES.map(dt => (
                <button key={dt.id} onClick={() => setSelectedTemplate(dt)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTemplate.id === dt.id ? "bg-blue-600/10 border-blue-500/50 text-white" : "bg-[#1e293b] border-slate-800 text-slate-300 hover:border-slate-700"}`}>
                  <p className="font-bold text-sm">{dt.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{dt.conditions.join(" · ")}</p>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 p-6 space-y-5">
              <h3 className="text-lg font-bold text-white">{selectedTemplate.name}</h3>
              <div className="grid grid-cols-5 gap-3">
                {[{ label: "Calories", value: `${selectedTemplate.calories}`, unit: "kcal", icon: Flame, color: "text-orange-400" },
                  { label: "Protein", value: `${selectedTemplate.protein}g`, unit: "", icon: Zap, color: "text-red-400" },
                  { label: "Carbs", value: `${selectedTemplate.carbs}g`, unit: "", icon: Apple, color: "text-amber-400" },
                  { label: "Fat", value: `${selectedTemplate.fat}g`, unit: "", icon: Droplets, color: "text-blue-400" },
                  { label: "Fiber", value: `${selectedTemplate.fiber}g`, unit: "", icon: Leaf, color: "text-emerald-400" }
                ].map(m => (
                  <div key={m.label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                    <m.icon size={18} className={`${m.color} mx-auto mb-1`} />
                    <p className="text-lg font-black text-white">{m.value}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{m.label}</p>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Dietary Restrictions</h4>
                <div className="flex flex-wrap gap-2">{selectedTemplate.restrictions.map(r => (
                  <span key={r} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">{r}</span>
                ))}</div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Sample Meals</h4>
                <div className="space-y-2">{["Breakfast", "Lunch", "Dinner"].map((label, i) => (
                  <div key={label} className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase w-16">{label}</span>
                    <span className="text-xs text-slate-300">{selectedTemplate.sample[i]}</span>
                  </div>
                ))}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "kitchen" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800"><h3 className="text-sm font-bold text-white">Kitchen Order Board — Today&apos;s Lunch Service</h3></div>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
                <th className="text-left px-4 py-3">Ward</th><th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">Diet Plan</th><th className="text-left px-4 py-3">Allergens</th><th className="text-left px-4 py-3">Time</th><th className="text-left px-4 py-3">Status</th>
              </tr></thead>
              <tbody>{PATIENT_MEALS.map((m, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-300">{m.ward}</td>
                  <td className="px-4 py-3 text-white font-semibold">{m.patient}</td>
                  <td className="px-4 py-3 text-blue-400">{m.diet}</td>
                  <td className="px-4 py-3">{m.allergens.length > 0 ? m.allergens.map(a => <span key={a} className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 mr-1">{a}</span>) : <span className="text-slate-500">None</span>}</td>
                  <td className="px-4 py-3 text-slate-300 font-mono">{m.time}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${mealStatus[m.status]}`}>{m.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === "tracking" && (
          <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Patient Caloric Intake — Ramesh Kumar (Cardiac DASH · Target: 1600 kcal)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CALORIC_TRACKING}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="meal" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="target" fill="#3b82f640" name="Target" radius={[4,4,0,0]} />
                <Bar dataKey="actual" fill="#10b981" name="Actual" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
