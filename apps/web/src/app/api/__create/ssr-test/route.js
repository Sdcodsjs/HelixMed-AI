// SSR test route — safe stub for offline development
export async function GET(request) {
  return Response.json({ 
    status: "ok", 
    message: "HelixMed AI SSR test endpoint",
    timestamp: new Date().toISOString()
  });
}
