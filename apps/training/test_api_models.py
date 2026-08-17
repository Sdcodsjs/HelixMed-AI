import unittest
import json
import sys
import os

# Add apps/training to import path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from inference_server import app, load_models

class TestClinicalNexusAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        load_models()
        cls.client = app.test_client()

    def test_health_check(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("status"), "healthy")

    def test_diabetes_predict(self):
        payload = {"features": {"Glucose": 140, "BMI": 30, "Age": 45}}
        response = self.client.post('/predict/diabetes_risk', data=json.dumps(payload), content_type='application/json')
        self.assertIn(response.status_code, [200, 503])

    def test_liver_predict(self):
        payload = {"features": {"Bilirubin": 2.5, "ALT": 60}}
        response = self.client.post('/predict/liver_risk', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("organ"), "Liver (ILPD)")

    def test_kidney_predict(self):
        payload = {"features": {"Creatinine": 1.5, "GFR": 60}}
        response = self.client.post('/predict/kidney_risk', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("organ"), "Kidney (UCI CKD)")

    def test_lung_predict(self):
        payload = {"features": {"FEV1": 70, "PackYears": 15}}
        response = self.client.post('/predict/lung_risk', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data.get("organ"), "Lungs (NHANES/SEER)")

if __name__ == '__main__':
    unittest.main()
