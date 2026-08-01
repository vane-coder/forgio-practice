import { API_BASE_URL, getHeaders } from "./api.config";

export type SalePayload = {
  materialId?: string;
  itemName: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  soldTo?: string;
  notes?: string;
};

/** Worker records a sale of goods; the manager is notified server-side. */
export const createSale = async (token: string, data: SalePayload) => {
  const response = await fetch(`${API_BASE_URL}/sales`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to record sale");
  return response.json();
};

/** Manager/dept-head: all sales for the factory. */
export const getSales = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/sales/factory`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch sales");
  return response.json();
};

/** A worker's own recorded sales. */
export const getMySales = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/sales/me`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch sales");
  return response.json();
};
