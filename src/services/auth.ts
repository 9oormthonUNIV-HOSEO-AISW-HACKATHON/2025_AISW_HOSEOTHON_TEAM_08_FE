import axios from 'axios';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인증 API는 토큰이 필요 없으므로 인터셉터 추가하지 않음

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    generation?: string;
  };
  token: string;
}

export const register = async (
  email: string,
  password: string,
  name: string,
  generation?: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/register', {
    email,
    password,
    name,
    ...(generation && { generation }),
  });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
};

