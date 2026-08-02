import { API_BASE_URL, getHeaders } from "./api.config";

export const getShipments = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch shipments");
  return response.json();
};

export const createShipment = async (token: string, data: {
  fromBranchId: string;
  toBranchId: string;
  driverId?: string;
  notes?: string;
  items?: { materialId: string; quantity: number }[];
}) => {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create shipment");
  return response.json();
};

export const updateShipmentStatus = async (token: string, id: string, status: string) => {
  const response = await fetch(`${API_BASE_URL}/shipments/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update shipment status");
  return response.json();
};

/** Manager assigns (or clears) the driver on an existing shipment. */
export const assignShipmentDriver = async (token: string, id: string, driverId: string | null) => {
  const response = await fetch(`${API_BASE_URL}/shipments/${id}/driver`, {
    method: "PATCH",
    headers: getHeaders(token),
    body: JSON.stringify({ driverId: driverId ?? "" }),
  });
  if (!response.ok) throw new Error("Failed to assign driver");
  return response.json();
};