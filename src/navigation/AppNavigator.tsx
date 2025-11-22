import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DiagnosisScreen from '../screens/DiagnosisScreen';
import DiagnosisTabScreen from '../screens/DiagnosisTabScreen';
import AnalysisResultScreen from '../screens/AnalysisResultScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import TalkingGuideScreen from '../screens/TalkingGuideScreen';
import ShareScreen from '../screens/ShareScreen';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import RoomCreatedScreen from '../screens/RoomCreatedScreen';
import RoomScreen from '../screens/RoomScreen';
import RecordsScreen from '../screens/RecordsScreen';
import MyPageScreen from '../screens/MyPageScreen';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  Onboarding: undefined;
  Diagnosis: {
    userGeneration: string;
    companionGeneration: string;
  };
  AnalysisResult: {
    userGeneration: string;
    companionGeneration: string;
    answers: any[];
    analysis: any;
  };
  Recommendation: {
    userGeneration: string;
    companionGeneration: string;
    preferences: any;
    analysis: any;
    recommendation: any;
  };
  TalkingGuide: {
    userGeneration: string;
    companionGeneration: string;
    recommendation: any;
  };
  Room: {
    roomId: string;
  };
  CreateRoom: undefined;
  RoomCreated: {
    roomId: string;
    roomName: string;
    inviteCode: string;
    inviteLink: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="home" 
              size={24} 
              color={focused ? Colors.primary : Colors.textLight} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Diagnosis"
        component={DiagnosisTabScreen}
        options={{
          tabBarLabel: '여행진단',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="diagnosis" 
              size={24} 
              color={focused ? Colors.primary : Colors.textLight} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Share"
        component={ShareScreen}
        options={{
          tabBarLabel: '공유',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="share" 
              size={24} 
              color={focused ? Colors.primary : Colors.textLight} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="user" 
              size={24} 
              color={focused ? Colors.primary : Colors.textLight} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
          }}
        />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: true,
            title: '세대 선택',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Diagnosis"
          component={DiagnosisScreen}
          options={{
            headerShown: true,
            title: '여행 가치관 진단',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="AnalysisResult"
          component={AnalysisResultScreen}
          options={{
            headerShown: true,
            title: '분석 결과',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Recommendation"
          component={RecommendationScreen}
          options={{
            headerShown: true,
            title: '여행 추천',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="TalkingGuide"
          component={TalkingGuideScreen}
          options={{
            headerShown: true,
            title: '대화 가이드',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{
            headerShown: true,
            title: '새 방 만들기',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="RoomCreated"
          component={RoomCreatedScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{
            headerShown: true,
            title: '여행 방',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

