import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

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

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  inviteLink: string;
  participants: string[];
  createdAt: string;
}

export interface CreateRoomResponse {
  success: boolean;
  room: Room;
}

export const createRoom = async (
  userId: string,
  roomName?: string
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>('/rooms/create', {
    userId,
    roomName,
  });
  return response.data;
};

export const joinRoom = async (
  userId: string,
  inviteCode: string
): Promise<{ success: boolean; room: Room }> => {
  const response = await api.post('/rooms/join', {
    userId,
    inviteCode,
  });
  return response.data;
};

export const getRoom = async (roomId: string): Promise<{ room: Room }> => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};

export const getUserRooms = async (
  userId: string
): Promise<{ rooms: Room[] }> => {
  const response = await api.get(`/rooms/user/${userId}`);
  return response.data;
};

export const getRoomParticipants = async (
  roomId: string
): Promise<{ participants: any[] }> => {
  const response = await api.get(`/rooms/${roomId}/participants`);
  return response.data;
};

