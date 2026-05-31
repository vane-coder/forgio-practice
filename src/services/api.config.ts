// Base API configuration
// TODO: Change this to your actual backend URL when deployed
export const API_BASE_URL = "http://localhost:8080/api/v1";

export const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
