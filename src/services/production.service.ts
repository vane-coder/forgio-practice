import { API_BASE_URL, getHeaders } from "./api.config";
import { ProductionEntry } from "../types";

export const submitProduction = async (token: string, data: Partial<ProductionEntry>) => {
  const response = await fetch(`${API_BASE_URL}/production`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit production entry");
  return response.json();
};

export const getProductionByFactory = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/production/factory`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch production records");
  return response.json();
};

/** A worker's own production entries — no manager/dept-head role required. */
export const getMyProduction = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/production/me`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch your production records");
  return response.json();
};

