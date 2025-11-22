import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAnswer, AnalysisResult, TripRecommendation, TalkingGuide, UserPreferences, UserProfile, ApiError } from '../types';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 || status === 403) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }

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

export class ApiException extends Error {
  status: number;
  data: ApiError | null;
  error?: string;
  isDiagnosisNotCompleted?: boolean;

  constructor(status: number, message: string, data: ApiError | null = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.error = data?.error;
    this.name = 'ApiException';
    this.isDiagnosisNotCompleted =
      data?.error === 'DIAGNOSIS_NOT_COMPLETED' ||
      message.includes('진단') ||
      message.includes('프로필');
  }
}

export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await api.get<{ status: string; message: string }>('/health');
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '헬스 체크에 실패했습니다.', error.data);
  }
};

export const analyzeGenerationDifference = async (
  userId: string,
  userAnswers: UserAnswer[],
  userGeneration: string,
  companionGeneration: string
): Promise<AnalysisResult> => {
  try {
    const response = await api.post<AnalysisResult>('/analyze', {
      userId,
      userAnswers,
      userGeneration,
      companionGeneration,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '분석에 실패했습니다.', error.data);
  }
};

export const getTalkingGuide = async (
  userGeneration: string,
  companionGeneration: string,
  recommendation: TripRecommendation,
  userProfile: AnalysisResult['userProfile'],
  companionProfile: AnalysisResult['companionProfile']
): Promise<TalkingGuide> => {
  try {
    const response = await api.post<TalkingGuide>('/talking-guide', {
      userGeneration,
      companionGeneration,
      recommendation: {
        title: recommendation.title,
        course: recommendation.course,
        why: recommendation.why,
      },
      userProfile,
      companionProfile,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '대화 가이드 생성에 실패했습니다.', error.data);
  }
};

export const getPersonalRecommendations = async (
  userId: string
): Promise<TripRecommendation[]> => {
  try {
    const response = await api.get<TripRecommendation[]>(`/recommendations/personal/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '개인 추천을 불러오는데 실패했습니다.', error.data);
  }
};

export const getRoomRecommendations = async (
  roomId: string
): Promise<TripRecommendation[]> => {
  try {
    const response = await api.get<TripRecommendation[]>(`/recommendations/room/${roomId}`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '방 추천을 불러오는데 실패했습니다.', error.data);
  }
};

export const saveTrip = async (
  userId: string,
  tripId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>('/trips/save', { userId, tripId });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '여행지 저장에 실패했습니다.', error.data);
  }
};

export const unsaveTrip = async (
  userId: string,
  tripId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>('/trips/unsave', { userId, tripId });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '저장 취소에 실패했습니다.', error.data);
  }
};

export const getSavedTrips = async (
  userId: string
): Promise<{ trips: TripRecommendation[] }> => {
  try {
    const response = await api.get<{ trips: TripRecommendation[] }>(`/trips/saved/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '저장된 여행지를 불러오는데 실패했습니다.', error.data);
  }
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>(`/users/${userId}/profile`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '프로필을 불러오는데 실패했습니다.', error.data);
  }
};

