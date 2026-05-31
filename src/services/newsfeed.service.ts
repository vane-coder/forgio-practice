import { API_BASE_URL, getHeaders } from "./api.config";

export const getNewsFeed = async (token: string, factoryId: number) => {
  const response = await fetch(`${API_BASE_URL}/newsfeed/factory/${factoryId}`, {
    headers: getHeaders(token),
  });
  if (!response.ok) throw new Error("Failed to fetch news feed");
  return response.json();
};

export const createPost = async (token: string, data: { factoryId: number; content: string }) => {
  const response = await fetch(`${API_BASE_URL}/newsfeed`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};
