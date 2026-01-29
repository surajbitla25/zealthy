import axios from '../lib/axios';
import { Medication, Dosage } from '../types';

export const referenceService = {
  getMedications: async (): Promise<Medication[]> => {
    const response = await axios.get('/api/reference/medications');
    return response.data;
  },

  getDosages: async (): Promise<Dosage[]> => {
    const response = await axios.get('/api/reference/dosages');
    return response.data;
  },
};
