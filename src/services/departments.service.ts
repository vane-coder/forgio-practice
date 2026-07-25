import { API_BASE_URL, getHeaders } from "./api.config";

export const getDepartments = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/departments`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch departments");
  return response.json();
};

export const createDepartment = async (token: string, data: { name: string }) => {
  const response = await fetch(`${API_BASE_URL}/departments`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create department");
  return response.json();
};
