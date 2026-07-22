import { API_BASE_URL, getHeaders } from "./api.config";

export const getBranches = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/branches`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch branches");
  return response.json();
};

export const createBranch = async (token: string, data: { name: string; location?: string }) => {
  const response = await fetch(`${API_BASE_URL}/branches`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create branch");
  return response.json();
};