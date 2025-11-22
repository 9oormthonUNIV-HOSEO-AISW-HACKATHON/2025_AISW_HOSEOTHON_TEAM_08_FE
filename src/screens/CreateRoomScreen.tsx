import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { createRoom } from '../services/rooms';
import { useAuth } from '../context/AuthContext';
import { Share } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TRAVEL_ICONS = [
  { id: '1', iconName: 'nature' as const, name: '자연', color: '#10B981' },
  { id: '2', iconName: 'culture' as const, name: '문화', color: '#6366F1' },
  { id: '3', iconName: 'food' as const, name: '맛집', color: '#F59E0B' },
  { id: '4', iconName: 'photo' as const, name: '포토', color: '#EC4899' },
];

export default function CreateRoomScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('1');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('알림', '방 제목을 입력해주세요.');
      return;
    }

    if (!user) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }
    
    setIsCreating(true);
    try {
      const response = await createRoom(user.id, roomName);

      const newRoom = response.room;
      
      // 방 생성 완료 화면으로 이동
      navigation.replace('RoomCreated', {
        roomId: newRoom.id,
        roomName: newRoom.name,
        inviteCode: newRoom.inviteCode,
        inviteLink: newRoom.inviteLink,
      });
    } catch (error: any) {
      console.error('방 생성 오류:', error);
      Alert.alert('오류', error.response?.data?.error || '방 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
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
          <Text style={styles.title}>새 방 만들기</Text>
          <Text style={styles.subtitle}>
            여행을 함께하고 싶은 사람들과{'\n'}
            방을 만들어보세요!
          </Text>
        </View>

        <Card variant="elevated" style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>방 제목</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 엄마와 봄 여행, 동기들이랑 부산여행"
              value={roomName}
              onChangeText={setRoomName}
              maxLength={50}
            />
            <Text style={styles.helperText}>
              {roomName.length}/50
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>대표 이미지</Text>
            <View style={styles.iconGrid}>
              {TRAVEL_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon.id}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon.id && styles.iconOptionSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon.id)}
                >
                  <View style={styles.iconContainer}>
                    <Icon
                      name={icon.iconName}
                      size={48}
                      color={selectedIcon === icon.id ? icon.color : Colors.textLight}
                    />
                  </View>
                  <Text
                    style={[
                      styles.iconName,
                      selectedIcon === icon.id && styles.iconNameSelected,
                    ]}
                  >
                    {icon.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Button
          title={isCreating ? "생성 중..." : "방 생성하기"}
          onPress={handleCreateRoom}
          variant="primary"
          size="large"
          style={styles.createButton}
          disabled={isCreating || !roomName.trim()}
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
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  formCard: {
    marginBottom: 24,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.backgroundLight,
    color: Colors.text,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 6,
    textAlign: 'right',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: '47%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 0,
  },
  iconName: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  iconNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  createButton: {
    marginTop: 8,
  },
});

