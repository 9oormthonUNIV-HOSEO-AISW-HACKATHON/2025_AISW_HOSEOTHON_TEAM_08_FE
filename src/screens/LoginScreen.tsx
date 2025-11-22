import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import Card from '../components/Card';
import { Colors } from '../constants/colors';
import { login, register } from '../services/auth';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login: authLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      let response;
      if (isLogin) {
        response = await login(email, password);
      } else {
        if (!name) {
          Alert.alert('오류', '이름을 입력해주세요.');
          return;
        }
        response = await register(email, password, name);
      }
      
      // AuthContext에 사용자 정보 저장
      if (response.success && response.user && response.token) {
        await authLogin(response.user, response.token);
        // 성공 시 메인으로 이동
        navigation.replace('Main');
      }
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.error || error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🧳 세대로드</Text>
          <Text style={styles.subtitle}>
            {isLogin ? '로그인' : '회원가입'}
          </Text>
        </View>

        <Card style={styles.formCard}>
          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title={isLogin ? '로그인' : '회원가입'}
            onPress={handleSubmit}
            variant="primary"
            style={styles.submitButton}
          />
        </Card>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? '계정이 없으신가요? 회원가입'
              : '이미 계정이 있으신가요? 로그인'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  formCard: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.backgroundLight,
  },
  submitButton: {
    marginTop: 8,
  },
  switchButton: {
    alignItems: 'center',
    padding: 16,
  },
  switchText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});

