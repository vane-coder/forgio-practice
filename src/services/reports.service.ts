import { API_BASE_URL, getHeaders } from "./api.config";

export const generateReport = async (token: string, data: {
  startDate: string;
  endDate: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to generate report");
  return response.json();
};

export const getReports = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch reports");
  return response.json();
};