import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // 인증 상태 로딩이 완료될 때까지 대기
    if (isLoading) {
      return;
    }

    // 최소 1.5초는 스플래시 화면 표시
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation, isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="travel" size={64} color={Colors.primary} style={styles.logoIcon} />
        <Text style={styles.logo}>세대로드</Text>
      </View>
      <Text style={styles.subtitle}>세대를 연결하는 여행길</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: 60,
    fontWeight: '500',
  },
  loader: {
    marginTop: 20,
  },
});

