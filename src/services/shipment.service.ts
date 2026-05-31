import { API_BASE_URL, getHeaders } from "./api.config";
import { Shipment } from "../types";

export const createShipment = async (token: string, data: Partial<Shipment>) => {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create shipment");
  return response.json();
};

export const updateShipmentStatus = async (token: string, id: number, status: string) => {
  const response = await fetch(`${API_BASE_URL}/shipments/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update shipment status");
  return response.json();
};

export const getShipmentsByBranch = async (token: string, branchId: number) => {
  const response = await fetch(`${API_BASE_URL}/shipments/branch/${branchId}`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch shipments");
  return response.json();
};
