import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { getPersonalRecommendations, saveTrip, unsaveTrip } from '../services/api';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Recommendation {
  id: string;
  title: string;
  description: string;
  places: string[];
  satisfaction: number;
  type: 'personal' | 'generation' | 'room';
  roomName?: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [savedTrips, setSavedTrips] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) {
      return;
    }

    try {
      const recs = await getPersonalRecommendations(user.id);

      // API 응답을 컴포넌트 형식에 맞게 변환
      const formattedRecs: Recommendation[] = recs.map((rec: any) => ({
        id: rec.id || `rec_${Date.now()}_${Math.random()}`,
        title: rec.title || '추천 여행',
        description: rec.description || '',
        places: rec.course || [],
        satisfaction: typeof rec.satisfaction === 'number'
          ? rec.satisfaction
          : Object.values(rec.satisfaction || {})[0] as number || 85,
        type: rec.type || 'personal',
        roomName: rec.roomName,
      }));

      setRecommendations(formattedRecs);
    } catch (error) {
      console.error('추천 로드 오류:', error);
      // 오류 발생 시 빈 배열로 설정
      setRecommendations([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const handleLike = (id: string) => {
    if (savedTrips.includes(id)) {
      setSavedTrips(savedTrips.filter((tripId) => tripId !== id));
    } else {
      setSavedTrips([...savedTrips, id]);
    }
  };

  const handleStartTrip = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요 👋</Text>
          <Text style={styles.title}>
            함께라서 더 특별한{'\n'}여행길을 만들어볼까요?
          </Text>
        </View>

        {/* CTA 버튼 */}
        <Button
          title="세대공감 여행 시작하기"
          onPress={handleStartTrip}
          variant="primary"
          size="large"
          style={styles.startButton}
          icon={<Icon name="arrow-right" size={18} color={Colors.backgroundLight} />}
        />

        {/* 추천 섹션 */}
        <View style={styles.recommendationsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="sparkles" size={20} color={Colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>AI 추천 여행지</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>전체보기</Text>
            </TouchableOpacity>
          </View>

          {recommendations.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Icon name="travel" size={64} color={Colors.textLight} style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>아직 추천이 없어요</Text>
                <Text style={styles.emptyText}>
                  여행 가치관 진단을 완료하면{'\n'}
                  맞춤형 추천을 받을 수 있어요!
                </Text>
                <Button
                  title="진단 시작하기"
                  onPress={() => navigation.navigate('Onboarding')}
                  variant="outline"
                  size="medium"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          ) : (
            recommendations.map((rec) => (
              <Card key={rec.id} variant="elevated" style={styles.recommendationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.cardTitle}>{rec.title}</Text>
                    {rec.roomName && (
                      <View style={styles.roomTag}>
                        <Text style={styles.roomTagText}>{rec.roomName}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleLike(rec.id)}
                    style={styles.likeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon
                      name={savedTrips.includes(rec.id) ? 'heart' : 'heart-outline'}
                      size={24}
                      color={savedTrips.includes(rec.id) ? Colors.error : Colors.textLight}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.cardDescription}>{rec.description}</Text>

                <View style={styles.placesList}>
                  {rec.places.map((place, index) => (
                    <View key={index} style={styles.placeItem}>
                      <View style={styles.placeNumber}>
                        <Text style={styles.placeNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.placeText}>{place}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.satisfactionBadge}>
                    <Text style={styles.satisfactionLabel}>만족도 예측</Text>
                    <Text style={styles.satisfactionValue}>{rec.satisfaction}%</Text>
                  </View>
                  <Button
                    title="자세히 보기"
                    onPress={() => {
                      // TODO: 상세 화면으로 이동
                    }}
                    variant="outline"
                    size="small"
                    style={styles.detailButton}
                    icon={<Icon name="arrow-right" size={16} color={Colors.primary} />}
                  />
                </View>
              </Card>
            ))
          )}
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
    padding: 20,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  startButton: {
    marginBottom: 32,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 48,
    marginBottom: 0,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 160,
  },
  recommendationCard: {
    marginBottom: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  roomTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  roomTagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  likeButton: {
    padding: 4,
  },
  likeIcon: {
    fontSize: 24,
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  placesList: {
    marginBottom: 20,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  placeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  placeNumberText: {
    color: Colors.backgroundLight,
    fontSize: 14,
    fontWeight: '700',
  },
  placeText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  satisfactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  satisfactionLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  satisfactionValue: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
  },
  detailButton: {
    paddingHorizontal: 20,
  },
});
