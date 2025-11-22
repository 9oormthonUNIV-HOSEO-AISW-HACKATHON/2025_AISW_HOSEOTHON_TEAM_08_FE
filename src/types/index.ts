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
  for_generation: string;
  course: string[];
  why: string;
  options: {
    [key: string]: string;
  };
  talking_tip: string;
  satisfaction: {
    [key: string]: number;
  };
  title: string;
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

