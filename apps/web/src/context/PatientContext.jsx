import React, { createContext, useContext, useState } from 'react';

export const PATIENTS = [
  {
    id: "PT-9042",
    name: "Sarah Jenkins",
    mrn: "MRN-908124",
    age: 58,
    gender: "Female",
    department: "ICU Telemetry",
    condition: "Type-2 Diabetes & Severe Eczema",
    vitalStatus: "WARNING",
    heartRate: "118 bpm",
    bp: "142/92 mmHg",
    spO2: "93%",
    glucose: "185 mg/dL",
    riskScore: 88,
    digitalTwinScore: 0.74,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "PT-4412",
    name: "Robert Chen",
    mrn: "MRN-441209",
    age: 64,
    gender: "Male",
    department: "Oncology",
    condition: "Refractory B-Cell Lymphoma",
    vitalStatus: "STABLE",
    heartRate: "72 bpm",
    bp: "124/80 mmHg",
    spO2: "98%",
    glucose: "105 mg/dL",
    riskScore: 79,
    digitalTwinScore: 0.62,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "PT-7721",
    name: "Elena Rostova",
    mrn: "MRN-772188",
    age: 52,
    gender: "Female",
    department: "Cardiology",
    condition: "Cardiovascular Ischemia",
    vitalStatus: "STABLE",
    heartRate: "68 bpm",
    bp: "118/76 mmHg",
    spO2: "99%",
    glucose: "98 mg/dL",
    riskScore: 74,
    digitalTwinScore: 0.85,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "PT-3301",
    name: "Marcus Vance",
    mrn: "MRN-330192",
    age: 45,
    gender: "Male",
    department: "Endocrinology",
    condition: "Early Stage T2D & Hypertension",
    vitalStatus: "STABLE",
    heartRate: "78 bpm",
    bp: "130/84 mmHg",
    spO2: "97%",
    glucose: "142 mg/dL",
    riskScore: 42,
    digitalTwinScore: 0.91,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  }
];

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [activePatient, setActivePatient] = useState(PATIENTS[0]);

  const selectPatientById = (id) => {
    const found = PATIENTS.find((p) => p.id === id || p.mrn === id);
    if (found) {
      setActivePatient(found);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        activePatient,
        setActivePatient,
        patients: PATIENTS,
        selectPatientById,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    // Return fallback state if not wrapped yet
    return {
      activePatient: PATIENTS[0],
      setActivePatient: () => {},
      patients: PATIENTS,
      selectPatientById: () => {},
    };
  }
  return context;
}
