/**
 * HelixMed AI - Model Inference API Service
 * Connects to Python inference server for real-time predictions
 */

const API_BASE_URL = 'http://localhost:5000';

class AIModelsAPI {
  /**
   * Check if inference server is healthy
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'offline', error: error.message };
    }
  }

  /**
   * Get list of available models
   */
  async listModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/models`);
      return await response.json();
    } catch (error) {
      console.error('Failed to list models:', error);
      throw error;
    }
  }

  /**
   * Model 1: Trial Matching Prediction
   * @param {Array<number>} features - Patient features (13 values from UCI Heart dataset)
   */
  async predictTrialMatching(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/trial_matching`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Trial matching prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 2: Early Warning Prediction
   * @param {Array<number>} features - Vital signs (11 values: HR, BP sys/dia, O2, RR, temp, GCS, NEWS, prior AE, HR trend, O2 trend)
   */
  async predictEarlyWarning(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/early_warning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Early warning prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 3: Diabetes Risk Prediction
   * @param {Object} features - { Pregnancies, Glucose, BP, SkinThickness, Insulin, BMI, DPF, Age }
   */
  async predictDiabetesRisk(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/diabetes_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Diabetes risk prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 4: Mortality Risk Prediction
   * @param {Object} features - Charlson/SEER features (19 values including age, charlson_index, etc.)
   */
  async predictMortalityRisk(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/mortality_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Mortality risk prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 5: Digital Twin Trajectory Prediction
   * @param {Object} features - NHANES features (14 values including age, BMI, HbA1c, etc.)
   */
  async predictDigitalTwin(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/digital_twin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Digital twin prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 8: Protocol Risk Prediction
   * @param {Object} features - Protocol features (18 values including num_visits, burden_score, etc.)
   */
  async predictProtocolRisk(features) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/protocol_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });
      return await response.json();
    } catch (error) {
      console.error('Protocol risk prediction failed:', error);
      throw error;
    }
  }

  /**
   * Model 7: Get SHAP Explanations
   */
  async getSHAPExplanation() {
    try {
      const response = await fetch(`${API_BASE_URL}/explain/shap`);
      return await response.json();
    } catch (error) {
      console.error('SHAP explanation failed:', error);
      throw error;
    }
  }

  /**
   * Model 6: Get Federated Learning Info
   */
  async getFederatedInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/federated/info`);
      return await response.json();
    } catch (error) {
      console.error('Federated info failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiModelsAPI = new AIModelsAPI();
export default aiModelsAPI;
