import { API_BASE_URL } from "./api.config";
import { AuthResponse, LoginChallengeResponse, OtpSentResponse } from "../types";

export const sendRegistrationCode = async (phone: string, email: string): Promise<OtpSentResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, email }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to send verification code");
  }
  return response.json();
};

export const verifyAndRegister = async (data: {
  phone: string;
  email: string;
  code: string;
  managerName: string;
  password: string;
  factoryName: string;
  location?: string;
  industry?: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Verification failed");
  }
  return response.json();
};

export const login = async (
  phone: string,
  password: string,
  fcmToken?: string
): Promise<LoginChallengeResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password, fcmToken }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Login failed");
  }
  return response.json();
};

export const verifyLogin = async (
  phone: string,
  code: string,
  verificationId: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code, verificationId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Verification failed");
  }
  return response.json();
};

export const forgotPassword = async (phone: string): Promise<OtpSentResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Failed to send reset code");
  }
  return response.json();
};

export const resetPassword = async (
  phone: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code, newPassword }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Password reset failed");
  }
  return response.json();
};

export const refreshToken = async (refreshTokenStr: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refreshTokenStr }),
  });
  if (!response.ok) throw new Error("Token refresh failed");
  return response.json();
};