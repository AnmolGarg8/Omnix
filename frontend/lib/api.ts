const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function request(path: string, options: any = {}) {
  const token = "test_token"; // Placeholder for manual test. In reality use getToken() from Clerk

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

// Missions
export const createMission = (payload: any) => 
  request("/api/missions/", { method: "POST", body: JSON.stringify(payload) });

export const getMissions = () => 
  request("/api/missions/");

export const getMission = (id: string) => 
  request(`/api/missions/${id}`);

export const runMissionNow = (id: string) => 
  request(`/api/missions/${id}/run-now`, { method: "POST" });

// Results
export const getResults = (missionId: string, page: number) => 
  request(`/api/results/${missionId}?page=${page}`);

export const getTrend = (missionId: string, range: string) => 
  request(`/api/results/${missionId}/trend?range=${range}`);

// Settings
export const getSettings = () => 
  request("/api/settings/");

export const updateSettings = (payload: any) => 
  request("/api/settings/", { method: "PUT", body: JSON.stringify(payload) });

// Alerts
export const getAlerts = () => 
  request("/api/alerts/");

export const acknowledgeAlert = (id: string) => 
  request(`/api/alerts/${id}/acknowledge`, { method: "PATCH" });
