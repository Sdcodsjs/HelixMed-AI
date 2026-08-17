export async function POST(request) {
  try {
    const { patientId = 1 } = await request.json();

    const fhirResourceBundle = {
      resourceType: "Bundle",
      type: "collection",
      id: "fhir-bundle-" + Date.now(),
      entry: [
        {
          resource: {
            resourceType: "Patient",
            id: "PAT-0091",
            name: [{ family: "Jenkins", given: ["Sarah"] }],
            gender: "female",
            birthDate: "1978-04-18",
          },
        },
        {
          resource: {
            resourceType: "Condition",
            id: "COND-01",
            code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "E11.9", display: "Type 2 Diabetes Mellitus" }] },
            clinicalStatus: "active",
          },
        },
        {
          resource: {
            resourceType: "Observation",
            id: "OBS-01",
            code: { coding: [{ system: "http://loinc.org", code: "2339-0", display: "Glucose [Mass/volume] in Blood" }] },
            valueQuantity: { value: 185, unit: "mg/dL" },
            status: "final",
          },
        },
      ],
    };

    const langGraphState = {
      currentCycle: 3,
      stateTransition: "Observation -> RiskAssessment -> TreatmentProposal",
      agentDecision: "Prescribe Low-Glycemic Protocol A & Instacart Nutritional Plan",
    };

    return new Response(
      JSON.stringify({
        status: "SUCCESS",
        fhirResourceBundle,
        langGraphState,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "FHIR Agent Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
