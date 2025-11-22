import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';
import { ApiError } from '../types';
import { ApiException } from './api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data?.error || '';
      const errorMessage = data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
      const isDiagnosisNotCompleted =
        errorCode === 'DIAGNOSIS_NOT_COMPLETED' ||
        errorMessage.includes('진단') ||
        errorMessage.includes('프로필');

      return Promise.reject({
        status,
        message: errorMessage,
        error: errorCode,
        data,
        isDiagnosisNotCompleted,
      });
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: '네트워크 연결을 확인해주세요.',
        data: null,
      });
    }

    return Promise.reject({
      status: 0,
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      data: null,
    });
  }
);

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
  try {
    const response = await api.post<LoginResponse>('/auth/register', {
      email,
      password,
      name,
      generation,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '회원가입에 실패했습니다.', error.data);
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '로그인에 실패했습니다.', error.data);
  }
};

