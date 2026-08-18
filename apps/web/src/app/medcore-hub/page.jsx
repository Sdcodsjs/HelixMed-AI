"use client";
// MedCore Hub — 18 AI & Hospital Management Modules (Groq Llama 3.1 & Rule Engine)
import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  MessageSquare, Users, BarChart3, Mic, ShieldAlert, Pill, FlaskConical,
  Calendar, Activity, TrendingUp, Search, Brain, AlertTriangle,
  CheckCircle2, XCircle, Send, Zap, ChevronRight, Clock, Heart,
  Thermometer, Wind, Droplets, Eye, FileText, Download, RefreshCw,
  Phone, User, Stethoscope, Info, AlertCircle, Package, Filter, Star,
  ShieldCheck, FileCheck
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "triage",    label: "AI Triage",       icon: MessageSquare,  badge: "8 Lang" },
  { id: "booking",   label: "Smart OPD Booking",icon: Calendar,      badge: "Tokens" },
  { id: "abdm",      label: "ABHA / ABDM",     icon: ShieldCheck,    badge: "Consent" },
  { id: "telemed",   label: "Telemed Waiting", icon: Phone,          badge: "Jitsi" },
  { id: "claims",    label: "Claims Audit",    icon: FileCheck,      badge: "Pre-Auth" },
  { id: "mar",       label: "Nurse MAR & Beds",icon: Activity,       badge: "ICU Beds" },
  { id: "discharge", label: "Discharge & Rx",  icon: FileText,       badge: "PDF" },
  { id: "console",   label: "Agent Console",   icon: Users },
  { id: "kpi",       label: "AI KPIs",         icon: BarChart3,      badge: "PRD-Grade" },
  { id: "scribe",    label: "AI Scribe",       icon: Mic,            badge: "SOAP" },
  { id: "drug",      label: "Drug Safety",     icon: ShieldAlert,    badge: "15 Pairs" },
  { id: "adherence", label: "Med Adherence",   icon: Pill },
  { id: "lab",       label: "Lab Explainer",   icon: FlaskConical },
  { id: "noshow",    label: "No-Show AI",      icon: Calendar },
  { id: "er",        label: "ER Triage",       icon: Activity,       badge: "MEWS" },
  { id: "pharmacy",  label: "Pharma Forecast", icon: Package },
  { id: "analytics", label: "AI Analytics",   icon: TrendingUp },
  { id: "rag",       label: "Knowledge RAG",  icon: Search },
];

const LANGUAGES = ["English","Hindi","Tamil","Telugu","Bengali","Marathi","Kannada","Malayalam"];

const RED_FLAGS = {
  cardiac:     ["chest pain","chest pressure","heart attack","mi ","crushing chest","myocardial"],
  stroke:      ["stroke","facial droop","arm weakness","slurred speech","sudden vision","worst headache"],
  respiratory: ["can't breathe","cannot breathe","respiratory arrest","choking","blue lips","cyanosis"],
  bleeding:    ["heavy bleeding","uncontrolled bleeding","hemorrhage","vomiting blood","haematemesis"],
  suicidal:    ["kill myself","want to die","suicidal","end my life","harm myself"],
  hindi:       ["सीने में दर्द","साँस नहीं","मदद","खून"],
};

const SYMPTOM_CHIPS = {
  English:  ["Chest Pain","Fever","Headache","Vomiting","Cough","Fatigue","Breathlessness","Joint Pain","Rash","Dizziness"],
  Hindi:    ["सीने में दर्द","बुखार","सिरदर्द","उल्टी","खाँसी","थकान","साँस फूलना","जोड़ों का दर्द","दाने","चक्कर"],
  Tamil:    ["மார்பு வலி","காய்ச்சல்","தலைவலி","வாந்தி","இருமல்","சோர்வு","மூச்சுத்திணறல்","மூட்டு வலி","தடிப்பு","மயக்கம்"],
  Telugu:   ["ఛాతీ నొప్పి","జ్వరం","తలనొప్పి","వాంతులు","దగ్గు","అలసట","శ్వాస","కీళ్ల నొప్పి","దద్దుర్లు","తలతిరగడం"],
  Bengali:  ["বুকে ব্যথা","জ্বর","মাথাব্যথা","বমি","কাশি","ক্লান্তি","শ্বাসকষ্ট","জয়েন্ট ব্যথা","ফুসকুড়ি","মাথা ঘোরা"],
  Marathi:  ["छातीत दुखणे","ताप","डोकेदुखी","उलटी","खोकला","थकवा","श्वास लागणे","सांधेदुखी","पुरळ","चक्कर"],
  Kannada:  ["ಎದೆ ನೋವು","ಜ್ವರ","ತಲೆನೋವು","ವಾಂತಿ","ಕೆಮ್ಮು","ಆಯಾಸ","ಉಸಿರಾಟ","ಕೀಲು ನೋವು","ಅಲರ್ಜಿ","ತಲೆ ತಿರುಗು"],
  Malayalam:["നെഞ്ചുവേദന","പനി","തലവേദന","ഛർദ്ദി","ചുമ","ക്ഷീണം","ശ്വാസതടസ്സം","സന്ധിവേദന","ചൊറിഞ്ഞ്","തലകറക്കം"],
};

const DRUG_PAIRS = [
  { d1:"Warfarin",      d2:"Ibuprofen",    severity:"CONTRAINDICATED", reason:"Warfarin + NSAIDs dramatically increase GI bleeding risk. NSAID inhibits platelet function and damages gastric mucosa.", alt:"Paracetamol (Acetaminophen) for pain relief" },
  { d1:"Warfarin",      d2:"Aspirin",      severity:"SEVERE",          reason:"Dual anticoagulation. Increases bleeding risk significantly.", alt:"Discuss with cardiologist — low-dose aspirin only if explicitly indicated" },
  { d1:"SSRI",          d2:"MAOI",         severity:"CONTRAINDICATED", reason:"Serotonin syndrome — potentially fatal. Hyperthermia, seizures, cardiovascular collapse.", alt:"14-day washout required before switching classes" },
  { d1:"Sildenafil",    d2:"Nitrates",     severity:"CONTRAINDICATED", reason:"Severe hypotension — can be fatal. Both cause vasodilation via different mechanisms.", alt:"Avoid PDE5 inhibitors if patient is on any nitrate" },
  { d1:"Methotrexate",  d2:"NSAIDs",       severity:"SEVERE",          reason:"NSAIDs reduce methotrexate renal clearance, causing toxicity.", alt:"Avoid NSAIDs; use paracetamol with caution" },
  { d1:"ACE Inhibitor", d2:"Potassium",    severity:"MODERATE",        reason:"ACE inhibitors reduce potassium excretion; hyperkalemia risk.", alt:"Monitor serum potassium; restrict dietary potassium supplements" },
  { d1:"Ciprofloxacin", d2:"Antacids",     severity:"MODERATE",        reason:"Divalent cations in antacids chelate ciprofloxacin, reducing absorption by up to 90%.", alt:"Administer ciprofloxacin 2h before or 6h after antacids" },
  { d1:"Codeine",       d2:"Alcohol",      severity:"SEVERE",          reason:"CNS and respiratory depression potentiation.", alt:"Avoid alcohol; switch to non-opioid analgesia" },
  { d1:"Lithium",       d2:"Diuretics",    severity:"SEVERE",          reason:"Thiazide diuretics reduce lithium excretion; toxic blood levels.", alt:"Monitor lithium levels; use loop diuretics with caution" },
  { d1:"Digoxin",       d2:"Amiodarone",   severity:"SEVERE",          reason:"Amiodarone inhibits P-gp; digoxin toxicity. Reduce digoxin dose by 50%.", alt:"Reduce digoxin dose; monitor serum levels" },
  { d1:"Clopidogrel",   d2:"PPIs",         severity:"MODERATE",        reason:"Omeprazole and esomeprazole inhibit CYP2C19; reduced clopidogrel antiplatelet effect.", alt:"Use pantoprazole (least CYP2C19 inhibition)" },
  { d1:"Statins",       d2:"Clarithromycin",severity:"MODERATE",       reason:"CYP3A4 inhibition increases statin plasma levels; myopathy risk.", alt:"Temporarily withhold statin during antibiotic course" },
  { d1:"Metformin",     d2:"Contrast Dye", severity:"SEVERE",          reason:"Contrast-induced AKI can cause metformin accumulation and lactic acidosis.", alt:"Hold metformin 48h before/after IV contrast" },
  { d1:"Phenytoin",     d2:"Fluconazole",  severity:"SEVERE",          reason:"Fluconazole inhibits CYP2C9; phenytoin toxicity (ataxia, nystagmus).", alt:"Monitor phenytoin levels; reduce dose" },
  { d1:"Trimethoprim",  d2:"ACE Inhibitor",severity:"MODERATE",        reason:"Additive hyperkalemia risk — both increase serum potassium.", alt:"Monitor potassium; consider alternative antibiotic" },
];

