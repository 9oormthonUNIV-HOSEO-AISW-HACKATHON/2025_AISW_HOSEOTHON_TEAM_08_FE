import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { ApiError, Comment, Vote } from '../types';
import { ApiException } from './api';

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

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  inviteLink: string;
  participants: string[];
  participantsCount?: number;
  createdBy?: string;
  createdAt: string;
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  room: Room;
}

export interface Participant {
  id: string;
  name: string;
  generation: string;
  profile: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
  tag?: string;
}

export const createRoom = async (
  userId: string,
  roomName: string
): Promise<CreateRoomResponse> => {
  try {
    const response = await api.post<CreateRoomResponse>('/rooms/create', {
      userId,
      roomName,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '방 생성에 실패했습니다.', error.data);
  }
};

export const joinRoom = async (
  userId: string,
  inviteCode: string
): Promise<{ success: boolean; message: string; room: Room }> => {
  try {
    const response = await api.post<{ success: boolean; message: string; room: Room }>('/rooms/join', {
      userId,
      inviteCode,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '방 참여에 실패했습니다.', error.data);
  }
};

export const getRoom = async (roomId: string): Promise<{ room: Room }> => {
  try {
    const response = await api.get<{ room: Room }>(`/rooms/${roomId}`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '방 정보를 불러오는데 실패했습니다.', error.data);
  }
};

export const getUserRooms = async (
  userId: string
): Promise<{ rooms: Room[] }> => {
  try {
    const response = await api.get<{ rooms: Room[] }>(`/rooms/user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '방 목록을 불러오는데 실패했습니다.', error.data);
  }
};

export const getRoomParticipants = async (
  roomId: string
): Promise<{ participants: Participant[] }> => {
  try {
    const response = await api.get<{ participants: Participant[] }>(`/rooms/${roomId}/participants`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '참여자 목록을 불러오는데 실패했습니다.', error.data);
  }
};

export const getRoomComments = async (
  roomId: string
): Promise<{ comments: Comment[] }> => {
  try {
    const response = await api.get<{ comments: Comment[] }>(`/rooms/${roomId}/comments`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '댓글을 불러오는데 실패했습니다.', error.data);
  }
};

export const createRoomComment = async (
  roomId: string,
  userId: string,
  content: string
): Promise<{ success: boolean; comment: Comment }> => {
  try {
    const response = await api.post<{ success: boolean; comment: Comment }>(`/rooms/${roomId}/comments`, {
      userId,
      content,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '댓글 작성에 실패했습니다.', error.data);
  }
};

export const getRoomVotes = async (
  roomId: string
): Promise<{ votes: Vote }> => {
  try {
    const response = await api.get<{ votes: Vote }>(`/rooms/${roomId}/votes`);
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '투표를 불러오는데 실패했습니다.', error.data);
  }
};

export const createRoomVote = async (
  roomId: string,
  userId: string,
  recommendationId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post<{ success: boolean; message: string }>(`/rooms/${roomId}/votes`, {
      userId,
      recommendationId,
    });
    return response.data;
  } catch (error: any) {
    throw new ApiException(error.status || 0, error.message || '투표에 실패했습니다.', error.data);
  }
};

