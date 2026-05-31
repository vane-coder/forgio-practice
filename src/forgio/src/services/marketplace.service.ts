import { API_BASE_URL, getHeaders } from "./api.config";

export const getListings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/marketplace/listings`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch listings");
  return response.json();
};

export const createListing = async (token: string, data: {
  materialId: number;
  quantity: number;
  pricePerUnit: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/marketplace/listings`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create listing");
  return response.json();
};

export const buyFromMarketplace = async (token: string, data: { listingId: number; quantity: number }) => {
  const response = await fetch(`${API_BASE_URL}/marketplace/buy`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Purchase failed");
  return response.json();
};