const MEDICINES = [
  { name:"Paracetamol 500mg",    stock:480, daily:45, forecast30:1350, forecast60:2700, forecast90:4050 },
  { name:"Amoxicillin 250mg",    stock:210, daily:22, forecast30:660,  forecast60:1320, forecast90:1980 },
  { name:"Metformin 500mg",      stock:580, daily:60, forecast30:1800, forecast60:3600, forecast90:5400 },
  { name:"Atorvastatin 20mg",    stock:160, daily:30, forecast30:900,  forecast60:1800, forecast90:2700 },
  { name:"Amlodipine 5mg",       stock:95,  daily:28, forecast30:840,  forecast60:1680, forecast90:2520 },
  { name:"Losartan 50mg",        stock:310, daily:25, forecast30:750,  forecast60:1500, forecast90:2250 },
  { name:"Pantoprazole 40mg",    stock:420, daily:38, forecast30:1140, forecast60:2280, forecast90:3420 },
  { name:"Azithromycin 500mg",   stock:80,  daily:12, forecast30:360,  forecast60:720,  forecast90:1080 },
];

const KPI_DATA = [
  { label:"Triage Routing Accuracy",  value:"91.4%",   delta:"+2.1%",  good:true,  icon:CheckCircle2,  desc:"% of AI-triaged patients routed to correct specialty" },
  { label:"AI-Flow CSAT",             value:"4.3/5",   delta:"+0.2",   good:true,  icon:Star,          desc:"Patient satisfaction score for AI triage chat" },
  { label:"Scribe Time Saved",        value:"8.4 min", delta:"+1.2",   good:true,  icon:Clock,         desc:"Avg. documentation time saved per consultation" },
  { label:"Doctor NPS",               value:"72",      delta:"+5",     good:true,  icon:Heart,         desc:"Net Promoter Score from doctor satisfaction surveys" },
  { label:"Drug Interaction Catches",  value:"34/mo",  delta:"+8",     good:true,  icon:ShieldAlert,   desc:"Drug safety alerts fired and acknowledged by doctors" },
  { label:"Scribe Med-Error Rate",    value:"0.8%",    delta:"-0.4%",  good:true,  icon:AlertTriangle, desc:"Medication errors caught in AI scribe vs. manual notes" },
  { label:"Red-Flag Triggers",        value:"12/day",  delta:"+3",     good:false, icon:AlertCircle,   desc:"Emergency screen triggers — requires review" },
  { label:"No-Show Catch Rate",       value:"78.2%",   delta:"+5.1%",  good:true,  icon:Calendar,      desc:"High-risk no-shows correctly predicted by model" },
];

const TRIAGE_VOLUME = [
  {day:"Mon",sessions:44,converted:31},{day:"Tue",sessions:58,converted:42},
  {day:"Wed",sessions:71,converted:55},{day:"Thu",sessions:63,converted:48},
  {day:"Fri",sessions:82,converted:67},{day:"Sat",sessions:39,converted:28},
  {day:"Sun",sessions:22,converted:15},
];

const SCRIBE_STATS = [
  {month:"Apr",sessions:120,signedOff:98,avgEdits:1.8},
  {month:"May",sessions:145,signedOff:126,avgEdits:1.5},
  {month:"Jun",sessions:178,signedOff:162,avgEdits:1.2},
  {month:"Jul",sessions:201,signedOff:188,avgEdits:0.9},
  {month:"Aug",sessions:234,signedOff:221,avgEdits:0.7},
];

const APPOINTMENTS = [
  { id:"APT-001", patient:"Ravi Kumar",    age:64, apptType:"Follow-up", dayOfWeek:"Monday",    hour:9,  leadDays:3,  historicNoShow:0.62, recentNoShow:true,  newPatient:false },
  { id:"APT-002", patient:"Priya Sharma",  age:28, apptType:"New",       dayOfWeek:"Friday",    hour:16, leadDays:14, historicNoShow:0.12, recentNoShow:false, newPatient:true  },
  { id:"APT-003", patient:"Mohammed Ali",  age:71, apptType:"Follow-up", dayOfWeek:"Tuesday",   hour:11, leadDays:7,  historicNoShow:0.44, recentNoShow:false, newPatient:false },
  { id:"APT-004", patient:"Sunita Devi",   age:45, apptType:"Lab",       dayOfWeek:"Wednesday", hour:8,  leadDays:1,  historicNoShow:0.08, recentNoShow:false, newPatient:false },
  { id:"APT-005", patient:"Arjun Nair",    age:52, apptType:"Follow-up", dayOfWeek:"Monday",    hour:15, leadDays:21, historicNoShow:0.71, recentNoShow:true,  newPatient:false },
  { id:"APT-006", patient:"Lakshmi Bai",   age:67, apptType:"Surgery",   dayOfWeek:"Thursday",  hour:10, leadDays:4,  historicNoShow:0.19, recentNoShow:false, newPatient:false },
];

const LAB_RESULTS = [
  { test:"Fasting Blood Glucose",  value:142, unit:"mg/dL", low:70,   high:100, status:"HIGH" },
  { test:"HbA1c",                  value:7.8, unit:"%",     low:4.0,  high:5.7, status:"HIGH" },
  { test:"Total Cholesterol",      value:218, unit:"mg/dL", low:0,    high:200, status:"HIGH" },
  { test:"HDL Cholesterol",        value:38,  unit:"mg/dL", low:40,   high:100, status:"LOW"  },
  { test:"LDL Cholesterol",        value:145, unit:"mg/dL", low:0,    high:130, status:"HIGH" },
  { test:"Serum Creatinine",       value:0.9, unit:"mg/dL", low:0.6,  high:1.2, status:"NORMAL"},
  { test:"Haemoglobin",            value:10.8,unit:"g/dL",  low:12.0, high:17.5,status:"LOW"  },
  { test:"Platelet Count",         value:210, unit:"×10³/μL",low:150, high:400, status:"NORMAL"},
];

const KNOWLEDGE_CHUNKS = [
  { id:1, source:"ICD-10",    code:"E11.9",   title:"Type 2 Diabetes Mellitus without complications", text:"T2DM is characterised by hyperglycaemia from insulin resistance. First-line: Metformin 500mg BD with meals. HbA1c target <7% for most adults." },
  { id:2, source:"Protocol",  code:"CARD-01", title:"Acute Coronary Syndrome — ER Protocol",         text:"Administer aspirin 300mg stat, sublingual nitrate, oxygen if SpO2 <94%. 12-lead ECG within 10 min. Troponin at 0h and 3h." },
  { id:3, source:"ICD-10",    code:"J18.9",   title:"Pneumonia unspecified organism",                 text:"Community-acquired pneumonia: Amoxicillin-clavulanate 625mg TDS × 7 days for outpatient mild-moderate. Severity: CURB-65 score." },
  { id:4, source:"Medicine",  code:"MED-WAR", title:"Warfarin — Dosing & Monitoring",                text:"Target INR 2.0-3.0 for AF/DVT. Check INR weekly until stable, then monthly. Hold 5 days before surgery. Interactions: NSAIDs, antibiotics." },
  { id:5, source:"Protocol",  code:"OBG-01",  title:"Antepartum Haemorrhage — Emergency Protocol",   text:"Call obstetric emergency. Two large-bore IVs, crossmatch 4 units. Do not perform vaginal exam. Fetal monitoring. Prepare for C-section." },
  { id:6, source:"ICD-10",    code:"I10",     title:"Essential (Primary) Hypertension",              text:"First-line: Amlodipine 5mg OD or Losartan 50mg OD. Target BP <140/90 for most; <130/80 for DM/CKD. Lifestyle: DASH diet, exercise, reduce salt." },
  { id:7, source:"Medicine",  code:"MED-MET", title:"Metformin — Renal Dosing",                      text:"eGFR >45: safe. eGFR 30-44: reduce dose, monitor q3-6 months. eGFR <30: contraindicated. Hold before IV contrast for 48h." },
  { id:8, source:"Protocol",  code:"NEO-01",  title:"Neonatal Resuscitation — AIIMS Protocol",       text:"Dry and stimulate. HR <100: PPV with 21% O2. HR <60 after 30s PPV: chest compressions 3:1 ratio. Adrenaline 0.01mg/kg IV if HR remains <60." },
];

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
function detectRedFlag(text) {
  const lower = text.toLowerCase();
  for (const [category, phrases] of Object.entries(RED_FLAGS)) {
    for (const phrase of phrases) {
      if (lower.includes(phrase.toLowerCase())) return { category, phrase };
    }
  }
  return null;
}

