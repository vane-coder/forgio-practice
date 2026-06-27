import { API_BASE_URL, getHeaders } from "./api.config";

export const postGPSCoordinates = async (token: string, shipmentId: string, latitude: number, longitude: number) => {
  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/gps`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ latitude, longitude }),
  });
  if (!response.ok) throw new Error("Failed to post GPS coordinates");
  return response.json();
};

export const trackShipment = async (token: string, shipmentId: string) => {
  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/track`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch tracking data");
  return response.json();
};