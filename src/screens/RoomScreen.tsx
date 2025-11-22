import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Colors } from '../constants/colors';
import { getRoomRecommendations, saveTrip, unsaveTrip } from '../services/api';
import { getRoomParticipants, getRoom, getRoomComments, getRoomVotes, createRoomComment, createRoomVote } from '../services/rooms';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoomRouteProp = RouteProp<RootStackParamList, 'Room'>;

interface Participant {
  id: string;
  name: string;
  generation: string;
  tag: string;
  profile?: {
    speed: number;
    stamina: number;
    budget: number;
    photo: number;
    tradition: number;
  };
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  course: string[];
  why: string;
  options: { [key: string]: string };
  satisfaction: { [key: string]: number };
  estimated_time?: string;
  estimated_cost?: string;
  talking_tip?: string;
}

export default function RoomScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoomRouteProp>();
  const { roomId } = route.params;
  const { user } = useAuth();

  const [roomName, setRoomName] = useState('여행 방');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [votes, setVotes] = useState<{ [tripId: string]: number }>({});
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [savedTrips, setSavedTrips] = useState<string[]>([]);

  useEffect(() => {
    loadRoomData();
    loadComments();
    loadVotes();
  }, []);

  const loadRoomData = async () => {
    try {
      // 방 정보 조회
      const roomResponse = await getRoom(roomId);
      if (roomResponse.room) {
        setRoomName(roomResponse.room.name);
      }

      // 참여자 정보 조회
      const participantsData = await getRoomParticipants(roomId);
      const participantsList = participantsData.participants.map((p: any) => ({
        id: p.id,
        name: p.name,
        generation: p.generation,
        tag: p.tag,
        profile: p.profile,
      }));
      setParticipants(participantsList);
    } catch (error) {
      console.error('방 데이터 로드 오류:', error);
    }
  };

  const handleGetRecommendations = async () => {
    if (participants.length < 1) {
      return;
    }

    setIsLoadingRecommendations(true);
    try {
      const recs = await getRoomRecommendations(roomId);

      if (!Array.isArray(recs)) {
        setRecommendations([]);
        return;
      }

      const formattedRecs: Recommendation[] = recs.map((rec: any) => ({
        id: rec.id || `rec_${Date.now()}_${Math.random()}`,
        title: rec.title || '추천 여행',
        description: rec.description || rec.why || '',
        why: rec.why || '',
        course: rec.course || [],
        satisfaction: rec.satisfaction || {},
        options: rec.options || {},
        estimated_time: rec.estimated_time || rec.estimatedTime,
        estimated_cost: rec.estimated_cost || rec.estimatedCost,
        talking_tip: rec.talking_tip || rec.talkingTip,
      }));

      setRecommendations(formattedRecs);
    } catch (error: any) {
      console.error('추천 로드 오류:', error);

      if (error.status === 500) {
        console.warn('서버에서 추천을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await getRoomComments(roomId);
      setComments(response.comments || []);
    } catch (error) {
      console.error('댓글 로드 오류:', error);
    }
  };

  const loadVotes = async () => {
    try {
      const response = await getRoomVotes(roomId);
      setVotes(response.votes || {});
    } catch (error) {
      console.error('투표 로드 오류:', error);
    }
  };

  const handleVote = async (tripId: string) => {
    if (!user) {
      return;
    }

    try {
      await createRoomVote(roomId, user.id, tripId);
      setVotes((prev) => ({
        ...prev,
        [tripId]: (prev[tripId] || 0) + 1,
      }));
    } catch (error) {
      console.error('투표 오류:', error);
    }
  };

  const handleLike = async (tripId: string) => {
    if (!user) {
      return;
    }

    try {
      if (savedTrips.includes(tripId)) {
        await unsaveTrip(user.id, tripId);
        setSavedTrips(savedTrips.filter((id) => id !== tripId));
      } else {
        await saveTrip(user.id, tripId);
        setSavedTrips([...savedTrips, tripId]);
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user) return;

    try {
      const response = await createRoomComment(roomId, user.id, commentText);

      setComments([...comments, response.comment]);
      setCommentText('');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
    }
  };

  const allParticipantsDiagnosed = participants.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 방 제목 */}
        <View style={styles.header}>
          <Text style={styles.roomTitle}>{roomName}</Text>
        </View>

        {/* 참여자 섹션 */}
        <Card variant="elevated" style={styles.participantsCard}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="users" size={20} color={Colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>참여자</Text>
          </View>
          {participants.map((p) => (
            <View key={p.id} style={styles.participantItem}>
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>{p.name}</Text>
                <View style={styles.participantTags}>
                  <Text style={styles.participantTag}>{p.generation}</Text>
                  <Text style={styles.participantTag}>{p.tag}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* 추천받기 전 상태 */}
        {recommendations.length === 0 && (
          <Card variant="info" style={styles.waitingCard}>
            <Text style={styles.waitingTitle}>
              모든 멤버가 여행 가치관 진단을 완료하면
            </Text>
            <Text style={styles.waitingText}>
              AI가 추천 여행지를 생성해드려요!
            </Text>
            <Button
              title="AI 추천받기"
              onPress={handleGetRecommendations}
              variant="primary"
              size="large"
              style={styles.recommendButton}
              disabled={!allParticipantsDiagnosed || isLoadingRecommendations}
              loading={isLoadingRecommendations}
              icon={!isLoadingRecommendations ? <Icon name="sparkles" size={18} color={Colors.backgroundLight} /> : undefined}
            />
            {!allParticipantsDiagnosed && (
              <Text style={styles.helperText}>
                최소 1명 이상의 참여자가 필요합니다
              </Text>
            )}
          </Card>
        )}

        {/* 추천 결과 */}
        {recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="map" size={20} color={Colors.primary} style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>
                세대별 감각을 조율한 여행지 추천
              </Text>
            </View>

            {recommendations.map((rec) => (
              <Card key={rec.id} variant="elevated" style={styles.recommendationCard}>
                {/* 분석 요약 */}
                <View style={styles.analysisSection}>
                  <View style={styles.analysisTitleContainer}>
                    <Icon name="diagnosis" size={18} color={Colors.primary} />
                    <Text style={styles.analysisTitle}>분석 요약</Text>
                  </View>
                  {participants.map((p) => (
                    <View key={p.id} style={styles.analysisItem}>
                      <Text style={styles.analysisName}>
                        {p.name}({p.generation}): {p.tag}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* AI 조율 정보 */}
                <View style={styles.coordinationSection}>
                  <View style={styles.analysisTitleContainer}>
                    <Icon name="sparkles" size={18} color={Colors.primary} />
                    <Text style={styles.coordinationTitle}>AI 조율</Text>
                  </View>
                  <Text style={styles.coordinationText}>
                    • 일정 속도: 15% 느리게{'\n'}
                    • 이동 동선: 최소 이동{'\n'}
                    • 음식: 전통 60% + 트렌드 40%{'\n'}
                    • 포토존: 동선 내 2곳만 최적화
                  </Text>
                </View>

                {/* 추천 코스 */}
                <View style={styles.courseSection}>
                  <View style={styles.courseTitleContainer}>
                    <Icon name="travel" size={20} color={Colors.primary} />
                    <Text style={styles.courseTitle}>{rec.title}</Text>
                  </View>
                  <View style={styles.placesList}>
                    {rec.course?.map((place: string, index: number) => (
                      <View key={index} style={styles.placeItem}>
                        <View style={styles.placeNumber}>
                          <Text style={styles.placeNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.placeText}>{place}</Text>
                        {index === rec.course.length - 1 && (
                          <Icon name="camera" size={20} color={Colors.primary} style={styles.photoIcon} />
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                {/* 세대별 옵션 */}
                {rec.options && Object.keys(rec.options).length > 0 && (
                  <View style={styles.optionsSection}>
                    <Text style={styles.optionsTitle}>세대별 옵션</Text>
                    <View style={styles.optionsTable}>
                      {Object.entries(rec.options).map(([key, value]) => (
                        <View key={key} style={styles.optionsRow}>
                          <Text style={styles.optionsLabel}>{key}</Text>
                          <Text style={styles.optionsValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* 여행 정보 */}
                {(rec.estimated_time || rec.estimated_cost) && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>📊 여행 정보</Text>
                    <View style={styles.infoRow}>
                      {rec.estimated_time && (
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>⏱ 소요 시간</Text>
                          <Text style={styles.infoValue}>{rec.estimated_time}</Text>
                        </View>
                      )}
                      {rec.estimated_cost && (
                        <View style={styles.infoItem}>
                          <Text style={styles.infoLabel}>💰 예상 비용</Text>
                          <Text style={styles.infoValue}>{rec.estimated_cost}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* 대화 팁 */}
                {rec.talking_tip && (
                  <View style={styles.talkingTipSection}>
                    <Text style={styles.talkingTipTitle}>💬 대화 팁</Text>
                    <Text style={styles.talkingTipText}>{rec.talking_tip}</Text>
                  </View>
                )}

                {/* 행동 버튼 */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(rec.id)}
                  >
                    <Icon
                      name={savedTrips.includes(rec.id) ? 'heart' : 'heart-outline'}
                      size={24}
                      color={savedTrips.includes(rec.id) ? Colors.error : Colors.textSecondary}
                      style={styles.actionIcon}
                    />
                    <Text style={styles.actionText}>좋아요</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="share-alt" size={24} color={Colors.textSecondary} style={styles.actionIcon} />
                    <Text style={styles.actionText}>공유</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="comment" size={24} color={Colors.textSecondary} style={styles.actionIcon} />
                    <Text style={styles.actionText}>댓글</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="refresh" size={24} color={Colors.textSecondary} style={styles.actionIcon} />
                    <Text style={styles.actionText}>다른 추천</Text>
                  </TouchableOpacity>
                </View>

                {/* 투표 섹션 */}
                <View style={styles.voteSection}>
                  <Text style={styles.voteCount}>
                    투표 {votes[rec.id] || 0}표
                  </Text>
                  <Button
                    title="투표하기"
                    onPress={() => handleVote(rec.id)}
                    variant="outline"
                    size="small"
                    style={styles.voteButton}
                    icon={<Icon name="thumbs-up" size={16} color={Colors.primary} />}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* 댓글 섹션 */}
        <View style={styles.commentsSection}>
          <View style={styles.sectionTitleContainer}>
            <Icon name="comment" size={20} color={Colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>댓글</Text>
          </View>

          {comments.length === 0 ? (
            <Card variant="outlined" style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                아직 댓글이 없습니다.{'\n'}
                첫 댓글을 남겨보세요!
              </Text>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} variant="outlined" style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.userName || '사용자'}</Text>
                  <Text style={styles.commentTime}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </Card>
            ))
          )}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Button
              title="전송"
              onPress={handleSendComment}
              variant="primary"
              size="small"
              style={styles.sendButton}
            />
          </View>
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
  roomTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  participantsCard: {
    marginBottom: 24,
    padding: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  sectionIcon: {
    marginRight: 4,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  analysisTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  courseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  participantItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  participantTags: {
    flexDirection: 'row',
    gap: 8,
  },
  participantTag: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  waitingCard: {
    marginBottom: 24,
    padding: 32,
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  waitingText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  recommendButton: {
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationCard: {
    marginBottom: 24,
    padding: 20,
  },
  analysisSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  analysisItem: {
    marginBottom: 8,
  },
  analysisName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  coordinationSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  coordinationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  coordinationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  courseSection: {
    marginBottom: 20,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  placesList: {
    marginBottom: 8,
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
    flexShrink: 0,
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
    flexShrink: 1,
    fontWeight: '500',
  },
  photoIcon: {
    marginLeft: 8,
    flexShrink: 0,
  },
  optionsSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  optionsTable: {
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    gap: 12,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flexShrink: 0,
  },
  optionsValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    flexShrink: 1,
    textAlign: 'right',
  },
  infoSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '700',
  },
  talkingTipSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  talkingTipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  talkingTipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flexShrink: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
    minWidth: 0,
  },
  actionIcon: {
    flexShrink: 0,
    width: 24,
    height: 24,
  },
  actionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    flexShrink: 1,
  },
  voteSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  voteButton: {
    paddingHorizontal: 16,
  },
  commentsSection: {
    marginBottom: 24,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  commentCard: {
    marginBottom: 12,
    padding: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  commentContent: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  commentInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: Colors.backgroundLight,
    minHeight: 50,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 30,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});