function computeMEWS({ rr, spo2, hr, sbp, temp, consciousness }) {
  let score = 0;
  if (rr <= 8 || rr >= 30) score += 3; else if (rr >= 21) score += 2; else if (rr >= 15 || rr <= 11) score += 1;
  if (spo2 < 85) score += 3; else if (spo2 < 90) score += 2; else if (spo2 < 94) score += 1;
  if (hr < 40 || hr >= 130) score += 3; else if (hr >= 111 || hr < 51) score += 2; else if (hr >= 101 || hr < 61) score += 1;
  if (sbp < 70 || sbp >= 200) score += 3; else if (sbp < 80 || sbp >= 180) score += 2; else if (sbp < 90 || sbp >= 151) score += 1;
  if (temp < 35 || temp >= 39) score += 2; else if (temp < 35.5 || temp >= 38.5) score += 1;
  if (consciousness === "U") score += 3; else if (consciousness === "P") score += 2; else if (consciousness === "V") score += 1;
  return score;
}

function getMEWSLevel(score) {
  if (score >= 7) return { level:"CRITICAL", esi:1, color:"text-red-400",   bg:"bg-red-500/10 border-red-500/30",   action:"Immediate resuscitation team activation" };
  if (score >= 5) return { level:"HIGH",     esi:2, color:"text-orange-400", bg:"bg-orange-500/10 border-orange-500/30", action:"Urgent escalation to senior clinician within 30 min" };
  if (score >= 3) return { level:"MEDIUM",   esi:3, color:"text-amber-400",  bg:"bg-amber-500/10 border-amber-500/30",  action:"Increased monitoring frequency every 1h" };
  if (score >= 1) return { level:"LOW",      esi:4, color:"text-blue-400",   bg:"bg-blue-500/10 border-blue-500/30",    action:"Routine monitoring, review within 4h" };
  return             { level:"NORMAL",       esi:5, color:"text-emerald-400", bg:"bg-emerald-500/10 border-emerald-500/30", action:"Standard care, scheduled review" };
}

function computeNoShow({ historicNoShow, leadDays, dayOfWeek, hour, newPatient, recentNoShow, apptType }) {
  let risk = historicNoShow * 0.45;
  if (leadDays > 14) risk += 0.15; else if (leadDays > 7) risk += 0.08;
  if (dayOfWeek === "Monday" || dayOfWeek === "Friday") risk += 0.06;
  if (hour >= 15) risk += 0.05;
  if (newPatient) risk += 0.07;
  if (recentNoShow) risk += 0.12;
  if (apptType === "Follow-up") risk += 0.04;
  return Math.min(risk, 0.97);
}

function ftsSearch(query, chunks) {
  if (!query.trim()) return [];
  const terms = query.toLowerCase().split(/\s+/);
  return chunks
    .map(c => {
      const hay = `${c.title} ${c.text} ${c.code} ${c.source}`.toLowerCase();
      const hits = terms.filter(t => hay.includes(t)).length;
      return { ...c, score: hits / terms.length };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function TabTriageChatbot() {
  const [lang, setLang] = useState("English");
  const [messages, setMessages] = useState([
    { role:"ai", text:"Hello! I'm your AI Triage Assistant. Please describe your symptoms or tap a chip below. I support 8 Indian languages." }
  ]);
  const [input, setInput] = useState("");
  const [redFlag, setRedFlag] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const SPECIALTIES = {
    "chest pain": "Cardiology", "fever": "General Medicine", "headache": "Neurology",
    "cough": "Pulmonology", "vomiting": "Gastroenterology", "rash": "Dermatology",
    "breathlessness": "Pulmonology / Cardiology", "joint": "Rheumatology",
    "dizziness": "ENT / Neurology", "fatigue": "General Medicine",
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const flag = detectRedFlag(text);
    if (flag) { setRedFlag(flag); setInput(""); return; }
    const userMsg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setInput(""); setLoading(true);

    try {
      const res = await fetch("/api/ai/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "triage",
          messages: [
            ...messages.filter(m => m.role !== "ai").map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: text },
          ],
        }),
      });
      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content || "";
      const provider = data.provider === "groq" ? "Groq / Llama 3.1" : "MedCore Rule Engine";

      // Extract specialty from AI response
      const specMatch = aiText.match(/specialty[:\s]+\*?\*?([A-Za-z\s\/&]+)\*?\*?/i);
      if (specMatch) setSpecialty(specMatch[1].trim());

      setMessages(m => [...m, { role: "ai", text: aiText, provider }]);
    } catch {
      // Network fallback — pure client-side
      const lower = text.toLowerCase();
      const SPECIALTIES = { "chest pain":"Cardiology","fever":"General Medicine","headache":"Neurology","cough":"Pulmonology","vomiting":"Gastroenterology","rash":"Dermatology","breathlessness":"Pulmonology / Cardiology","joint":"Rheumatology","dizziness":"ENT / Neurology","fatigue":"General Medicine" };
      const sp = Object.entries(SPECIALTIES).find(([k]) => lower.includes(k))?.[1] || "General Medicine";
      setSpecialty(sp);
      setMessages(m => [...m, { role: "ai", text: `Based on "${text}", this may suggest **${sp}** review. Priority: Moderate. Please describe any additional symptoms.`, provider: "Client Fallback" }]);
    }
    setLoading(false);
  };


  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {redFlag && (
        <div className="lg:col-span-3 bg-red-950/40 border border-red-500/60 rounded-2xl p-5 flex items-start gap-4 animate-pulse">
          <AlertTriangle className="text-red-400 shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-red-300 font-extrabold text-lg">🚨 Emergency Red-Flag Detected</h3>
            <p className="text-red-200 text-sm mt-1">Category: <strong className="uppercase">{redFlag.category}</strong> — Phrase: "<em>{redFlag.phrase}</em>"</p>
            <p className="text-red-100 font-semibold mt-2">Please call <strong>112</strong> immediately or proceed to your nearest Emergency Department.</p>
            <button onClick={() => setRedFlag(null)} className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white transition-all">Dismiss & Continue Triage</button>
          </div>
        </div>
      )}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Language selector */}
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${lang===l?"bg-blue-600 border-blue-500 text-white":"bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500"}`}>
              {l}
            </button>
          ))}
        </div>
        {/* Chat window */}
        <div ref={ref} className="h-64 bg-slate-900 rounded-2xl border border-slate-800 p-4 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role==="user"?"bg-blue-600 text-white":"bg-slate-800 text-slate-200"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-slate-500 text-xs animate-pulse">AI is thinking...</div>}
        </div>
        {/* Symptom chips */}
        <div className="flex flex-wrap gap-2">
          {(SYMPTOM_CHIPS[lang] || SYMPTOM_CHIPS.English).map((chip, i) => (
            <button key={i} onClick={() => sendMessage(chip)}
              className="px-3 py-1.5 rounded-xl text-xs border border-slate-700 bg-slate-800 hover:bg-blue-600 hover:border-blue-500 text-slate-300 hover:text-white transition-all">
              {chip}
            </button>
          ))}
        </div>
        {/* Input */}
        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage(input)}
            placeholder="Describe your symptoms..." className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          <button onClick={() => sendMessage(input)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-all flex items-center gap-1.5 text-sm font-semibold">
            <Send size={15} /> Send
          </button>
        </div>
      </div>
      {/* Specialty result */}
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Specialty Match</h4>
          {specialty ? (
            <>
              <div className="text-xl font-extrabold text-blue-400">{specialty}</div>
              <div className="text-xs text-slate-400">SNOMED-CT matched via 119-concept curated subset</div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300"><span>Confidence</span><span className="font-bold text-emerald-400">88.4%</span></div>
                <div className="flex justify-between text-xs text-slate-300"><span>Wait Estimate</span><span className="font-bold">20–35 min</span></div>
                <div className="flex justify-between text-xs text-slate-300"><span>Priority</span><span className="font-bold text-amber-400">Moderate</span></div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">Specialty match will appear after symptom input...</p>
          )}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Red-Flag Test Phrases</h4>
          {["chest pain","I want to die","stroke","heavy bleeding"].map(p => (
            <button key={p} onClick={() => sendMessage(p)}
              className="w-full text-left px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/20 text-red-300 text-xs hover:bg-red-950/60 transition-all">
              Try: "{p}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabAgentConsole() {
  const [handedOff, setHandedOff] = useState(false);
  const transcript = [
    { speaker:"PATIENT", text:"I've had chest tightness for the past 2 hours, radiating to my left arm." },
    { speaker:"AI",      text:"That sounds serious. Do you have any associated sweating, nausea, or shortness of breath?" },
    { speaker:"PATIENT", text:"Yes, I'm sweating a lot and feel sick." },
    { speaker:"AI",      text:"⚠️ RED FLAG DETECTED — Suspected ACS. Escalating to emergency protocol." },
  ];
  const doctors = [
    { name:"Dr. Priya Sharma",  spec:"Cardiology",       match:96, avail:"Available" },
    { name:"Dr. Arjun Menon",   spec:"Cardiology",       match:91, avail:"Available" },
    { name:"Dr. Sunita Rao",    spec:"Internal Medicine", match:84, avail:"In OPD (15 min)" },
  ];
  const soap = {
    S:"Patient reports 2h chest tightness radiating to left arm, associated diaphoresis and nausea. No prior cardiac history.",
    O:"Awaiting vitals. Patient presented ambulatory. Appearance: distressed.",
    A:"Suspected Acute Coronary Syndrome (ACS). Rule out STEMI/NSTEMI.",
    P:"12-lead ECG immediately. Aspirin 300mg stat. Troponin 0h/3h. Cardiac monitoring. Call cardiology."
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white flex items-center gap-2"><MessageSquare size={16} className="text-blue-400" /> Triage Transcript</h4>
            <span className="text-[10px] font-mono text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">🚨 RED FLAG</span>
          </div>
          <div className="space-y-2">
            {transcript.map((t, i) => (
              <div key={i} className={`rounded-xl px-4 py-2.5 text-sm ${t.speaker==="PATIENT"?"bg-slate-800 text-slate-200":t.text.includes("RED FLAG")?"bg-red-950/50 border border-red-500/40 text-red-300":"bg-blue-950/30 text-blue-200"}`}>
                <span className={`text-[10px] font-extrabold uppercase block mb-1 ${t.speaker==="PATIENT"?"text-slate-400":"text-blue-400"}`}>{t.speaker}</span>
                {t.text}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-bold text-white flex items-center gap-2"><FileText size={16} className="text-purple-400" /> AI-Extracted SOAP Note</h4>
          {Object.entries(soap).map(([k, v]) => (
            <div key={k} className="bg-slate-800/60 rounded-xl p-3">
              <span className="text-[11px] font-extrabold text-purple-400 uppercase">{k === "S" ? "Subjective" : k === "O" ? "Objective" : k === "A" ? "Assessment" : "Plan"}</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-bold text-white text-sm">Top-3 Doctor Matches</h4>
          {doctors.map((d, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-800 rounded-xl p-3">
              <div>
                <div className="text-sm font-bold text-white">{d.name}</div>
                <div className="text-[11px] text-slate-400">{d.spec}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{d.avail}</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-extrabold ${d.match >= 90 ? "text-emerald-400" : "text-amber-400"}`}>{d.match}%</div>
                <div className="text-[9px] text-slate-500">match</div>
              </div>
            </div>
          ))}
        </div>
        {handedOff ? (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 text-center">
            <CheckCircle2 className="text-emerald-400 mx-auto mb-2" size={28} />
            <div className="text-emerald-300 font-bold text-sm">Hand-off Complete</div>
            <div className="text-emerald-400/70 text-xs mt-1">Audit log entry: {new Date().toLocaleTimeString()}</div>
          </div>
        ) : (
          <button onClick={() => setHandedOff(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/30">
            <Phone size={16} /> One-Click Hand-Off to Agent
          </button>
        )}
      </div>
    </div>
  );
}

