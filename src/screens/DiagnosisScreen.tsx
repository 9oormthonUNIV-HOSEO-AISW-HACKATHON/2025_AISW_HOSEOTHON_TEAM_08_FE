import React, { useState } from 'react';
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
import { UserAnswer } from '../types';
import { analyzeGenerationDifference, ApiException } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DiagnosisRouteProp = RouteProp<RootStackParamList, 'Diagnosis'>;

const QUESTIONS = [
  {
    id: 0,
    question: '여행은',
    left: '빽빽하게',
    right: '천천히 여유롭게',
  },
  {
    id: 1,
    question: '사진은',
    left: '많이 찍는 편',
    right: '기억으로 남기는 편',
  },
  {
    id: 2,
    question: '식사는',
    left: '새로운 맛',
    right: '익숙한 맛',
  },
  {
    id: 3,
    question: '소비는',
    left: '경험 위주',
    right: '절약 중심',
  },
  {
    id: 4,
    question: '이동은',
    left: '걸어다니기 좋음',
    right: '이동 최소',
  },
  {
    id: 5,
    question: '일정은',
    left: '계획대로',
    right: '유연하게',
  },
  {
    id: 6,
    question: '여행 스타일은',
    left: '트렌드 중심',
    right: '전통 중심',
  },
];

export default function DiagnosisScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DiagnosisRouteProp>();
  const { userGeneration, companionGeneration } = route.params;
  const { user } = useAuth();

  const [answers, setAnswers] = useState<UserAnswer[]>(
    QUESTIONS.map((q) => ({ questionId: q.id, value: 50 }))
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (questionId: number, value: number) => {
    console.log('버튼 클릭:', { questionId, value });
    setAnswers((prev) => {
      const updated = prev.map((ans) =>
        ans.questionId === questionId ? { ...ans, value } : ans
      );
      console.log('업데이트된 답변:', updated.find(a => a.questionId === questionId));
      return updated;
    });
  };

  const handleNext = async () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 마지막 질문 - 분석 요청
      if (!user?.id) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      setIsLoading(true);
      try {
        const analysis = await analyzeGenerationDifference(
          user.id,
          answers,
          userGeneration,
          companionGeneration
        );
        navigation.navigate('AnalysisResult', {
          userGeneration,
          companionGeneration,
          answers,
          analysis,
        });
      } catch (error: any) {
        console.error('분석 오류:', error);
        const errorMessage = error instanceof ApiException
          ? error.message
          : '분석 중 오류가 발생했습니다. 다시 시도해주세요.';
        Alert.alert('오류', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentQ = QUESTIONS[currentQuestion];
  const answer = answers.find((a) => a.questionId === currentQ.id);
  const currentAnswer = answer !== undefined ? answer.value : 50;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.progressText}>
        <Text style={styles.progressLabel}>
          {currentQuestion + 1} / {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>서로의 여행 감각을 알아볼게요</Text>
        </View>

        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{currentQ.left}</Text>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${currentAnswer}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${currentAnswer}%` },
                ]}
              />
            </View>
            <Text style={styles.sliderLabel}>{currentQ.right}</Text>
          </View>

          <View style={styles.buttonRow}>
            {[0, 25, 50, 75, 100].map((value) => {
              const isActive = currentAnswer === value;
              console.log(`버튼 ${value}: isActive=${isActive}, currentAnswer=${currentAnswer}`);
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.valueButton,
                    isActive && styles.valueButtonActive,
                  ]}
                  onPress={() => {
                    console.log(`버튼 ${value} 클릭됨`);
                    handleSliderChange(currentQ.id, value);
                  }}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    style={[
                      styles.valueButtonText,
                      isActive && styles.valueButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Button
          title={
            currentQuestion === QUESTIONS.length - 1
              ? '결과 보기 ▶'
              : '다음 ▶'
          }
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
  progressBar: {
    height: 6,
    backgroundColor: Colors.borderLight,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
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
  questionCard: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 32,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  sliderLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 100,
    textAlign: 'center',
    fontWeight: '500',
  },
  sliderTrack: {
    flex: 1,
    height: 10,
    backgroundColor: Colors.borderLight,
    borderRadius: 5,
    position: 'relative',
    marginHorizontal: 16,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  sliderThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -9,
    marginLeft: -14,
    borderWidth: 4,
    borderColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    gap: 8,
  },
  valueButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  valueButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  valueButtonText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  valueButtonTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  button: {
    marginTop: 8,
  },
});

