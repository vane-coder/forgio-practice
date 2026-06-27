// Base API configuration
import { API_URL } from "../config";

export const API_BASE_URL = `${API_URL}/api/v1`;

export const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});