import { API_BASE_URL, getHeaders } from "./api.config";

export const getWorkersWithPermissions = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/permissions`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch permissions");
  return response.json();
};

export const createWorker = async (token: string, data: {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role?: string;
  departmentId?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/permissions/workers`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to create worker");
  }
  return response.json();
};

export const assignPermission = async (token: string, data: {
  userId: string;
  viewReports: boolean;
  enterData: boolean;
  admin: boolean;
}) => {
  const response = await fetch(`${API_BASE_URL}/permissions/assign`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to assign permissions");
  }
  return response.json();
};