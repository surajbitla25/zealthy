import axios from '../lib/axios';
import { LoginResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
  },

  verifyToken: async (): Promise<{ user: User }> => {
    const response = await axios.post('/api/auth/verify');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
