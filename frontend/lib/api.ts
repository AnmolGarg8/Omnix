export const BACKEND_URL = "/api/proxy";
 // SECURE TUNNEL BEYOND CORS

async function request(path: string, options: any = {}) {
  const token = options.token;

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
export const createMission = (payload: any, token?: string) => 
  request("/api/missions/", { method: "POST", body: JSON.stringify(payload), token });

export const getMissions = (token?: string) => 
  request("/api/missions/", { token });

export const getMission = (id: string, token?: string) => 
  request(`/api/missions/${id}`, { token });

export const runMissionNow = (id: string, token?: string) => 
  request(`/api/missions/${id}/run-now`, { method: "POST", token });

// Results
export const getResults = (missionId: string, page: number, token?: string) => 
  request(`/api/results/${missionId}?page=${page}`, { token });

export const getTrend = (missionId: string, range: string, token?: string) => 
  request(`/api/results/${missionId}/trend?range=${range}`, { token });

export const getLatestResult = (missionId: string, token?: string) => 
  request(`/api/results/${missionId}/latest`, { token });

// Settings
export const getSettings = (token?: string) => 
  request("/api/settings/", { token });

export const updateSettings = (payload: any, token?: string) => 
  request("/api/settings/", { method: "PUT", body: JSON.stringify(payload), token });

// Alerts
export const getAlerts = (token?: string) => 
  request("/api/alerts/", { token });

export const acknowledgeAlert = (id: string, token?: string) => 
  request(`/api/alerts/${id}/acknowledge`, { method: "PATCH", token });

