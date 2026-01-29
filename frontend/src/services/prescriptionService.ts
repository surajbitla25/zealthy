import axios from '../lib/axios';
import { Prescription, CreatePrescriptionData, UpdatePrescriptionData } from '../types';

export const prescriptionService = {
  getPatientPrescriptions: async (patientId: number): Promise<Prescription[]> => {
    const response = await axios.get(`/api/patients/${patientId}/prescriptions`);
    return response.data;
  },

  getUpcomingRefills: async (): Promise<Prescription[]> => {
    const response = await axios.get('/api/prescriptions/refills');
    return response.data;
  },

  createPrescription: async (
    patientId: number,
    data: CreatePrescriptionData
  ): Promise<Prescription> => {
    const response = await axios.post(`/api/patients/${patientId}/prescriptions`, data);
    return response.data;
  },

  updatePrescription: async (
    id: number,
    data: UpdatePrescriptionData
  ): Promise<Prescription> => {
    const response = await axios.put(`/api/prescriptions/${id}`, data);
    return response.data;
  },

  deletePrescription: async (id: number): Promise<void> => {
    await axios.delete(`/api/prescriptions/${id}`);
  },
};
