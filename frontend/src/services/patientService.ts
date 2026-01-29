import axios from '../lib/axios';
import { Patient, CreatePatientData, UpdatePatientData } from '../types';

export const patientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    const response = await axios.get('/api/patients');
    return response.data;
  },

  getPatientById: async (id: number): Promise<Patient> => {
    const response = await axios.get(`/api/patients/${id}`);
    return response.data;
  },

  createPatient: async (data: CreatePatientData): Promise<Patient> => {
    const response = await axios.post('/api/patients', data);
    return response.data;
  },

  updatePatient: async (id: number, data: UpdatePatientData): Promise<Patient> => {
    const response = await axios.put(`/api/patients/${id}`, data);
    return response.data;
  },

  deletePatient: async (id: number): Promise<void> => {
    await axios.delete(`/api/patients/${id}`);
  },
};
