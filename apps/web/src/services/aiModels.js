/**
 * HelixMed AI - Model Inference API Service
 * Connects to Python inference server for real-time predictions
 */

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_PYTHON_INFERENCE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PYTHON_INFERENCE_URL) ||
  'http://localhost:5000';

class AIModelsAPI {
  /**
   * Check if inference server is healthy
   */
  async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      return { status: 'offline', error: 'HTTP ' + response.status };
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }

  /**
   * Get list of available models
   */
  async listModels() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${API_BASE_URL}/models`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Failed to list models from server, using fallback:', error.message);
      return {
        models: [
          { id: 1, name: "Trial Matching (UCI Heart)" },
          { id: 2, name: "Early Warning (MIMIC-III)" },
          { id: 3, name: "Diabetes Risk (Pima Ensemble)" },
          { id: 4, name: "Mortality Risk (LightGBM)" },
          { id: 5, name: "Digital Twin (NHANES MLP)" },
          { id: 6, name: "Federated Learning Engine" },
          { id: 7, name: "SHAP Explainable AI" },
          { id: 8, name: "Protocol Risk Model" }
        ]
      };
    }
  }

  /**
   * Model 1: Trial Matching Prediction
   */
  async predictTrialMatching(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/trial_matching`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Trial matching prediction server offline, returning fallback:', error.message);
      const age = Array.isArray(features) ? features[0] : 50;
      const sbp = Array.isArray(features) ? features[3] : 120;
      const eligibleProb = Math.min(0.95, Math.max(0.2, 0.9 - (sbp - 120) * 0.005 - (age > 60 ? 0.1 : 0)));
      return {
        prediction: eligibleProb > 0.5 ? 1 : 0,
        probability: { eligible: eligibleProb, ineligible: 1 - eligibleProb },
        risk_level: eligibleProb > 0.7 ? "High Match" : "Medium Match",
        fallback: true
      };
    }
  }

  /**
   * Model 2: Early Warning Prediction
   */
  async predictEarlyWarning(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/early_warning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Early warning prediction server offline, returning fallback:', error.message);
      const hr = Array.isArray(features) ? features[0] : 75;
      const o2 = Array.isArray(features) ? features[3] : 98;
      const isAnomaly = o2 < 94 || hr > 100;
      return {
        prediction: isAnomaly ? 1 : 0,
        anomaly_detected: isAnomaly,
        probability: isAnomaly ? 0.82 : 0.15,
        risk_level: isAnomaly ? "High" : "Low",
        fallback: true
      };
    }
  }

  /**
   * Model 3: Diabetes Risk Prediction
   */
  async predictDiabetesRisk(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/diabetes_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Diabetes risk prediction server offline, returning fallback:', error.message);
      const glucose = typeof features === 'object' ? features.Glucose || 100 : 100;
      const bmi = typeof features === 'object' ? features.BMI || 25 : 25;
      const risk = Math.min(0.98, Math.max(0.05, (glucose - 70) / 150 * 0.6 + (bmi - 18) / 30 * 0.4));
      return {
        prediction: risk > 0.5 ? 1 : 0,
        probability: { diabetic: risk, non_diabetic: 1 - risk },
        risk_level: risk > 0.7 ? "High" : risk > 0.4 ? "Medium" : "Low",
        fallback: true
      };
    }
  }

  /**
   * Model 4: Mortality Risk Prediction
   */
  async predictMortalityRisk(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/mortality_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Mortality risk prediction server offline, returning fallback:', error.message);
      return {
        prediction: 0,
        probability: { high_risk: 0.22, low_risk: 0.78 },
        risk_level: "Low",
        fallback: true
      };
    }
  }

  /**
   * Model 5: Digital Twin Trajectory Prediction
   */
  async predictDigitalTwin(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/digital_twin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Digital twin prediction server offline, returning fallback:', error.message);
      return {
        trajectory_score: 0.84,
        health_outlook: "Stable Trajectory",
        confidence: 0.91,
        fallback: true
      };
    }
  }

  /**
   * Model 8: Protocol Risk Prediction
   */
  async predictProtocolRisk(features) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/predict/protocol_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.warn('Protocol risk prediction server offline, returning fallback:', error.message);
      return {
        prediction: 0,
        probability: { high_risk: 0.18, low_risk: 0.82 },
        risk_level: "Low",
        fallback: true
      };
    }
  }

  /**
   * Model 7: Get SHAP Explanations
   */
  async getSHAPExplanation() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/explain/shap`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      return {
        top_features: [
          { feature: "Glucose", impact: "+0.32" },
          { feature: "Age", impact: "+0.18" },
          { feature: "eGFR", impact: "-0.15" }
        ],
        fallback: true
      };
    }
  }

  /**
   * Model 6: Get Federated Learning Info
   */
  async getFederatedInfo() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/federated/info`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      return {
        num_nodes: 3,
        global_rounds: 50,
        status: "Active",
        fallback: true
      };
    }
  }
}

// Export singleton instance
export const aiModelsAPI = new AIModelsAPI();
export default aiModelsAPI;

