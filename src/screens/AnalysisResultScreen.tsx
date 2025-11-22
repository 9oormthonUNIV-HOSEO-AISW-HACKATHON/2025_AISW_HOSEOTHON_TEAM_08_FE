import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AnalysisResult } from '../types';
import { getPersonalRecommendations, ApiException } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AnalysisResultRouteProp = RouteProp<RootStackParamList, 'AnalysisResult'>;

export default function AnalysisResultScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AnalysisResultRouteProp>();
  const { userGeneration, companionGeneration, analysis } = route.params;
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!user?.id) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('========================================');
      console.log('📤 [AnalysisResultScreen] 개인 추천 조회 시작');
      console.log('User ID:', user.id);

      const recommendations = await getPersonalRecommendations(user.id);

      console.log('✅ [AnalysisResultScreen] 개인 추천 조회 성공');
      console.log('Response Type:', typeof recommendations);
      console.log('Response IsArray:', Array.isArray(recommendations));
      console.log('Response Data (원문):', JSON.stringify(recommendations, null, 2));
      console.log('========================================');

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        Alert.alert('알림', '아직 추천이 생성되지 않았습니다. 잠시 후 다시 시도해주세요.');
        navigation.navigate('Main');
        return;
      }

      const recommendation = recommendations[0];

      navigation.navigate('Recommendation', {
        userGeneration,
        companionGeneration,
        preferences: {
          purposes: ['감성', '사진'],
          budget: '5~10만원',
        },
        analysis,
        recommendation,
      });
    } catch (error: any) {
      console.error('========================================');
      console.error('❌ [AnalysisResultScreen] 추천 생성 오류');
      console.error('Error Status:', error.status);
      console.error('Error Message:', error.message);
      console.error('Error Data:', error.data);
      console.error('Full Error:', JSON.stringify(error, null, 2));
      console.error('========================================');

      const errorMessage = error instanceof ApiException
        ? error.message
        : '추천을 불러오는데 실패했습니다. 다시 시도해주세요.';
      Alert.alert('오류', errorMessage);

      if (error.status === 400 || error.status === 403) {
        navigation.navigate('Main');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const profileData = [
    { label: '속도', icon: '⚡', user: analysis.userProfile.speed, companion: analysis.companionProfile.speed },
    { label: '체력', icon: '💪', user: analysis.userProfile.stamina, companion: analysis.companionProfile.stamina },
    { label: '예산', icon: '💰', user: analysis.userProfile.budget, companion: analysis.companionProfile.budget },
    { label: '사진', icon: '📸', user: analysis.userProfile.photo, companion: analysis.companionProfile.photo },
    { label: '전통', icon: '🏯', user: analysis.userProfile.tradition, companion: analysis.companionProfile.tradition },
  ];

  const ComparisonBar = ({ label, icon, user, companion }: { label: string; icon: string; user: number; companion: number }) => (
    <View style={styles.comparisonItem}>
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonIcon}>{icon}</Text>
        <Text style={styles.comparisonLabel}>{label}</Text>
      </View>
      <View style={styles.comparisonBars}>
        <View style={styles.comparisonBarWrapper}>
          <View style={styles.comparisonBarLabel}>
            <Text style={styles.comparisonBarLabelText}>당신</Text>
            <Text style={styles.comparisonBarValue}>{user}</Text>
          </View>
          <View style={styles.comparisonBarTrack}>
            <View style={[styles.comparisonBarFill, styles.comparisonBarUser, { width: `${user}%` }]} />
          </View>
        </View>
        <View style={styles.comparisonBarWrapper}>
          <View style={styles.comparisonBarLabel}>
            <Text style={styles.comparisonBarLabelText}>동반자</Text>
            <Text style={styles.comparisonBarValue}>{companion}</Text>
          </View>
          <View style={styles.comparisonBarTrack}>
            <View style={[styles.comparisonBarFill, styles.comparisonBarCompanion, { width: `${companion}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            두 세대의 여행 감각 차이를{'\n'}조율했어요!
          </Text>
        </View>

        <Card style={styles.graphCard}>
          <Text style={styles.sectionTitle}>📊 여행 감각 그래프</Text>
          {profileData.map((item, index) => (
            <ComparisonBar
              key={index}
              label={item.label}
              icon={item.icon}
              user={item.user}
              companion={item.companion}
            />
          ))}
        </Card>

        <Card variant="info">
          <Text style={styles.sectionTitle}>💬 AI 분석 요약</Text>
          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </Card>

        <Card variant="warning">
          <Text style={styles.sectionTitle}>🛠 AI 조율 설정 결과</Text>
          <View style={styles.adjustmentItem}>
            <View style={styles.adjustmentIconContainer}>
              <Text style={styles.adjustmentIcon}>⏱</Text>
            </View>
            <View style={styles.adjustmentContent}>
              <Text style={styles.adjustmentLabel}>일정 속도</Text>
              <Text style={styles.adjustmentValue}>
                {analysis.adjustments.scheduleSpeed}% 느리게 조정
              </Text>
            </View>
          </View>
          <View style={styles.adjustmentItem}>
            <View style={styles.adjustmentIconContainer}>
              <Text style={styles.adjustmentIcon}>🍽</Text>
            </View>
            <View style={styles.adjustmentContent}>
              <Text style={styles.adjustmentLabel}>음식 균형</Text>
              <Text style={styles.adjustmentValue}>
                전통 {analysis.adjustments.foodBalance.traditional}% + 트렌드{' '}
                {analysis.adjustments.foodBalance.trendy}%
              </Text>
            </View>
          </View>
          <View style={styles.adjustmentItem}>
            <View style={styles.adjustmentIconContainer}>
              <Text style={styles.adjustmentIcon}>📸</Text>
            </View>
            <View style={styles.adjustmentContent}>
              <Text style={styles.adjustmentLabel}>포토존 위치</Text>
              <Text style={styles.adjustmentValue}>이동 동선 최적화</Text>
            </View>
          </View>
        </Card>

        <Button
          title={isLoading ? '추천 생성 중...' : '조율한 여행 보기 ▶'}
          onPress={handleNext}
          variant="primary"
          disabled={isLoading}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 38,
  },
  graphCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  comparisonItem: {
    marginBottom: 24,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  comparisonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  comparisonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  comparisonBars: {
    gap: 12,
  },
  comparisonBarWrapper: {
    marginBottom: 8,
  },
  comparisonBarLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  comparisonBarLabelText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  comparisonBarValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '700',
  },
  comparisonBarTrack: {
    height: 10,
    backgroundColor: Colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
  },
  comparisonBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  comparisonBarUser: {
    backgroundColor: Colors.primary,
  },
  comparisonBarCompanion: {
    backgroundColor: Colors.secondary,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  adjustmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  adjustmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adjustmentIcon: {
    fontSize: 24,
  },
  adjustmentContent: {
    flex: 1,
  },
  adjustmentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  adjustmentValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
});

