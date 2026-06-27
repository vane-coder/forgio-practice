import { API_BASE_URL, getHeaders } from "./api.config";

export const sendBulkNotification = async (token: string, data: {
  targetRole?: string;
  message: string;
  type: "MEETING" | "ALERT" | "WEATHER" | "GENERAL";
}) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send notification");
  return response.json();
};