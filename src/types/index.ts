// Core types based on Forgio entities

export type Role = "MANAGER" | "DEPT_HEAD" | "WORKER" | "DRIVER";

export interface User {
  userId: string;
  name: string;
  phone: string;
  role: Role;
  factoryId: string;
  departmentId?: string;
}

export interface Factory {
  factoryId: string;
  name: string;
  location: string;
  industry: string;
  managerId: string;
}

export interface Department {
  deptId: string;
  factoryId: string;
  name: string;
  headUserId?: string;
}

export interface RawMaterial {
  materialId: string;
  factoryId: string;
  name: string;
  unit: string;
  quantityInStock: number;
  reorderLevel: number;
  costPerUnit: number;
}

export interface ProductionEntry {
  entryId: string;
  workerId: string;
  factoryId: string;
  date: string;
  productName: string;
  quantityProduced: number;
  shift: string;
}

export interface Machine {
  machineId: string;
  factoryId: string;
  name: string;
  status: "RUNNING" | "STOPPED" | "MAINTENANCE";
  lastServiceDate: string;
}

export interface Shipment {
  shipmentId: string;
  fromBranchId: string;
  toBranchId: string;
  driverId: string;
  status: "PENDING" | "DEPARTED" | "IN_TRANSIT" | "ARRIVED";
  departedAt?: string;
  arrivedAt?: string;
}

export interface Branch {
  branchId: string;
  companyId: string;
  name: string;
  location: string;
  managerId: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  factoryId: string;
  name: string;
  role: Role;
}

export interface OtpSentResponse {
  message: string;
  verificationId: string | null;
}

export interface LoginChallengeResponse {
  otpRequired: boolean;
  verificationId: string;
  message: string;
}