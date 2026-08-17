/**
 * Local mock for the create.xyz /integrations/chat-gpt/conversationgpt4 endpoint.
 * The Voice Reporter and Multilingual pages use this route for clinical NLP extraction.
 * Returns an OpenAI-compatible chat completion JSON response.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body?.messages ?? [];

    // Get the user message (last message with role=user)
    const userMsg = [...messages].reverse().find((m) => m.role === "user");
    const text = userMsg?.content ?? "";
    const textLower = text.toLowerCase();

    // --- Symptom extraction ---
    const symptomMap = [
      { keywords: ["headache", "head pain", "migraine"], symptom: "Headache" },
      { keywords: ["nausea", "vomit", "queasy", "sick to my stomach"], symptom: "Nausea" },
      { keywords: ["rash", "itching", "itch", "skin irritation"], symptom: "Skin rash / pruritus" },
      { keywords: ["chest pain", "chest tightness", "chest pressure"], symptom: "Chest pain" },
      { keywords: ["fatigue", "tired", "exhausted", "weakness", "weak"], symptom: "Fatigue / weakness" },
      { keywords: ["dizziness", "dizzy", "vertigo", "lightheaded"], symptom: "Dizziness / vertigo" },
      { keywords: ["fever", "temperature", "hot", "chills", "sweating"], symptom: "Fever" },
      { keywords: ["swelling", "swollen", "edema", "puffy"], symptom: "Edema / swelling" },
      { keywords: ["shortness", "breath", "breathing", "dyspnea", "can't breathe"], symptom: "Shortness of breath" },
      { keywords: ["pain", "ache", "aching", "sore", "hurt"], symptom: "General pain" },
    ];

    let symptom = "Unspecified adverse event";
    for (const entry of symptomMap) {
      if (entry.keywords.some((k) => textLower.includes(k))) {
        symptom = entry.symptom;
        break;
      }
    }

    // --- Severity detection ---
    let severity = "Medium";
    if (
      textLower.includes("severe") ||
      textLower.includes("unbearable") ||
      textLower.includes("worst") ||
      textLower.includes("extreme") ||
      /\b(9|10)\s+out\s+of\s+10\b/.test(textLower) ||
      textLower.includes("emergency") ||
      textLower.includes("intense")
    ) {
      severity = "High";
    } else if (
      textLower.includes("mild") ||
      textLower.includes("slight") ||
      textLower.includes("minor") ||
      textLower.includes("little") ||
      /\b[1-3]\s+out\s+of\s+10\b/.test(textLower)
    ) {
      severity = "Low";
    }

    // --- Duration extraction ---
    let duration = "Unknown";
    const durationPatterns = [
      { regex: /(\d+)\s*day[s]?/i, suffix: "day(s)" },
      { regex: /(\d+)\s*hour[s]?/i, suffix: "hour(s)" },
      { regex: /(\d+)\s*week[s]?/i, suffix: "week(s)" },
      { regex: /(\d+)\s*month[s]?/i, suffix: "month(s)" },
    ];
    for (const { regex, suffix } of durationPatterns) {
      const match = text.match(regex);
      if (match) {
        duration = `${match[1]} ${suffix}`;
        break;
      }
    }

    // --- Onset detection ---
    let onset = "Not specified";
    if (textLower.includes("today") || textLower.includes("this morning") || textLower.includes("this evening")) {
      onset = "Today";
    } else if (textLower.includes("yesterday")) {
      onset = "Yesterday";
    } else if (textLower.includes("last week") || textLower.includes("a week ago")) {
      onset = "Last week";
    } else if (textLower.includes("sudden") || textLower.includes("suddenly") || textLower.includes("abrupt")) {
      onset = "Sudden onset";
    } else if (textLower.includes("gradual") || textLower.includes("slowly") || textLower.includes("over time")) {
      onset = "Gradual onset";
    } else if (duration !== "Unknown") {
      onset = `Approximately ${duration} ago`;
    }

    // --- Suggested action based on severity ---
    const actionMap = {
      High: "Immediate clinical review recommended. Escalate to the principal investigator and notify the safety monitoring board. Consider protocol deviation reporting per ICH E6(R3) guidelines.",
      Medium: "Schedule a follow-up assessment within 24–48 hours. Document in eCRF and monitor for progression. Standard adverse event reporting protocol applies.",
      Low: "Log in the patient diary. Monitor and report at the next scheduled visit. No immediate intervention required unless symptoms worsen.",
    };
    const suggestedAction = actionMap[severity];

    const extractedData = { symptom, severity, duration, onset, suggestedAction };

    return new Response(
      JSON.stringify({
        id: "chatcmpl-local-" + Date.now(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: JSON.stringify(extractedData),
            },
            finish_reason: "stop",
          },
        ],
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "NLP extraction error: " + err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
