import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de Requisição: Injeta Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alef_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Trata 401 (Sessão Expirada) e extrai erros amigáveis
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('alef_token');
      localStorage.removeItem('alef_user');
      // Dispara evento global para que o AuthContext/App reaja sem recarregar a força se não quiser
      window.dispatchEvent(new CustomEvent('alef:unauthorized'));
    }
    return Promise.reject(error);
  }
);
