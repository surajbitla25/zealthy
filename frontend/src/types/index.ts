export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  userId: number;
  provider: string;
  datetime: string;
  repeatSchedule: string;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: number;
  userId: number;
  medication: string;
  dosage: string;
  quantity: number;
  refillOn: string;
  refillSchedule: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: number;
  name: string;
}

export interface Dosage {
  id: number;
  value: string;
}

export interface Patient extends User {
  appointments?: Appointment[];
  prescriptions?: Prescription[];
  upcomingAppointmentsCount?: number;
  prescriptionsCount?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePatientData {
  name: string;
  email: string;
  password: string;
}

export interface UpdatePatientData {
  name?: string;
  email?: string;
}

export interface CreateAppointmentData {
  provider: string;
  datetime: string;
  repeatSchedule: string;
  endDate?: string | null;
}

export interface UpdateAppointmentData {
  provider?: string;
  datetime?: string;
  repeatSchedule?: string;
  endDate?: string | null;
}

export interface CreatePrescriptionData {
  medication: string;
  dosage: string;
  quantity: number;
  refillOn: string;
  refillSchedule: string;
}

export interface UpdatePrescriptionData {
  medication?: string;
  dosage?: string;
  quantity?: number;
  refillOn?: string;
  refillSchedule?: string;
}
