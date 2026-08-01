import { API_BASE_URL, getHeaders } from "./api.config";
import { RawMaterial } from "../types";

export const getMaterials = async (token: string): Promise<RawMaterial[]> => {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch materials");
  return response.json();
};

export const addMaterial = async (token: string, data: Partial<RawMaterial>) => {
  const response = await fetch(`${API_BASE_URL}/materials`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to add material");
  return response.json();
};

export const updateMaterial = async (token: string, id: string, data: Partial<RawMaterial>) => {
  const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update material");
  return response.json();
};

/** Worker-facing: record consumption of a material (deducts stock). */
export const consumeMaterial = async (token: string, id: string, quantity: number) => {
  const response = await fetch(`${API_BASE_URL}/materials/${id}/consume`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error("Failed to record material usage");
  return response.json();
};