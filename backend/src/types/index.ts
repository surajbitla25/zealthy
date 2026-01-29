export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentResponse {
  id: number;
  userId: number;
  provider: string;
  datetime: Date;
  repeatSchedule: string;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionResponse {
  id: number;
  userId: number;
  medication: string;
  dosage: string;
  quantity: number;
  refillOn: Date;
  refillSchedule: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface CreateAppointmentRequest {
  provider: string;
  datetime: string;
  repeatSchedule: string;
  endDate?: string | null;
}

export interface UpdateAppointmentRequest {
  provider?: string;
  datetime?: string;
  repeatSchedule?: string;
  endDate?: string | null;
}

export interface CreatePrescriptionRequest {
  medication: string;
  dosage: string;
  quantity: number;
  refillOn: string;
  refillSchedule: string;
}

export interface UpdatePrescriptionRequest {
  medication?: string;
  dosage?: string;
  quantity?: number;
  refillOn?: string;
  refillSchedule?: string;
}
