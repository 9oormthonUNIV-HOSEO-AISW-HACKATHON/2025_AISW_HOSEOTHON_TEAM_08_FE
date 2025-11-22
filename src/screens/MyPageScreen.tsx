import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { getUserRooms } from '../services/rooms';
import { useAuth } from '../context/AuthContext';
import { getSavedTrips, getUserProfile } from '../services/api';
import axios from 'axios';
import { API_BASE_URL } from '@env';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SavedTrip {
  id: string;
  title: string;
  course: string[];
  satisfaction: number;
}

interface Room {
  id: string;
  name: string;
  participants: number;
  createdAt: string;
}

export default function MyPageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout: authLogout } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    generation?: string;
    diagnosisCompleted?: boolean;
    profile?: {
      speed: number;
      stamina: number;
      budget: number;
      photo: number;
      tradition: number;
      tag?: string;
    };
    profileCreatedAt?: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      // 저장된 여행지 로드
      const savedTripsResponse = await getSavedTrips(user.id);
      setSavedTrips(savedTripsResponse.trips.map((trip: any) => ({
        id: trip.id,
        title: trip.title,
        course: trip.course || [],
        satisfaction: typeof trip.satisfaction === 'number'
          ? trip.satisfaction
          : (Object.values(trip.satisfaction || {})[0] as number || 85),
      })));

      // 참여한 방 로드
      const roomsResponse = await getUserRooms(user.id);
      setRooms(roomsResponse.rooms.map((room: any) => ({
        id: room.id,
        name: room.name,
        participants: typeof room.participants === 'number' ? room.participants : (Array.isArray(room.participants) ? room.participants.length : 0),
        createdAt: room.createdAt,
      })));

      // 사용자 프로필 로드
      const profileResponse = await getUserProfile(user.id);
      setUserProfile({
        name: profileResponse.name,
        email: profileResponse.email,
        generation: profileResponse.generation,
        profile: profileResponse.profile,
        diagnosisCompleted: profileResponse.diagnosisCompleted,
        profileCreatedAt: profileResponse.profileCreatedAt,
      });
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadData();
      }
    }, [user, loadData])
  );

  const handleLogout = async () => {
    try {
      await authLogout();
      navigation.replace('Login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
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
          <Text style={styles.title}>마이페이지</Text>
        </View>

        {/* 내 여행 감각 프로필 */}
        {userProfile && userProfile.profile && (
          <Card variant="elevated" style={styles.profileCard}>
            <Text style={styles.sectionTitle}>내 여행 감각 프로필</Text>
            {userProfile.name && (
              <Text style={styles.profileName}>
                {userProfile.name} {userProfile.generation ? `(${userProfile.generation})` : ''}
              </Text>
            )}
            <View style={styles.profileGrid}>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>속도</Text>
                <View style={styles.profileBar}>
                  <View
                    style={[styles.profileBarFill, { width: `${userProfile.profile.speed}%` }]}
                  />
                </View>
                <Text style={styles.profileValue}>{userProfile.profile.speed}%</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>체력</Text>
                <View style={styles.profileBar}>
                  <View
                    style={[styles.profileBarFill, { width: `${userProfile.profile.stamina}%` }]}
                  />
                </View>
                <Text style={styles.profileValue}>{userProfile.profile.stamina}%</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>예산</Text>
                <View style={styles.profileBar}>
                  <View
                    style={[styles.profileBarFill, { width: `${userProfile.profile.budget}%` }]}
                  />
                </View>
                <Text style={styles.profileValue}>{userProfile.profile.budget}%</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>사진</Text>
                <View style={styles.profileBar}>
                  <View
                    style={[styles.profileBarFill, { width: `${userProfile.profile.photo}%` }]}
                  />
                </View>
                <Text style={styles.profileValue}>{userProfile.profile.photo}%</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>전통</Text>
                <View style={styles.profileBar}>
                  <View
                    style={[styles.profileBarFill, { width: `${userProfile.profile.tradition}%` }]}
                  />
                </View>
                <Text style={styles.profileValue}>{userProfile.profile.tradition}%</Text>
              </View>
            </View>
          </Card>
        )}

        {/* 좋아요한 여행지 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="heart" size={20} color={Colors.error} />
              <Text style={styles.sectionTitle}>좋아요한 여행지</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>전체보기</Text>
            </TouchableOpacity>
          </View>
          {savedTrips.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                아직 좋아요한 여행지가 없습니다
              </Text>
            </Card>
          ) : (
            savedTrips.map((trip) => (
              <Card key={trip.id} variant="elevated" style={styles.tripCard}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.tripSatisfaction}>
                  만족도 예측 {trip.satisfaction}%
                </Text>
              </Card>
            ))
          )}
        </View>

        {/* 저장된 코스 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="bookmark" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>저장된 코스</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>전체보기</Text>
            </TouchableOpacity>
          </View>
          <Card variant="outlined" style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              아직 저장된 코스가 없습니다
            </Text>
          </Card>
        </View>

        {/* 참여한 방 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="home" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>참여한 방</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>전체보기</Text>
            </TouchableOpacity>
          </View>
          {rooms.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                아직 참여한 방이 없습니다
              </Text>
            </Card>
          ) : (
            rooms.map((room) => (
              <Card key={room.id} variant="elevated" style={styles.roomCard}>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomParticipants}>
                    참여자 {room.participants}명
                  </Text>
                </View>
                <Button
                  title="입장하기"
                  onPress={() => {
                    navigation.navigate('Room', { roomId: room.id });
                  }}
                  variant="outline"
                  size="small"
                  style={styles.enterButton}
                  icon={<Icon name="arrow-right" size={14} color={Colors.primary} />}
                />
              </Card>
            ))
          )}
        </View>

        {/* 설정 */}
        <View style={styles.section}>
          <View style={[styles.sectionTitleContainer, styles.settingsTitleContainer]}>
            <Icon name="settings" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>설정</Text>
          </View>
          <Card variant="outlined" style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>회원 정보 수정</Text>
              <Icon name="arrow-right" size={18} color={Colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>알림 설정</Text>
              <Icon name="arrow-right" size={18} color={Colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>고객지원</Text>
              <Icon name="arrow-right" size={18} color={Colors.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Icon name="logout" size={18} color={Colors.error} style={styles.logoutIcon} />
              <Text style={[styles.settingText, styles.logoutText]}>로그아웃</Text>
            </TouchableOpacity>
          </Card>
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
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  profileCard: {
    marginBottom: 32,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsTitleContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  profileGrid: {
    marginTop: 16,
  },
  profileItem: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  profileBar: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  profileBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  profileValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tripCard: {
    marginBottom: 12,
    padding: 16,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  tripSatisfaction: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  roomCard: {
    marginBottom: 12,
    padding: 16,
  },
  roomInfo: {
    marginBottom: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  roomParticipants: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  enterButton: {
    alignSelf: 'flex-start',
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
    gap: 8,
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutText: {
    color: Colors.error,
  },
});
