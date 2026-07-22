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

export const getMyNotifications = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return response.json();
};

export const getSentNotifications = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/notifications/sent`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch sent notifications");
  return response.json();
};