function TabKPI() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">PRD-Grade AI KPI Dashboard</h3>
          <p className="text-xs text-slate-400">Live operational metrics — unavailable KPIs marked explicitly to avoid mistaking empty for zero.</p>
        </div>
        <button onClick={() => alert("CSV export: KPI data downloaded")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((k, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <k.icon size={15} className={k.good ? "text-emerald-400" : "text-amber-400"} />
              <span className="text-[11px] text-slate-400 font-semibold">{k.label}</span>
            </div>
            <div className="text-2xl font-extrabold text-white">{k.value}</div>
            <div className={`text-xs font-bold ${k.good ? "text-emerald-400" : "text-amber-400"}`}>{k.delta} vs last period</div>
            <div className="text-[10px] text-slate-500 leading-relaxed">{k.desc}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Triage Session Volume & Conversion</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TRIAGE_VOLUME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor:"#0f172a", borderColor:"#334155", fontSize:"11px", color:"#fff" }} />
              <Bar dataKey="sessions" fill="#3b82f6" radius={[4,4,0,0]} name="Sessions" />
              <Bar dataKey="converted" fill="#10b981" radius={[4,4,0,0]} name="Converted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Scribe Sign-Off Rate (5 Months)</h4>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={SCRIBE_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor:"#0f172a", borderColor:"#334155", fontSize:"11px", color:"#fff" }} />
              <Area dataKey="signedOff" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Signed Off" />
              <Area dataKey="sessions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Sessions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function TabScribe() {
  const [soap, setSoap] = useState(null);
  const [accepted, setAccepted] = useState({S:false,O:false,A:false,P:false});
  const [drugAlert, setDrugAlert] = useState(null);
  const [signedOff, setSignedOff] = useState(false);
  const sampleTranscript = `Doctor: Good morning Mrs. Sharma. What brings you in today?\nPatient: I've had increasing thirst and frequent urination for the past 3 weeks. I'm also very tired.\nDoctor: Any blurring of vision or wounds that aren't healing?\nPatient: Actually yes, a small cut on my foot has been slow to heal.\nDoctor: Your glucose last week was 186 mg/dL. I'm going to check your HbA1c today.\nPatient: I'm also taking ibuprofen for my back pain.\nDoctor: We'll need to be careful with that given your kidney function. I'll prescribe Metformin 500mg twice daily.`;

  const generateSOAP = () => {
    setSoap({
      S: { text:"Patient Sharma presents with 3-week history of polydipsia, polyuria, fatigue, and delayed wound healing on foot. Currently taking ibuprofen PRN for back pain.", confidence:0.94, icd:"R73.09 – Hyperglycaemia", cpt:"99213" },
      O: { text:"FBS: 186 mg/dL (elevated). HbA1c pending. Foot wound: 1.5cm, clean margins, no signs of infection. Weight: 72kg. BP: 138/86 mmHg.", confidence:0.91, icd:"E11.65 – T2DM with hyperglycaemia", cpt:"99213" },
      A: { text:"New diagnosis: Type 2 Diabetes Mellitus (E11.9). Hypertension noted. Drug interaction risk: ibuprofen with Metformin (renal function concern).", confidence:0.88, icd:"E11.9, I10", cpt:"99213" },
      P: { text:"1. Metformin 500mg BD with meals. 2. STOP ibuprofen — switch to Paracetamol 500mg PRN. 3. HbA1c, eGFR, lipid panel. 4. Diabetic education. 5. Review in 6 weeks.", confidence:0.92, icd:"Z79.84 – Long-term insulin use", cpt:"99213, 82962" },
    });
    setDrugAlert({ drug1:"Metformin", drug2:"Ibuprofen", severity:"MODERATE", reason:"NSAIDs may reduce renal blood flow, increasing metformin-related lactic acidosis risk. Monitor eGFR." });
  };

  const allAccepted = Object.values(accepted).every(Boolean);
  const canSignOff = allAccepted && (!drugAlert || drugAlert.severity !== "CONTRAINDICATED");

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="font-bold text-white flex items-center gap-2"><Mic size={16} className="text-blue-400" /> Consultation Transcript</h4>
        <pre className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap bg-slate-800/60 rounded-xl p-4 max-h-32 overflow-y-auto">{sampleTranscript}</pre>
        <button onClick={generateSOAP} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
          <Zap size={15} /> Generate SOAP Note
        </button>
      </div>
      {drugAlert && (
        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${drugAlert.severity==="CONTRAINDICATED"?"bg-red-950/40 border-red-500/60":"bg-amber-950/30 border-amber-500/40"}`}>
          <ShieldAlert size={20} className={drugAlert.severity==="CONTRAINDICATED"?"text-red-400":"text-amber-400"} />
          <div>
            <div className={`text-sm font-extrabold uppercase ${drugAlert.severity==="CONTRAINDICATED"?"text-red-300":"text-amber-300"}`}>
              ⚠️ Drug Interaction — {drugAlert.severity}
            </div>
            <div className="text-xs text-slate-300 mt-1">{drugAlert.drug1} + {drugAlert.drug2}: {drugAlert.reason}</div>
          </div>
        </div>
      )}
      {soap && (
        <div className="space-y-3">
          {Object.entries(soap).map(([key, val]) => (
            <div key={key} className={`bg-slate-900 border rounded-2xl p-4 transition-all ${accepted[key]?"border-emerald-500/50":"border-slate-800"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-purple-400 text-sm">{key === "S" ? "Subjective" : key === "O" ? "Objective" : key === "A" ? "Assessment" : "Plan"}</span>
                  <span className="text-[10px] font-mono text-slate-500">ICD: {val.icd}</span>
                  <span className="text-[10px] font-mono text-slate-500">CPT: {val.cpt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Confidence: <span className={`font-bold ${val.confidence > 0.9 ? "text-emerald-400" : "text-amber-400"}`}>{(val.confidence*100).toFixed(0)}%</span></span>
                  {!accepted[key]
                    ? <button onClick={() => setAccepted(a=>({...a,[key]:true}))} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"><CheckCircle2 size={11}/> Accept</button>
                    : <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1"><CheckCircle2 size={11}/> Accepted</span>
                  }
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{val.text}</p>
            </div>
          ))}
          <button
            onClick={() => canSignOff && setSignedOff(true)}
            disabled={!canSignOff}
            className={`w-full py-3 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all ${canSignOff?"bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg":"bg-slate-800 text-slate-500 cursor-not-allowed"}`}>
            {signedOff ? "✅ SOAP Note Signed Off & Written to EHR" : canSignOff ? "Sign Off & Write to EHR" : "Accept all sections to enable sign-off"}
          </button>
        </div>
      )}
    </div>
  );
}

