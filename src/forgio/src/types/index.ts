// Core types based on Forgio entities

export type Role = "MANAGER" | "DEPT_HEAD" | "WORKER" | "DRIVER";

export interface User {
  userId: number;
  name: string;
  phone: string;
  email: string;
  role: Role;
  factoryId: number;
  departmentId?: number;
}

export interface Factory {
  factoryId: number;
  name: string;
  location: string;
  industry: string;
  managerId: number;
}

export interface Department {
  deptId: number;
  factoryId: number;
  name: string;
  headUserId?: number;
}

export interface RawMaterial {
  materialId: number;
  factoryId: number;
  name: string;
  unit: string;
  quantityInStock: number;
  reorderLevel: number;
  costPerUnit: number;
}

export interface ProductionEntry {
  entryId: number;
  workerId: number;
  factoryId: number;
  date: string;
  productName: string;
  quantityProduced: number;
  shift: string;
}

export interface Machine {
  machineId: number;
  factoryId: number;
  name: string;
  status: "RUNNING" | "STOPPED" | "MAINTENANCE";
  lastServiceDate: string;
}

export interface Shipment {
  shipmentId: number;
  fromBranchId: number;
  toBranchId: number;
  driverId: number;
  status: "PENDING" | "DEPARTED" | "IN_TRANSIT" | "ARRIVED";
  departedAt?: string;
  arrivedAt?: string;
}

export interface Branch {
  branchId: number;
  companyId: number;
  name: string;
  location: string;
  managerId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
