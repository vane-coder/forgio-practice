import { API_BASE_URL, getHeaders } from "./api.config";

export const sendBulkNotification = async (token: string, data: {
  factoryId: number;
  targetRole?: string;
  message: string;
  type: "MEETING" | "ALERT" | "WEATHER" | "GENERAL";
}) => {
  const response = await fetch(`${API_BASE_URL}/notifications/send`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send notification");
  return response.json();
};

export const scheduleMeeting = async (token: string, data: {
  title: string;
  time: string;
  targetRole?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/meetings/schedule`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to schedule meeting");
  return response.json();
};
