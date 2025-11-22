import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiagnosisTabScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserProfile = useCallback(async () => {
    if (!user) {
      setHasProfile(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const profile = await getUserProfile(user.id);
      setHasProfile(profile.diagnosisCompleted);
    } catch (error: any) {
      console.error('프로필 확인 오류:', error);
      setHasProfile(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      checkUserProfile();
    }, [checkUserProfile])
  );

  const handleStartDiagnosis = () => {
    navigation.navigate('Onboarding');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const isFirstDiagnosis = hasProfile === false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>여행진단</Text>
          <Text style={styles.subtitle}>
            {isFirstDiagnosis
              ? '나의 여행 가치관을 알아볼게요'
              : '여행 스타일이 바뀌셨나요?'}
          </Text>
        </View>

        {isFirstDiagnosis ? (
          <Card variant="info" style={styles.infoCard}>
            <View style={styles.infoTitleContainer}>
              <Icon name="diagnosis" size={18} color={Colors.primary} />
              <Text style={styles.infoTitle}>여행 가치관 진단</Text>
            </View>
            <Text style={styles.infoText}>
              • 나의 여행 스타일을 파악하기 위해{'\n'}
              • 7가지 질문에 답해주세요{'\n'}
              • 더 정확한 여행 추천을 받을 수 있어요
            </Text>
          </Card>
        ) : (
          <Card variant="info" style={styles.infoCard}>
            <View style={styles.infoTitleContainer}>
              <Icon name="diagnosis" size={18} color={Colors.primary} />
              <Text style={styles.infoTitle}>재진단이 필요한 경우</Text>
            </View>
            <Text style={styles.infoText}>
              • 여행 스타일이 바뀌었을 때{'\n'}
              • 함께 여행할 사람이 바뀌었을 때{'\n'}
              • 더 정확한 추천을 원할 때
            </Text>
          </Card>
        )}

        <Button
          title={isFirstDiagnosis ? "여행 가치관 진단하기" : "여행 가치관 다시 진단하기"}
          onPress={handleStartDiagnosis}
          variant="primary"
          size="large"
          style={styles.button}
          icon={<Icon name="arrow-right" size={18} color={Colors.backgroundLight} />}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    marginBottom: 32,
  },
  infoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

