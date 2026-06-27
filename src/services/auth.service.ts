import { API_BASE_URL } from "./api.config";
import { AuthResponse } from "../types";

export const login = async (phone: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const register = async (data: {
  managerName: string;
  phone: string;
  password: string;
  factoryName: string;
  location?: string;
  industry?: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
};