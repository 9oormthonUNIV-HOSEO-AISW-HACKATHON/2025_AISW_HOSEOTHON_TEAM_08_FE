import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getTalkingGuide, ApiException } from '../services/api';
import { TalkingGuide, AnalysisResult } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TalkingGuideRouteProp = RouteProp<RootStackParamList, 'TalkingGuide'>;

export default function TalkingGuideScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TalkingGuideRouteProp>();
  const { userGeneration, companionGeneration, recommendation, analysis } = route.params as {
    userGeneration: string;
    companionGeneration: string;
    recommendation: any;
    analysis?: AnalysisResult;
  };
  const [guide, setGuide] = useState<TalkingGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        if (!analysis) {
          throw new Error('분석 결과가 필요합니다.');
        }

        const guideData = await getTalkingGuide(
          userGeneration,
          companionGeneration,
          recommendation,
          analysis.userProfile,
          analysis.companionProfile
        );
        setGuide(guideData);
      } catch (error: any) {
        console.error('가이드 로드 오류:', error);
        const errorMessage = error instanceof ApiException 
          ? error.message 
          : error.message || '대화 가이드를 불러오는데 실패했습니다.';
        Alert.alert('오류', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuide();
  }, []);

  if (isLoading || !guide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>👋 이렇게 말해보세요</Text>
        </View>

        <Card variant="info" style={styles.suggestionsCard}>
          {guide.suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <View style={styles.suggestionBubble}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
              <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
                <Text style={styles.playButtonText}>🎧 듣기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        <Card variant="warning">
          <Text style={styles.sectionTitle}>💡 대화 팁</Text>
          {guide.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipBullet}>
                <Text style={styles.tipBulletText}>•</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>🗣 대화 주제</Text>
          {guide.topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </Card>

        <Button
          title="홈으로 가기"
          onPress={() => navigation.navigate('Main')}
          variant="primary"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  suggestionsCard: {
    marginBottom: 20,
  },
  suggestionItem: {
    marginBottom: 16,
  },
  suggestionBubble: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },
  playButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  playButtonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipBulletText: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 24,
  },
  topicItem: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  topicText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  button: {
    marginTop: 8,
  },
});

