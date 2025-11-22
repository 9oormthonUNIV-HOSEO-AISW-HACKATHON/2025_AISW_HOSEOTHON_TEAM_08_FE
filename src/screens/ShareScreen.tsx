import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { getUserRooms } from '../services/rooms';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Room {
  id: string;
  name: string;
  participants: number;
  createdAt: string;
}

export default function ShareScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    if (!user) {
      return;
    }
    
    try {
      const response = await getUserRooms(user.id);
      setRooms(response.rooms.map(room => ({
        id: room.id,
        name: room.name,
        participants: room.participants || 0,
        createdAt: room.createdAt,
      })));
    } catch (error) {
      console.error('방 목록 로드 오류:', error);
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
          <Text style={styles.title}>공유</Text>
          <Text style={styles.subtitle}>
            여행을 함께하고 싶은 사람들과{'\n'}
            방을 만들어보세요!
          </Text>
        </View>

        <Button
          title="새 방 만들기"
          onPress={() => navigation.navigate('CreateRoom')}
          variant="primary"
          size="large"
          style={styles.createButton}
          icon={<Icon name="arrow-right" size={18} color={Colors.backgroundLight} />}
        />

        {rooms.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Icon name="home" size={64} color={Colors.textLight} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>아직 생성된 방이 없습니다</Text>
            <Text style={styles.emptyText}>
              방을 만들어 친구들을 초대해보세요!
            </Text>
          </Card>
        ) : (
          <View style={styles.roomsSection}>
            <Text style={styles.sectionTitle}>최근 참여 방</Text>
            <View style={styles.roomsList}>
              {rooms.map((room) => (
                <Card key={room.id} variant="elevated" style={styles.roomCard}>
                  <View style={styles.roomHeader}>
                    <View style={styles.roomInfo}>
                      <Text style={styles.roomName}>{room.name}</Text>
                      <Text style={styles.roomParticipants}>
                        참여자 {room.participants}명
                      </Text>
                    </View>
                  </View>
                  <Button
                    title="입장하기"
                    onPress={() => {
                      navigation.navigate('Room', { roomId: room.id });
                    }}
                    variant="primary"
                    size="small"
                    style={styles.enterButton}
                    icon={<Icon name="arrow-right" size={14} color={Colors.backgroundLight} />}
                  />
                </Card>
              ))}
            </View>
          </View>
        )}
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
  createButton: {
    marginBottom: 32,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  roomsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  roomsList: {
    gap: 16,
  },
  roomCard: {
    padding: 20,
  },
  roomHeader: {
    marginBottom: 16,
  },
  roomInfo: {
    marginBottom: 4,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  roomParticipants: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  enterButton: {
    alignSelf: 'flex-start',
  },
});
