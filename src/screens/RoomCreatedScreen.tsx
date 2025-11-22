import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import Card from '../components/Card';
import { Colors } from '../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoomCreatedRouteProp = RouteProp<RootStackParamList, 'RoomCreated'>;

export default function RoomCreatedScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoomCreatedRouteProp>();
  const { roomId, roomName, inviteCode, inviteLink } = route.params;

  const handleCopyLink = async () => {
    try {
      // TODO: 클립보드에 복사
      Alert.alert('복사 완료', '링크가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('링크 복사 오류:', error);
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `세대로드에서 여행을 함께 계획해요!\n초대 링크: ${inviteLink}`,
        title: '여행 방 초대',
      });
    } catch (error) {
      console.error('공유 오류:', error);
    }
  };

  const handleShowQR = () => {
    // TODO: QR 코드 표시
    Alert.alert('QR 코드', 'QR 코드 기능은 준비 중입니다.');
  };

  const handleEnterRoom = () => {
    navigation.replace('Room', { roomId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Icon name="check" size={64} color={Colors.success} style={styles.successIcon} />
          <Text style={styles.title}>방이 생성되었습니다</Text>
          <Text style={styles.subtitle}>
            아래 링크 또는 QR로 친구를 초대하세요!
          </Text>
        </View>

        <Card variant="highlight" style={styles.roomInfoCard}>
          <Text style={styles.roomName}>{roomName}</Text>
          <View style={styles.inviteCodeContainer}>
            <Text style={styles.inviteCodeLabel}>초대 코드</Text>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="링크 복사"
            onPress={handleCopyLink}
            variant="outline"
            size="medium"
            style={styles.actionButton}
            icon={<Icon name="link" size={18} color={Colors.primary} />}
          />
          <Button
            title="QR 코드"
            onPress={handleShowQR}
            variant="outline"
            size="medium"
            style={styles.actionButton}
            icon={<Icon name="qr-code" size={18} color={Colors.primary} />}
          />
        </View>

        <Button
          title="공유하기"
          onPress={handleShareLink}
          variant="primary"
          size="large"
          style={styles.shareButton}
          icon={<Icon name="share-alt" size={18} color={Colors.backgroundLight} />}
        />

        <Button
          title="방 입장하기"
          onPress={handleEnterRoom}
          variant="secondary"
          size="large"
          style={styles.enterButton}
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
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  roomInfoCard: {
    width: '100%',
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  inviteCodeContainer: {
    alignItems: 'center',
  },
  inviteCodeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inviteCode: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  shareButton: {
    width: '100%',
    marginBottom: 12,
  },
  enterButton: {
    width: '100%',
  },
});

