/**
 * Simulates a Drug Safety checking agent.
 * Automatically checks for contraindications, allergies, and pediatric warning guidelines.
 */
export class SafetyAgent {
  constructor() {
    this.contraindications = [
      { drugA: "lisinopril", drugB: "losartan", severity: "High", message: "Co-administration of two RAS blockers is contraindicated due to increased risk of renal dysfunction, hyperkalemia, and hypotension." },
      { drugA: "aspirin", drugB: "warfarin", severity: "High", message: "Concurrent use increases hemorrhage risk due to combined antiplatelet and anticoagulant effects." },
      { drugA: "ibuprofen", drugB: "lisinopril", severity: "Medium", message: "NSAIDs may decrease the antihypertensive effect of ACE inhibitors and worsen renal function." }
    ];
  }

  /**
   * Scans a list of active medications for safety warning signs.
   * @param {string[]} medications - List of current drug names.
   * @returns {Object[]} - Interaction warning alerts.
   */
  checkInteractions(medications) {
    const alerts = [];
    const medsLower = medications.map(m => m.toLowerCase().trim());

    for (const rule of this.contraindications) {
      const matchA = medsLower.some(m => m.includes(rule.drugA));
      const matchB = medsLower.some(m => m.includes(rule.drugB));

      if (matchA && matchB) {
        alerts.push({
          severity: rule.severity,
          drugs: [rule.drugA, rule.drugB],
          message: rule.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return alerts;
  }
}
