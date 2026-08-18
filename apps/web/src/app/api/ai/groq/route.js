// Groq API route — OpenAI-compatible, free tier
// Used as a real LLM backend for the MedCore Hub Triage Chatbot and RAG Copilot.
// Model: llama-3.1-8b-instant (fast, free tier, 6000 req/day)
// Fallback: deterministic response if GROQ_API_KEY is not set.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

// Clinical system prompt for the MedCore triage + copilot
const SYSTEM_PROMPT = `You are MedCore Clinical AI — an expert AI assistant for hospital triage, clinical research, and drug safety.

You are powered by Llama 3.1 via Groq (fast inference, free tier).

Your capabilities:
- AI Triage: Assess patient symptoms, detect red flags (cardiac, stroke, respiratory, bleeding, suicidal), match to medical specialty using SNOMED-CT concepts.
- RAG Copilot: Answer questions about clinical trials, AI model performance, patient risk scores, drug interactions, and PubMed literature.
- Drug Safety: Identify dangerous drug combinations from a curated list of 15 high-risk pairs.
- SOAP Notes: Help generate structured clinical documentation.

Important rules:
- Always recommend emergency services (call 112) for life-threatening symptoms.
- Never diagnose — say "this may suggest" or "consult a clinician".
- Keep responses concise, clinically relevant, and structured.
- Use markdown headers and bullet points for clarity.
- For drug interactions, always mention severity: CONTRAINDICATED / SEVERE / MODERATE / MILD.`;

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const mode = body.mode || "general"; // "triage" | "copilot" | "drug" | "general"
    const userQuery = messages[messages.length - 1]?.content || "";

    if (!userQuery.trim()) {
      return new Response(JSON.stringify({ error: "Empty query" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqKey = process.env.GROQ_API_KEY;

    // ── No API key: intelligent deterministic fallback ──────────────────────
    if (!groqKey) {
      const fallback = buildFallback(userQuery, mode);
      return new Response(
        JSON.stringify({
          provider: "fallback-deterministic",
          model: "rule-engine",
          latencyMs: Date.now() - startTime,
          choices: [{ message: { role: "assistant", content: fallback }, finish_reason: "stop" }],
          note: "Set GROQ_API_KEY env var for live Llama 3.1 responses via Groq.",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Live Groq API call ──────────────────────────────────────────────────
    const modePrompt = {
      triage:  "Focus on: symptom triage, red-flag detection, and specialty routing. Respond conversationally.",
      copilot: "Focus on: clinical trials, AI model metrics, patient risk scores, PubMed literature. Use markdown.",
      drug:    "Focus on: drug interaction severity, mechanism, and alternatives. Always state severity first.",
      general: "Respond helpfully and clinically.",
    }[mode] || "";

    const groqBody = {
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 512,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nMode: ${modePrompt}` },
        ...messages.slice(-8), // last 8 turns for context
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify(groqBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "unknown error");
      console.error("[groq/route] Groq API error:", groqRes.status, errText);
      // Fallback on Groq error
      const fallback = buildFallback(userQuery, mode);
      return new Response(
        JSON.stringify({
          provider: "fallback-deterministic",
          model: "rule-engine",
          latencyMs: Date.now() - startTime,
          groqError: `HTTP ${groqRes.status}`,
          choices: [{ message: { role: "assistant", content: fallback }, finish_reason: "stop" }],
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const groqData = await groqRes.json();
    const latencyMs = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        provider: "groq",
        model: GROQ_MODEL,
        latencyMs,
        usage: groqData.usage,
        choices: groqData.choices,
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    const userQuery = "";
    const fallback = "I'm currently unable to process your request. Please try again or describe your symptoms to a healthcare professional.";
    return new Response(
      JSON.stringify({
        provider: "fallback-error",
        model: "rule-engine",
        latencyMs: 0,
        choices: [{ message: { role: "assistant", content: fallback }, finish_reason: "stop" }],
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

// ─── Deterministic fallback (no API key needed) ────────────────────────────
function buildFallback(query, mode) {
  const q = query.toLowerCase();

  // Red flags
  const redFlags = { cardiac:["chest pain","heart attack","mi ","angina"], stroke:["stroke","facial droop","slurred speech"], respiratory:["can't breathe","cannot breathe","choking"], bleeding:["heavy bleeding","hemorrhage","vomiting blood"], suicidal:["kill myself","want to die","suicidal"] };
  for (const [cat, phrases] of Object.entries(redFlags)) {
    if (phrases.some(p => q.includes(p))) {
      return `## 🚨 Emergency — ${cat.toUpperCase()} Red Flag Detected\n\n**Call 112 immediately or go to your nearest Emergency Department.**\n\nThis symptom pattern (${cat}) requires immediate medical evaluation. Do not wait.\n\n*MedCore AI has escalated this to emergency triage protocol.*`;
    }
  }

  // Triage mode
  if (mode === "triage") {
    if (q.includes("fever") || q.includes("temperature")) return "## 🌡️ Symptom Assessment: Fever\n\n- **Possible specialty:** General Medicine / Infectious Disease\n- **Priority:** Moderate\n- **Next step:** Check duration and associated symptoms (chills, rash, throat pain).\n- If fever >39°C or persists >3 days, consult a doctor promptly.";
    if (q.includes("headache")) return "## 🧠 Symptom Assessment: Headache\n\n- **Possible specialty:** Neurology / General Medicine\n- **Priority:** Low-Moderate\n- If sudden, severe ('thunderclap'), or with neck stiffness — seek emergency care immediately.\n- Otherwise: rest, hydration, and paracetamol may help.";
    if (q.includes("cough")) return "## 🫁 Symptom Assessment: Cough\n\n- **Possible specialty:** Pulmonology / General Medicine\n- **Priority:** Low\n- Duration and character matter: productive vs. dry, associated breathlessness.\n- If coughing blood or severe breathlessness — seek emergency care.";
    return `## 🏥 Triage Assessment\n\nThank you for describing your symptom: **"${query}"**.\n\n- **Recommended specialty:** General Medicine (initial consultation)\n- **Priority:** To be assessed on examination\n\nPlease describe any additional symptoms (pain location, duration, severity 1-10) for a more precise specialty match.`;
  }

  // Drug safety mode
  if (mode === "drug") {
    if (q.includes("warfarin") && (q.includes("ibuprofen") || q.includes("nsaid"))) return "## ⚠️ CONTRAINDICATED: Warfarin + NSAIDs\n\nDrastic increase in GI bleeding risk. NSAIDs inhibit platelet function and damage gastric mucosa.\n\n**Alternative:** Paracetamol (Acetaminophen) for pain relief.";
    if (q.includes("ssri") && q.includes("maoi")) return "## ❌ CONTRAINDICATED: SSRI + MAOI\n\nSerotonin syndrome risk — potentially fatal. 14-day washout required between drug classes.";
    return `## 🔍 Drug Safety Check\n\nNo high-risk interaction found in the curated deterministic ruleset for **"${query}"**.\n\n*Set GROQ_API_KEY for Llama 3.1-powered comprehensive drug interaction analysis.*`;
  }

  // Copilot / RAG mode
  if (mode === "copilot") {
    if (q.includes("high-risk") || q.includes("patient")) return "## 🚨 High-Risk Patient Cohort\n\n- **Sarah Jenkins** (58) — Risk: 88% | Type-2 Diabetes & Hypertension | ICU-Bay-A\n- **Robert Chen** (64) — Risk: 79% | Refractory B-Cell Lymphoma | Oncology-3B\n- **Elena Rostova** (52) — Risk: 74% | Cardiovascular Ischemia | Cardiology-2A\n\n*Set GROQ_API_KEY to enable live Llama 3.1 clinical analysis.*";
    if (q.includes("trial") || q.includes("nct")) return "## 📋 Active Clinical Trials\n\n- **NCT001** — CAR-T Cell Therapy Phase II (142/200 enrolled)\n- **NCT002** — SGLT2 Renal Protection Study (320/400 enrolled)\n- **NCT003** — mRNA Immunotherapy Protocol (85/150 enrolled)\n\n*Set GROQ_API_KEY for detailed trial analysis.*";
    return "## 🤖 MedCore RAG Copilot\n\nI'm running in offline mode. Set `GROQ_API_KEY` in your `.env` for live Llama 3.1 responses.\n\nYou can ask me about:\n- High-risk patients\n- Clinical trials\n- AI model performance\n- Drug interactions";
  }

  return `## MedCore AI Response\n\nI understand you're asking about: **"${query}"**\n\nFor live AI responses powered by Llama 3.1 (free via Groq), add your `GROQ_API_KEY` to the environment.\n\nSign up free at: https://console.groq.com`;
}
