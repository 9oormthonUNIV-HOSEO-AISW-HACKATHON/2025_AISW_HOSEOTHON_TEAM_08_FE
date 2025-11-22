import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RecommendationRouteProp = RouteProp<RootStackParamList, 'Recommendation'>;

export default function RecommendationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RecommendationRouteProp>();
  const { recommendation, userGeneration, companionGeneration, analysis } = route.params;

  const handleTalkingGuide = () => {
    navigation.navigate('TalkingGuide', {
      userGeneration,
      companionGeneration,
      recommendation,
      analysis,
    });
  };

  const SatisfactionBar = ({ label, value }: { label: string; value: number }) => {
    const emoji = value > 85 ? '😊' : value > 75 ? '😄' : '😐';
    return (
      <View style={styles.satisfactionBarContainer}>
        <View style={styles.satisfactionBarHeader}>
          <Text style={styles.satisfactionBarLabel}>{label}</Text>
          <Text style={styles.satisfactionBarValue}>
            {value}% {emoji}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${value}%` }]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>📍 {recommendation.title}</Text>
          {recommendation.for_generation && (
            <Text style={styles.subtitle}>
              {recommendation.for_generation} 추천 코스
            </Text>
          )}
          {recommendation.type && !recommendation.for_generation && (
            <Text style={styles.subtitle}>
              {recommendation.type === 'personal' ? '개인 맞춤' : 
               recommendation.type === 'room' ? '방 추천' : 
               '세대 추천'} 코스
            </Text>
          )}
        </View>

        {recommendation.course && recommendation.course.length > 0 && (
          <Card style={styles.courseCard}>
            <Text style={styles.sectionTitle}>🗓 추천 코스</Text>
            {recommendation.course.map((place: string, index: number) => (
              <View key={index} style={styles.courseItem}>
                <View style={styles.courseNumber}>
                  <Text style={styles.courseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.courseContent}>
                  <Text style={styles.courseText}>{place}</Text>
                  {index < recommendation.course.length - 1 && (
                    <View style={styles.courseConnector}>
                      <Text style={styles.courseConnectorText}>↓</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {recommendation.why && (
          <Card variant="info">
            <Text style={styles.sectionTitle}>💡 왜 이 코스인가요?</Text>
            <Text style={styles.whyText}>{recommendation.why}</Text>
          </Card>
        )}

        {recommendation.options && Object.keys(recommendation.options).length > 0 && (
          <Card variant="warning">
            <Text style={styles.sectionTitle}>👥 세대별 옵션</Text>
            {Object.entries(recommendation.options).map(([key, value]) => (
              <View key={key} style={styles.optionItem}>
                <View style={styles.optionBadge}>
                  <Text style={styles.optionBadgeText}>
                    {key === 'parents' || key === 'companion' ? '동반자' : '당신'}
                  </Text>
                </View>
                <Text style={styles.optionValue}>{value as string}</Text>
              </View>
            ))}
          </Card>
        )}

        {(recommendation.estimated_time || recommendation.estimated_cost) && (
          <Card variant="warning">
            <Text style={styles.sectionTitle}>📊 여행 정보</Text>
            {recommendation.estimated_time && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>⏱ 예상 소요 시간</Text>
                <Text style={styles.infoValue}>{recommendation.estimated_time}</Text>
              </View>
            )}
            {recommendation.estimated_cost && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>💰 예상 비용</Text>
                <Text style={styles.infoValue}>{recommendation.estimated_cost}</Text>
              </View>
            )}
          </Card>
        )}

        {recommendation.talking_tip && (
          <Card variant="info">
            <Text style={styles.sectionTitle}>💬 대화 팁</Text>
            <Text style={styles.talkingTipText}>{recommendation.talking_tip}</Text>
          </Card>
        )}

        {typeof recommendation.satisfaction === 'object' && recommendation.satisfaction && Object.keys(recommendation.satisfaction).length > 0 && (
          <Card variant="info">
            <Text style={styles.sectionTitle}>📌 동반 만족도 예측</Text>
            {Object.entries(recommendation.satisfaction).map(([key, value]) => (
              <SatisfactionBar
                key={key}
                label={key === companionGeneration ? '동반자' : '당신'}
                value={value as number}
              />
            ))}
          </Card>
        )}

        {typeof recommendation.satisfaction === 'number' && (
          <Card variant="info">
            <Text style={styles.sectionTitle}>📌 만족도 예측</Text>
            <SatisfactionBar
              label="예상 만족도"
              value={recommendation.satisfaction}
            />
          </Card>
        )}

        <View style={styles.buttonRow}>
          <Button
            title="다른 추천 보기"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="대화 가이드 보기"
            onPress={handleTalkingGuide}
            variant="primary"
            style={styles.button}
          />
        </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  courseCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  courseItem: {
    marginBottom: 16,
  },
  courseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  courseNumberText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
  courseContent: {
    marginLeft: 0,
  },
  courseText: {
    fontSize: 17,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: 24,
  },
  courseConnector: {
    alignItems: 'center',
    marginVertical: 8,
  },
  courseConnectorText: {
    fontSize: 20,
    color: Colors.primary,
  },
  whyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  optionBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  optionBadgeText: {
    color: Colors.background,
    fontSize: 13,
    fontWeight: '700',
  },
  optionValue: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    fontWeight: '500',
  },
  satisfactionBarContainer: {
    marginBottom: 20,
  },
  satisfactionBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  satisfactionBarLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  satisfactionBarValue: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '700',
  },
  talkingTipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});

