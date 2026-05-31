import { API_BASE_URL, getHeaders } from "./api.config";

// Fetches AI suggestions for the manager's dashboard
export const getAISuggestions = async (token: string, factoryId: number) => {
  const response = await fetch(`${API_BASE_URL}/ai/suggestions/${factoryId}`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch AI suggestions");
  return response.json();
};

// Manually request a fresh AI insight
export const requestFreshInsight = async (token: string, factoryId: number) => {
  const response = await fetch(`${API_BASE_URL}/ai/refresh/${factoryId}`, {
    method: "POST",
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to refresh AI insight");
  return response.json();
};
