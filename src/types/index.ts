export interface UserAnswer {
  questionId: number;
  value: number;
}

export interface AnalysisResult {
  differences: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
  userProfile: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
  companionProfile: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
  adjustments: {
    scheduleSpeed: number;
    foodBalance: { traditional: number; trendy: number };
    photoZoneOptimization: boolean;
  };
  summary: string;
}

export interface TripRecommendation {
  id?: string;
  title: string;
  description?: string;
  course: string[];
  why: string;
  satisfaction: number | { [key: string]: number };
  type?: 'personal' | 'generation' | 'room';
  roomName?: string;
  for_generation?: string;
  options?: { [key: string]: string };
  estimated_time?: string;
  estimated_cost?: string;
  talking_tip?: string;
  analysisSummary?: string;
  aiAdjustment?: any;
}

export interface TalkingGuide {
  suggestions: string[];
  tips: string[];
  topics: string[];
}

export type Generation = '10대' | '20대' | '30대' | '40대' | '50대+';

export interface UserPreferences {
  purposes?: string[];
  budget?: string;
  preferredPlaces?: string;
  companionStyle?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  generation?: string;
  diagnosisCompleted: boolean;
  profile: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
    tag?: string;
  };
  profileCreatedAt?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Vote {
  [recommendationId: string]: number;
}

export interface ApiError {
  success?: boolean;
  error?: string;
  message: string;
  data?: any;
  details?: any;
}

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'DIAGNOSIS_NOT_COMPLETED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR';