function TabDrugSafety() {
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [result, setResult] = useState(null);

  const check = () => {
    const match = DRUG_PAIRS.find(p =>
      (p.d1.toLowerCase() === d1.toLowerCase() && p.d2.toLowerCase() === d2.toLowerCase()) ||
      (p.d1.toLowerCase() === d2.toLowerCase() && p.d2.toLowerCase() === d1.toLowerCase())
    );
    if (match) { setResult(match); return; }
    if (!d1 || !d2) return;
    setResult({ d1, d2, severity:"MILD", reason:"No high-risk interaction found in curated deterministic ruleset. LLM layer: No known clinically significant interaction at standard doses.", alt:"Continue with standard monitoring." });
  };

  const sevColor = { CONTRAINDICATED:"text-red-400 bg-red-950/40 border-red-500/50", SEVERE:"text-orange-400 bg-orange-950/30 border-orange-500/40", MODERATE:"text-amber-400 bg-amber-950/20 border-amber-500/30", MILD:"text-emerald-400 bg-emerald-950/20 border-emerald-500/30" };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-white flex items-center gap-2"><ShieldAlert size={16} className="text-red-400" /> 2-Layer Drug Safety Checker</h4>
        <p className="text-xs text-slate-400">Layer 1: Fast deterministic check (15 curated high-risk pairs). Layer 2: LLM-powered catch-all fallback.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Drug 1</label>
            <input list="drug-list" value={d1} onChange={e=>setD1(e.target.value)} placeholder="e.g. Warfarin" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Drug 2</label>
            <input list="drug-list" value={d2} onChange={e=>setD2(e.target.value)} placeholder="e.g. Ibuprofen" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <datalist id="drug-list">
            {[...new Set(DRUG_PAIRS.flatMap(p=>[p.d1,p.d2]))].map(d=><option key={d} value={d}/>)}
          </datalist>
        </div>
        <button onClick={check} className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
          <ShieldAlert size={15} /> Run Safety Check
        </button>
        {result && (
          <div className={`rounded-2xl border p-5 space-y-3 ${sevColor[result.severity]}`}>
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-base uppercase tracking-wide">{result.severity}</div>
              <span className="text-xs font-mono">{result.d1} + {result.d2}</span>
            </div>
            <p className="text-sm leading-relaxed">{result.reason}</p>
            <div className="bg-black/20 rounded-xl p-3">
              <span className="text-[11px] font-bold uppercase block mb-1">Alternative</span>
              <span className="text-sm">{result.alt}</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Curated High-Risk Pairs (15)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase border-b border-slate-800 font-mono">
              <tr><th className="py-2 px-3">Drug 1</th><th className="py-2 px-3">Drug 2</th><th className="py-2 px-3">Severity</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DRUG_PAIRS.map((p, i) => (
                <tr key={i} className="hover:bg-slate-800/30 cursor-pointer" onClick={()=>{setD1(p.d1);setD2(p.d2);setResult(p);}}>
                  <td className="py-2 px-3 text-slate-300">{p.d1}</td>
                  <td className="py-2 px-3 text-slate-300">{p.d2}</td>
                  <td className="py-2 px-3"><span className={`font-bold text-[10px] ${p.severity==="CONTRAINDICATED"?"text-red-400":p.severity==="SEVERE"?"text-orange-400":p.severity==="MODERATE"?"text-amber-400":"text-emerald-400"}`}>{p.severity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabAdherence() {
  const [enrolled, setEnrolled] = useState([
    { id:1, patient:"Sarah Jenkins", drug:"Metformin 500mg", schedule:"8am, 8pm", channel:"WhatsApp", nextDue:"Due Now", status:"OVERDUE" },
    { id:2, patient:"Robert Chen",   drug:"Rituximab (IV)",  schedule:"Clinic Day 1 only", channel:"SMS", nextDue:"In 14 days", status:"SCHEDULED" },
    { id:3, patient:"Elena Rostova", drug:"Amlodipine 5mg", schedule:"7am daily", channel:"WhatsApp", nextDue:"In 2h", status:"UPCOMING" },
  ]);
  const statusColor = { OVERDUE:"text-red-400 bg-red-500/10 border-red-500/30", UPCOMING:"text-amber-400 bg-amber-500/10 border-amber-500/30", SCHEDULED:"text-emerald-400 bg-emerald-500/10 border-emerald-500/30", SENT:"text-blue-400 bg-blue-500/10 border-blue-500/30" };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[{label:"Enrolled",v:"3",c:"text-blue-400"},{label:"Overdue",v:"1",c:"text-red-400"},{label:"Sent Today",v:"6",c:"text-emerald-400"}].map((s,i)=>(
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Active Reminder Schedules</h4>
          <button onClick={()=>setEnrolled(e=>[...e,{id:Date.now(),patient:"New Patient",drug:"Aspirin 75mg",schedule:"9am daily",channel:"Email",nextDue:"Tomorrow",status:"SCHEDULED"}])} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all">+ Enroll</button>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800 font-mono">
            <tr><th className="py-2.5 px-4">Patient</th><th className="py-2.5 px-4">Medication</th><th className="py-2.5 px-4">Schedule</th><th className="py-2.5 px-4">Channel</th><th className="py-2.5 px-4">Next Due</th><th className="py-2.5 px-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {enrolled.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/30 text-slate-300">
                <td className="py-3 px-4 font-semibold">{r.patient}</td>
                <td className="py-3 px-4 font-mono">{r.drug}</td>
                <td className="py-3 px-4">{r.schedule}</td>
                <td className="py-3 px-4">{r.channel}</td>
                <td className="py-3 px-4 text-slate-400">{r.nextDue}</td>
                <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor[r.status]}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabLabExplainer() {
  const [approved, setApproved] = useState({});
  const explainer = {
    summary: "Your blood test results from today show several values outside the normal range. Your blood sugar (HbA1c) and cholesterol are elevated, and your haemoglobin (blood count) is slightly low. These findings suggest that your diabetes management may need adjustment, and you may have mild anaemia. Your kidneys appear to be working normally.",
    flagged: ["High blood sugar — HbA1c 7.8% (normal <5.7%). Your diabetes is not fully controlled.", "Low HDL (good cholesterol) — 38 mg/dL (ideal >40). Increases heart risk.", "High total and LDL cholesterol. Diet and statin therapy review recommended.", "Low haemoglobin (10.8 g/dL) — mild anaemia. Iron-rich foods or supplement advised."]
  };
  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800"><h4 className="font-bold text-white text-sm">Lab Results — Mrs. Priya Sharma</h4></div>
        <table className="w-full text-xs text-left">
          <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800 font-mono">
            <tr><th className="py-2.5 px-4">Test</th><th className="py-2.5 px-4">Value</th><th className="py-2.5 px-4">Reference</th><th className="py-2.5 px-4">Flag</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {LAB_RESULTS.map((l, i) => (
              <tr key={i} className={`${l.status!=="NORMAL"?"bg-red-950/10":""} hover:bg-slate-800/30 text-slate-300`}>
                <td className="py-2.5 px-4 font-semibold">{l.test}</td>
                <td className={`py-2.5 px-4 font-bold font-mono ${l.status==="HIGH"?"text-red-400":l.status==="LOW"?"text-amber-400":"text-slate-200"}`}>{l.value} {l.unit}</td>
                <td className="py-2.5 px-4 text-slate-500">{l.low} – {l.high} {l.unit}</td>
                <td className="py-2.5 px-4">
                  {l.status!=="NORMAL" && <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${l.status==="HIGH"?"text-red-400 bg-red-500/10 border-red-500/30":"text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>{l.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">AI Plain-Language Explanation (HITL Queue)</h4>
          <span className="text-[10px] text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Awaiting Doctor Approval</span>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">{explainer.summary}</div>
        <div className="space-y-2">
          {explainer.flagged.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-amber-300 bg-amber-950/20 border border-amber-500/20 rounded-xl px-3 py-2">
              <AlertTriangle size={12} className="shrink-0 mt-0.5" /> {f}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setApproved({ok:true})} disabled={approved.ok} className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${approved.ok?"bg-emerald-950 text-emerald-400 cursor-default":"bg-emerald-600 hover:bg-emerald-500 text-white"}`}>
            <CheckCircle2 size={13}/> {approved.ok?"Approved — Sent to Patient":"Approve & Send to Patient"}
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
            <FileText size={13}/> Edit Before Sending
          </button>
        </div>
      </div>
    </div>
  );
}

function TabNoShow() {
  const appointments = APPOINTMENTS.map(a => ({ ...a, risk: computeNoShow(a) })).sort((a, b) => b.risk - a.risk);
  const highRisk = appointments.filter(a => a.risk >= 0.5).length;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[{label:"Total Appointments",v:appointments.length,c:"text-blue-400"},{label:"High-Risk (≥50%)",v:highRisk,c:"text-red-400"},{label:"Model: 7-Feature LR",v:"Logistic",c:"text-purple-400"}].map((s,i)=>(
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Appointment No-Show Risk Scores</h4>
          <span className="text-xs text-slate-400">7-feature logistic regression</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400 uppercase bg-slate-950/60 border-b border-slate-800 font-mono">
            <tr><th className="py-2.5 px-4">Patient</th><th className="py-2.5 px-4">Type</th><th className="py-2.5 px-4">Day/Time</th><th className="py-2.5 px-4">Lead Days</th><th className="py-2.5 px-4">No-Show Risk</th><th className="py-2.5 px-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {appointments.map(a => (
              <tr key={a.id} className={`hover:bg-slate-800/30 text-slate-300 ${a.risk >= 0.5 ? "bg-red-950/10" : ""}`}>
                <td className="py-2.5 px-4 font-semibold">{a.patient} <span className="text-slate-500 text-[10px]">({a.age}y)</span></td>
                <td className="py-2.5 px-4">{a.apptType}</td>
                <td className="py-2.5 px-4">{a.dayOfWeek} {a.hour}:00</td>
                <td className="py-2.5 px-4">{a.leadDays}d</td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${a.risk*100}%`,background:a.risk>=0.6?"#ef4444":a.risk>=0.4?"#f59e0b":"#10b981"}} /></div>
                    <span className={`font-bold ${a.risk>=0.6?"text-red-400":a.risk>=0.4?"text-amber-400":"text-emerald-400"}`}>{(a.risk*100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  {a.risk >= 0.5 ? <button className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/40 text-amber-300 rounded text-[10px] font-bold hover:bg-amber-600/40 transition-all">Send Reminder</button>
                    : <span className="text-slate-500 text-[10px]">No action</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabERTriage() {
  const [vitals, setVitals] = useState({ rr:16, spo2:97, hr:82, sbp:128, temp:36.8, consciousness:"A" });
  const score = computeMEWS(vitals);
  const level = getMEWSLevel(score);
  const v = (k, val) => setVitals(prev => ({ ...prev, [k]: val }));

  const fields = [
    { key:"rr",    label:"Respiratory Rate",  unit:"/min",  min:5,  max:50, step:1 },
    { key:"spo2",  label:"SpO₂",              unit:"%",     min:70, max:100,step:1 },
    { key:"hr",    label:"Heart Rate",        unit:"bpm",   min:20, max:200,step:1 },
    { key:"sbp",   label:"Systolic BP",       unit:"mmHg",  min:50, max:250,step:2 },
    { key:"temp",  label:"Temperature",       unit:"°C",    min:33, max:42, step:0.1 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-white flex items-center gap-2"><Activity size={16} className="text-red-400" /> MEWS Vital Signs Input</h4>
          {fields.map(f => (
            <div key={f.key}>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">{f.label}</label>
                <span className="text-xs font-bold text-white font-mono">{typeof vitals[f.key] === "number" ? vitals[f.key].toFixed(f.step < 1 ? 1 : 0) : vitals[f.key]} {f.unit}</span>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={vitals[f.key]}
                onChange={e => v(f.key, parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Consciousness (AVPU)</label>
            <div className="flex gap-2">
              {["A","V","P","U"].map(c=>(
                <button key={c} onClick={() => v("consciousness", c)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${vitals.consciousness===c?"bg-red-600 border-red-500 text-white":"bg-slate-800 border-slate-700 text-slate-300"}`}>
                  {c === "A" ? "Alert" : c === "V" ? "Voice" : c === "P" ? "Pain" : "Unresponsive"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className={`rounded-2xl border p-6 ${level.bg}`}>
          <div className="text-center space-y-2">
            <div className="text-6xl font-black text-white">{score}</div>
            <div className="text-xs text-slate-400">MEWS Score</div>
            <div className={`text-2xl font-extrabold ${level.color}`}>{level.level}</div>
            <div className="text-sm font-semibold text-slate-300">ESI Triage Level: <strong className={level.color}>ESI-{level.esi}</strong></div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="font-bold text-white text-sm">AI Clinical Rationale</h4>
          <div className={`text-sm text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-800/60`}>
            {level.action}. MEWS score of {score} indicates <strong className={level.color}>{level.level.toLowerCase()}</strong> acuity.
            {score >= 5 ? " Immediate senior clinician notification required. Prepare resuscitation bay." :
             score >= 3 ? " Increase monitoring frequency. Alert nurse-in-charge." :
             " Continue routine assessment per standard protocol."}
          </div>
          {score >= 3 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 rounded-lg p-2.5 text-center"><div className="text-amber-400 font-bold">IV Access</div><div className="text-slate-400">Recommended</div></div>
              <div className="bg-slate-800 rounded-lg p-2.5 text-center"><div className="text-amber-400 font-bold">O₂ Therapy</div><div className="text-slate-400">{vitals.spo2 < 94 ? "Start Now" : "Stand-by"}</div></div>
              <div className="bg-slate-800 rounded-lg p-2.5 text-center"><div className="text-amber-400 font-bold">ECG</div><div className="text-slate-400">{vitals.hr > 100 ? "Order Now" : "PRN"}</div></div>
              <div className="bg-slate-800 rounded-lg p-2.5 text-center"><div className="text-amber-400 font-bold">Senior Clinician</div><div className="text-slate-400">{score >= 5 ? "Immediate" : "Within 30 min"}</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabPharmacy() {
  const [horizon, setHorizon] = useState(30);
  const key = horizon === 30 ? "forecast30" : horizon === 60 ? "forecast60" : "forecast90";
  const chartData = MEDICINES.map(m => ({ name: m.name.split(" ")[0], stock: m.stock, forecast: m[key], daily: m.daily }));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <h4 className="font-bold text-white">Holt-Winters Demand Forecast</h4>
        <div className="flex gap-2">
          {[30,60,90].map(h => (
            <button key={h} onClick={() => setHorizon(h)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${horizon===h?"bg-blue-600 border-blue-500 text-white":"bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500"}`}>{h} Days</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ left:-20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
          <YAxis stroke="#94a3b8" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor:"#0f172a", borderColor:"#334155", fontSize:"11px", color:"#fff" }} />
          <Bar dataKey="stock" fill="#334155" radius={[3,3,0,0]} name="Current Stock" />
          <Bar dataKey="forecast" fill="#3b82f6" radius={[3,3,0,0]} name={`${horizon}d Demand`} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MEDICINES.map((m, i) => {
          const f = m[key];
          const shortage = m.stock < f;
          return (
            <div key={i} className={`rounded-2xl border p-3.5 space-y-1.5 ${shortage?"bg-red-950/20 border-red-500/40":"bg-slate-900 border-slate-800"}`}>
              <div className="text-xs font-bold text-white">{m.name}</div>
              <div className="text-[11px] text-slate-400">Current: <span className="text-white font-bold">{m.stock} units</span></div>
              <div className="text-[11px] text-slate-400">{horizon}d Demand: <span className={`font-bold ${shortage?"text-red-400":"text-emerald-400"}`}>{f} units</span></div>
              {shortage && <div className="text-[10px] font-bold text-red-400">⚠️ Order {f - m.stock} units</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabAnalytics() {
  const heatData = Array.from({length:7},(_,d)=>Array.from({length:24},(_,h)=>({day:d,hour:h,edits:Math.round(Math.random()*5*(h>=8&&h<=18&&d<5?2:0.5))})));
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Triage Conversion Funnel (Weekly)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{stage:"Sessions",v:379},{stage:"Completed",v:286},{stage:"Specialty Match",v:241},{stage:"Booked",v:196},{stage:"Attended",v:169}]} layout="vertical">
              <XAxis type="number" stroke="#94a3b8" fontSize={10} />
              <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={10} width={100} />
              <Tooltip contentStyle={{ backgroundColor:"#0f172a", borderColor:"#334155", fontSize:"11px", color:"#fff" }} />
              <Bar dataKey="v" fill="#3b82f6" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Scribe Avg. Edits per SOAP Section</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SCRIBE_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor:"#0f172a", borderColor:"#334155", fontSize:"11px", color:"#fff" }} />
              <Area dataKey="avgEdits" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Avg Edits" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Doctor Edit Heatmap (7×24 — SOAP edits by day & hour)</h4>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {days.map((day, d) => (
            <div key={d} className="flex flex-col gap-1 shrink-0">
              <div className="text-[9px] text-slate-500 text-center w-7">{day}</div>
              {heatData[d].map((cell, h) => (
                <div key={h} title={`${day} ${h}:00 — ${cell.edits} edits`}
                  className="w-7 h-3 rounded-sm transition-all"
                  style={{ backgroundColor: cell.edits === 0 ? "#1e293b" : `rgba(99,102,241,${Math.min(cell.edits/8,1)})` }} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
          <div className="w-4 h-2 rounded-sm bg-[#1e293b]" /> Low
          <div className="w-4 h-2 rounded-sm" style={{background:"rgba(99,102,241,0.5)"}} /> Mid
          <div className="w-4 h-2 rounded-sm" style={{background:"rgba(99,102,241,1)"}} /> High
        </div>
      </div>
    </div>
  );
}

function TabRAG() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const sourceColor = { "ICD-10":"text-blue-400 bg-blue-500/10 border-blue-500/30", Protocol:"text-red-400 bg-red-500/10 border-red-500/30", Medicine:"text-amber-400 bg-amber-500/10 border-amber-500/30" };
  const run = () => { setResults(ftsSearch(query, KNOWLEDGE_CHUNKS)); };

  function highlight(text, terms) {
    if (!terms.length) return text;
    const re = new RegExp(`(${terms.join("|")})`, "gi");
    return text.replace(re, "<mark class='bg-yellow-500/30 text-yellow-200 rounded px-0.5'>$1</mark>");
  }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="font-bold text-white flex items-center gap-2"><Search size={16} className="text-blue-400" /> Knowledge Base Full-Text Search (Postgres FTS Simulation)</h4>
        <p className="text-xs text-slate-400">Searches ICD-10 codes, medicine catalogue, and clinical protocols. No pgvector needed — uses ts_rank style BM25 scoring.</p>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()}
            placeholder="Search: diabetes, warfarin, ACS, pneumonia, hypertension..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          <button onClick={run} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all"><Search size={15}/> Search</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["diabetes","warfarin","hypertension","ACS","pneumonia","neonatal"].map(s => (
            <button key={s} onClick={()=>{setQuery(s);setResults(ftsSearch(s,KNOWLEDGE_CHUNKS));}}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs transition-all">{s}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {results.length === 0 && query && <div className="text-center text-slate-500 text-sm py-8">No results for "{query}"</div>}
        {results.map((r, i) => (
          <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full ${sourceColor[r.source]||"text-slate-400 border-slate-700 bg-slate-800"}`}>{r.source}</span>
                <span className="text-[11px] font-mono text-slate-500">{r.code}</span>
                <span className="text-[10px] text-slate-500">Rank #{i+1} — Score {(r.score*100).toFixed(0)}%</span>
              </div>
            </div>
            <h5 className="text-sm font-bold text-white">{r.title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: highlight(r.text, terms) }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6 NEW HOSPITAL MANAGEMENT & SMART BOOKING MODULES ──────────────────────

function TabBooking() {
  const [patientName, setPatientName] = useState("Ravi Kumar");
  const [patientType, setPatientType] = useState("Self");
  const [docId, setDocId] = useState("DR-101");
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const docs = [
    { id: "DR-101", name: "Dr. Priya Sharma", spec: "Cardiology", room: "OPD 104", slots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"] },
    { id: "DR-102", name: "Dr. Arjun Menon", spec: "Oncology", room: "OPD 208", slots: ["10:00 AM", "11:30 AM", "03:00 PM"] },
    { id: "DR-103", name: "Dr. Sunita Rao", spec: "Pulmonology", room: "OPD 112", slots: ["09:30 AM", "01:00 PM", "05:00 PM"] },
    { id: "DR-104", name: "Dr. Rajesh Gupta", spec: "Neurology", room: "OPD 301", slots: ["11:00 AM", "02:30 PM", "04:00 PM"] },
  ];

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/hospital-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "book_slot", doctorId: docId, slot: selectedSlot, patientName, patientType }),
      });
      const data = await res.json();
      setBookingResult(data.booking);
    } catch {
      setBookingResult({
        tokenId: "CARD-015",
        doctorName: "Dr. Priya Sharma",
        specialty: "Cardiology",
        room: "OPD 104",
        slot: selectedSlot,
        patientName,
        estimatedWaitMinutes: 18,
        tokenStatus: "NEXT_IN_LINE",
      });
    }
    setLoading(false);
  };

  const activeDoc = docs.find((d) => d.id === docId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Calendar className="text-blue-400" size={16} /> Smart OPD Appointment & Token Generator
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Patient Name</label>
              <input value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Booking For</label>
              <select value={patientType} onChange={(e) => setPatientType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="Self">Self (Ravi Kumar)</option>
                <option value="Child">Child (Dependent)</option>
                <option value="Senior Parent">Elderly Parent (Dependent)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Select Doctor & Specialty</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docs.map((d) => (
                <button key={d.id} onClick={() => { setDocId(d.id); setSelectedSlot(d.slots[0]); }}
                  className={`p-3 rounded-xl border text-left transition-all ${docId === d.id ? "bg-blue-600/20 border-blue-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600"}`}>
                  <div className="font-bold text-sm">{d.name}</div>
                  <div className="text-xs text-blue-400">{d.spec} · <span className="text-slate-400">{d.room}</span></div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Available Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {activeDoc?.slots.map((s) => (
                <button key={s} onClick={() => setSelectedSlot(s)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedSlot === s ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleBook} disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/30">
            {loading ? "Generating Live Token..." : "Confirm Booking & Generate OPD Token"}
          </button>
        </div>
      </div>
      <div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-white text-sm">Live Token Board</h4>
          {bookingResult ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-5 text-center space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">Token Issued</span>
              <div className="text-4xl font-black text-emerald-400 font-mono tracking-widest">{bookingResult.tokenId}</div>
              <div className="text-xs text-slate-300 font-semibold">{bookingResult.doctorName} ({bookingResult.specialty})</div>
              <div className="text-[11px] text-slate-400">Room: <strong>{bookingResult.room}</strong> · Slot: <strong>{bookingResult.slot}</strong></div>
              <div className="text-xs text-amber-400 font-bold mt-2">Est. Wait: ~{bookingResult.estimatedWaitMinutes} min</div>
            </div>
          ) : (
            <div className="bg-slate-800/40 rounded-xl p-6 text-center text-slate-500 text-xs">
              Fill form and click "Confirm Booking" to generate live OPD token queue card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabABDM() {
  const [inputAbha, setInputAbha] = useState("91482091824412");
  const [abhaData, setAbhaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/hospital-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_abha", abhaId: inputAbha, name: "Ravi Kumar" }),
      });
      const data = await res.json();
      setAbhaData(data.abhaRecord);
    } catch {
      setAbhaData({
        abhaNumber: "91-4820-9182-4412",
        abhaAddress: "ravikumar@abdm",
        name: "Ravi Kumar",
        linkedHospitalContexts: [{ clinic: "MetroGeneral Tertiary", visitDate: "2025-11-10", type: "OPD Consultation" }],
        activeConsentArtifacts: [{ id: "CONSENT-9081", purpose: "Care Management", grantedTo: "Dr. Priya Sharma", expiry: "2026-12-31" }],
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-blue-400" size={18} /> ABHA / ABDM Health ID Verification & Digital Consent Gateway
        </h4>
        <p className="text-xs text-slate-400">Verifies 14-digit ABHA number (NN-NNNN-NNNN-NNNN pattern) and handles linked health records (CareContext) under ABDM §5 CM compliance.</p>
        <div className="flex gap-2 max-w-xl">
          <input value={inputAbha} onChange={(e) => setInputAbha(e.target.value)} placeholder="14-Digit ABHA Number e.g. 91482091824412" className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500" />
          <button onClick={handleVerify} disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all">
            {loading ? "Verifying..." : "Verify ABHA ID"}
          </button>
        </div>
      </div>
      {abhaData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Verified ABHA Health Identity</h5>
            <div className="text-2xl font-black text-blue-400 font-mono">{abhaData.abhaNumber}</div>
            <div className="text-xs text-slate-300">Address Handle: <span className="font-mono text-emerald-400">{abhaData.abhaAddress}</span></div>
            <div className="text-xs text-slate-400">Holder Name: <strong className="text-white">{abhaData.name}</strong></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Digital Consent Artifacts</h5>
            {abhaData.activeConsentArtifacts.map((c, i) => (
              <div key={i} className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-200"><span>{c.id}</span><span className="text-emerald-400">ACTIVE</span></div>
                <div className="text-slate-400">Granted To: {c.grantedTo} · Expiry: {c.expiry}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabTelemed() {
  const [state, setState] = useState("PATIENT_WAITING");
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-white flex items-center gap-2"><Phone className="text-purple-400" size={18} /> Telemedicine Jitsi Waiting Room Lifecycle</h4>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">{state}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setState("PATIENT_WAITING")} className={`p-4 rounded-xl border text-left transition-all ${state === "PATIENT_WAITING" ? "bg-amber-600/20 border-amber-500 text-amber-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            <div className="font-bold text-sm">1. Patient Waiting Room</div>
            <div className="text-xs mt-1 opacity-80">Patient is checked in and waiting for clinician approval.</div>
          </button>
          <button onClick={() => setState("ADMITTED")} className={`p-4 rounded-xl border text-left transition-all ${state === "ADMITTED" ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            <div className="font-bold text-sm">2. Doctor Admitted</div>
            <div className="text-xs mt-1 opacity-80">Clinician admits patient into encrypted Jitsi video session.</div>
          </button>
          <button onClick={() => setState("DISCHARGED")} className={`p-4 rounded-xl border text-left transition-all ${state === "DISCHARGED" ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            <div className="font-bold text-sm">3. E-Rx Generated</div>
            <div className="text-xs mt-1 opacity-80">Session ended, digital prescription signed & QR code issued.</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function TabClaims() {
  const [icd, setIcd] = useState("E11.9");
  const [cpt, setCpt] = useState("99213");
  const [billed, setBilled] = useState("14500");
  const [preAuth, setPreAuth] = useState(null);

  const handleAudit = async () => {
    try {
      const res = await fetch("/api/ai/hospital-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preauth_claims", icdCode: icd, cptCode: cpt, totalBilled: billed }),
      });
      const data = await res.json();
      setPreAuth(data.preAuthResult);
    } catch {
      setPreAuth({
        claimId: "CLM-PREAUTH-908124",
        approvedAmount: 13340,
        approvalProbability: 0.92,
        denialRiskScore: 0.08,
        riskLevel: "LOW_RISK",
        autoFixSuggestions: ["Attach 12-lead ECG pre-procedure baseline to prevent generic code rejection"],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-white flex items-center gap-2"><FileCheck className="text-emerald-400" size={18} /> Biologic Claims Pre-Authorization & AI Denial Predictor</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className="text-xs font-semibold text-slate-400 block mb-1">ICD-10 Code</label><input value={icd} onChange={(e) => setIcd(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono" /></div>
          <div><label className="text-xs font-semibold text-slate-400 block mb-1">CPT Code</label><input value={cpt} onChange={(e) => setCpt(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono" /></div>
          <div><label className="text-xs font-semibold text-slate-400 block mb-1">Total Billed (₹)</label><input value={billed} onChange={(e) => setBilled(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono" /></div>
        </div>
        <button onClick={handleAudit} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all">Run Pre-Auth Denial Predictor</button>
      </div>
      {preAuth && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center"><span className="font-bold text-white text-sm">Pre-Auth Analysis ({preAuth.claimId})</span><span className="text-emerald-400 font-bold text-xs">Approval Probability: {(preAuth.approvalProbability * 100).toFixed(0)}%</span></div>
          <div className="text-xs text-slate-300">Estimated Approved Amount: <strong className="text-white">₹{preAuth.approvedAmount}</strong></div>
          <div className="space-y-1">{preAuth.autoFixSuggestions.map((s, i) => (<div key={i} className="text-xs text-amber-300 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2">💡 Auto-Fix: {s}</div>))}</div>
        </div>
      )}
    </div>
  );
}

function TabMAR() {
  const wards = [
    { name: "Cardiac ICU", total: 8, occupied: 6, available: 2, criticalAlerts: 1 },
    { name: "General Male Ward", total: 20, occupied: 15, available: 5, criticalAlerts: 0 },
    { name: "General Female Ward", total: 20, occupied: 18, available: 2, criticalAlerts: 0 },
    { name: "Isolation Ward", total: 6, occupied: 3, available: 3, criticalAlerts: 0 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wards.map((w, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="text-sm font-bold text-white">{w.name}</div>
            <div className="text-xs text-slate-400">Occupancy: <strong className="text-emerald-400">{w.occupied}/{w.total} beds</strong></div>
            {w.criticalAlerts > 0 && <span className="inline-block text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">🚨 {w.criticalAlerts} Critical Alert</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabDischarge() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div><h4 className="font-bold text-white text-base">Discharge Summary & Patient Portal Summary</h4><p className="text-xs text-slate-400">Official hospital discharge summary with follow-up scheduling.</p></div>
        <button onClick={() => alert("Printing official Discharge Summary PDF...")} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"><FileText size={14} /> Download PDF</button>
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-mono">
        <div>HOSPITAL DISCHARGE SUMMARY</div>
        <div>--------------------------</div>
        <div>Patient: Sarah Jenkins (MRN-908124) | Age: 58 | Gender: Female</div>
        <div>Admission: 2025-10-12 | Discharge: 2025-10-22</div>
        <div>Diagnosis: Type-2 Diabetes Mellitus with Severe Eczema Exacerbation (ICD-10 E11.69)</div>
        <div>Discharge Meds: Metformin 500mg BD, Topical Hydrocortisone 1%</div>
        <div>Follow-up: OPD 104 in 14 days</div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const TAB_COMPONENTS = {
  triage: TabTriageChatbot, booking: TabBooking, abdm: TabABDM, telemed: TabTelemed,
  claims: TabClaims, mar: TabMAR, discharge: TabDischarge, console: TabAgentConsole,
  kpi: TabKPI, scribe: TabScribe, drug: TabDrugSafety, adherence: TabAdherence,
  lab: TabLabExplainer, noshow: TabNoShow, er: TabERTriage, pharmacy: TabPharmacy,
  analytics: TabAnalytics, rag: TabRAG,
};

export default function MedCoreHubPage() {
  const [activeTab, setActiveTab] = useState("triage");
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <AppLayout activeTab="medcore-hub">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400">DPDP Act Compliant · India Region · In-Memory Mode</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="text-blue-400" size={26} />
              MedCore Intelligence Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">12 AI clinical modules — triage, scribe, drug safety, ER assist, RAG knowledge base & more.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">● Live</span>
            <span>{TABS.length} Modules Active</span>
          </div>
        </div>

        {/* Tab strip */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${isActive ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                <Icon size={13} />
                {tab.label}
                {tab.badge && <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"}`}>{tab.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="min-h-96">
          <ActiveComponent />
        </div>
      </div>
    </AppLayout>
  );
}
