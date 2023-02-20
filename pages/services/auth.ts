import { api } from './api';

interface LoginData {
  email: string;
  password: string;
  error: string;
}

interface RegisterData extends LoginData {
  name: string;
}

export const AuthService = {
  login: async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data;
    } catch (error: error) {
      return Promise.reject(error.response.data);
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  },
};
