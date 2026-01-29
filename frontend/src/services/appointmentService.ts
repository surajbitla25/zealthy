import axios from '../lib/axios';
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../types';

export const appointmentService = {
  getPatientAppointments: async (patientId: number): Promise<Appointment[]> => {
    const response = await axios.get(`/api/patients/${patientId}/appointments`);
    return response.data;
  },

  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    const response = await axios.get('/api/appointments/upcoming');
    return response.data;
  },

  createAppointment: async (
    patientId: number,
    data: CreateAppointmentData
  ): Promise<Appointment> => {
    const response = await axios.post(`/api/patients/${patientId}/appointments`, data);
    return response.data;
  },

  updateAppointment: async (
    id: number,
    data: UpdateAppointmentData
  ): Promise<Appointment> => {
    const response = await axios.put(`/api/appointments/${id}`, data);
    return response.data;
  },

  deleteAppointment: async (id: number): Promise<void> => {
    await axios.delete(`/api/appointments/${id}`);
  },
};
