import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAnswer, AnalysisResult, TripRecommendation, TalkingGuide, UserPreferences } from '../types';

const API_BASE_URL = __DEV__
    ? 'http://localhost:3000/api'
    : 'https://your-api-domain.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 토큰 자동 추가
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

export const analyzeGenerationDifference = async (
    userAnswers: UserAnswer[],
    userGeneration: string,
    companionGeneration: string
): Promise<AnalysisResult> => {
    const response = await api.post<AnalysisResult>('/analyze', {
        userAnswers,
        userGeneration,
        companionGeneration,
    });
    return response.data;
};

export const getTripRecommendation = async (
    userGeneration: string,
    companionGeneration: string,
    preferences: UserPreferences,
    analysis: AnalysisResult,
    budget?: string,
    travelStyle?: string
): Promise<TripRecommendation> => {
    const response = await api.post<TripRecommendation>('/recommend', {
        userGeneration,
        companionGeneration,
        preferences,
        analysis,
        budget,
        travelStyle,
    });
    return response.data;
};

export const getTalkingGuide = async (
    userGeneration: string,
    companionGeneration: string,
    recommendation: TripRecommendation
): Promise<TalkingGuide> => {
    const response = await api.post<TalkingGuide>('/talking-guide', {
        userGeneration,
        companionGeneration,
        recommendation,
    });
    return response.data;
};

export const saveTripRecord = async (
    userId: string,
    tripId: string,
    record: any
): Promise<{ success: boolean; recordId: string }> => {
    const response = await api.post('/records', {
        userId,
        tripId,
        record,
    });
    return response.data;
};

export const getTripRecords = async (
  userId: string
): Promise<{ records: any[] }> => {
  const response = await api.get(`/records/${userId}`);
  return response.data;
};

// 개인 기반 AI 추천
export const getPersonalRecommendations = async (
  userId: string
): Promise<any[]> => {
  const response = await api.get(`/recommendations/personal/${userId}`);
  return response.data;
};

// 방 기반 AI 추천
export const getRoomRecommendations = async (
  roomId: string
): Promise<any[]> => {
  const response = await api.get(`/recommendations/room/${roomId}`);
  return response.data;
};

// 좋아요/저장
export const saveTrip = async (
  userId: string,
  tripId: string
): Promise<{ success: boolean }> => {
  const response = await api.post('/trips/save', { userId, tripId });
  return response.data;
};

// 좋아요 취소
export const unsaveTrip = async (
  userId: string,
  tripId: string
): Promise<{ success: boolean }> => {
  const response = await api.post('/trips/unsave', { userId, tripId });
  return response.data;
};

// 저장된 여행지 조회
export const getSavedTrips = async (
  userId: string
): Promise<{ trips: any[] }> => {
  const response = await api.get(`/trips/saved/${userId}`);
  return response.data;
};

// 사용자 프로필 조회
export const getUserProfile = async (
  userId: string
): Promise<{
  name: string;
  email: string;
  generation?: string;
  profile: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
}> => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

