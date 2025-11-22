import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import {
    HomeIcon,
    DiagnosisIcon,
    ShareIcon,
    UserIcon,
    HeartIcon,
    HeartOutlineIcon,
    ShareAltIcon,
    CommentIcon,
    RefreshIcon,
    ThumbsUpIcon,
    MapIcon,
    CameraIcon,
    NatureIcon,
    CultureIcon,
    FoodIcon,
    PhotoIcon,
    TravelIcon,
    StarIcon,
    BookmarkIcon,
    SettingsIcon,
    LogoutIcon,
    ArrowRightIcon,
    CheckIcon,
    LinkIcon,
    QrCodeIcon,
    UsersIcon,
    SparklesIcon,
} from '../assets/icons';

export type IconName =
    | 'home'
    | 'diagnosis'
    | 'share'
    | 'user'
    | 'heart'
    | 'heart-outline'
    | 'share-alt'
    | 'comment'
    | 'refresh'
    | 'thumbs-up'
    | 'map'
    | 'camera'
    | 'nature'
    | 'culture'
    | 'food'
    | 'photo'
    | 'travel'
    | 'star'
    | 'bookmark'
    | 'settings'
    | 'logout'
    | 'arrow-right'
    | 'check'
    | 'link'
    | 'qr-code'
    | 'users'
    | 'sparkles';

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    style?: any;
}

const iconMap: Record<IconName, React.ComponentType<{ size?: number; color?: string }>> = {
    'home': HomeIcon,
    'diagnosis': DiagnosisIcon,
    'share': ShareIcon,
    'user': UserIcon,
    'heart': HeartIcon,
    'heart-outline': HeartOutlineIcon,
    'share-alt': ShareAltIcon,
    'comment': CommentIcon,
    'refresh': RefreshIcon,
    'thumbs-up': ThumbsUpIcon,
    'map': MapIcon,
    'camera': CameraIcon,
    'nature': NatureIcon,
    'culture': CultureIcon,
    'food': FoodIcon,
    'photo': PhotoIcon,
    'travel': TravelIcon,
    'star': StarIcon,
    'bookmark': BookmarkIcon,
    'settings': SettingsIcon,
    'logout': LogoutIcon,
    'arrow-right': ArrowRightIcon,
    'check': CheckIcon,
    'link': LinkIcon,
    'qr-code': QrCodeIcon,
    'users': UsersIcon,
    'sparkles': SparklesIcon,
};

export default function Icon({
    name,
    size = 24,
    color = Colors.text,
    style
}: IconProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        return null;
    }

    return (
        <View style={[styles.container, style]}>
            <IconComponent size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

