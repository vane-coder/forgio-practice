import { API_BASE_URL, getHeaders } from "./api.config";
import { Machine } from "../types";

export const getMachines = async (token: string): Promise<Machine[]> => {
  const response = await fetch(`${API_BASE_URL}/machines`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch machines");
  return response.json();
};

export const reportBreakdown = async (token: string, data: { machineId: string; cause: string }) => {
  const response = await fetch(`${API_BASE_URL}/breakdowns`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to report breakdown");
  return response.json();
};