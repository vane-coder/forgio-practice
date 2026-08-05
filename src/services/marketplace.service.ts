import { API_BASE_URL, getHeaders } from "./api.config";

export const getListings = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/marketplace/listings`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch listings");
  return response.json();
};

export const createListing = async (token: string, data: {
  materialId: string;
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

export const purchaseListing = async (
  token: string,
  listingId: string,
  quantity: number,
  destinationBranchId: string
): Promise<{ authorizationUrl: string; reference: string }> => {
  const response = await fetch(`${API_BASE_URL}/marketplace/listings/${listingId}/purchase`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ quantity, destinationBranchId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Purchase failed");
  }
  return response.json();
};