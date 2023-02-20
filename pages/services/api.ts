import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});

export const setAuthHeader = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
